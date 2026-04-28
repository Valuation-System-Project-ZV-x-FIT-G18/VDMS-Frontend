import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { MessageOutlined, SendOutlined } from '@ant-design/icons';
import { messagingService } from '../../services/messagingService';
import type { ChatConversation, ChatMessage } from '../../services/messagingService';
import { getChatIdentity } from '../../services/chatIdentity';
import { theme } from '../../styles/theme';
import { uiDefaults } from '../../config/portalConfig';

interface FloatingChatWidgetProps {
  role?: string;
  userNameHint?: string;
}

const receiverRoles = new Set(['coordinator', 'technical-officer', 'l1-manager', 'l2-manager', 'l3-manager']);

const areMessagesEqual = (left: ChatMessage[], right: ChatMessage[]) => {
  if (left.length !== right.length) {
    return false;
  }

  return left.every((message, index) => {
    const candidate = right[index];
    return (
      message.id === candidate.id &&
      message.text === candidate.text &&
      message.senderId === candidate.senderId &&
      message.createdAt === candidate.createdAt
    );
  });
};

const areConversationsEqual = (left: ChatConversation[], right: ChatConversation[], userId: string) => {
  if (left.length !== right.length) {
    return false;
  }

  return left.every((conversation, index) => {
    const candidate = right[index];
    return (
      conversation.id === candidate.id &&
      conversation.updatedAt === candidate.updatedAt &&
      conversation.lastMessage === candidate.lastMessage &&
      conversation.valuationJobId === candidate.valuationJobId &&
      (conversation.unreadBy?.[userId] || 0) === (candidate.unreadBy?.[userId] || 0)
    );
  });
};

/**
 * Provides compact real-time chat for operational roles while remaining non-invasive to page layout.
 */
const FloatingChatWidget = ({ role, userNameHint }: FloatingChatWidgetProps) => {
  const [open, setOpen] = useState(false);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const isSinglePaneRole = role === 'l1-manager';

  const identity = useMemo(
    () => getChatIdentity((role as Parameters<typeof getChatIdentity>[0]) || undefined, userNameHint),
    [role, userNameHint],
  );

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === selectedConversationId) || null,
    [conversations, selectedConversationId],
  );

  const markConversationReadLocally = useCallback(
    (conversationId: string) => {
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId
            ? {
                ...conv,
                unreadBy: {
                  ...(conv.unreadBy || {}),
                  [identity.id]: 0,
                },
              }
            : conv,
        ),
      );
    },
    [identity.id],
  );

  /**
   * Keeps sidebar conversations fresh so unread badges and latest previews stay accurate.
   */
  const refreshConversations = useCallback(async () => {
    try {
      const list = await messagingService.listConversations(identity.id, identity.role);
      const nextConversations = list;
      setConversations((prev) => (areConversationsEqual(prev, nextConversations, identity.id) ? prev : nextConversations));

      if (!selectedConversationId && list.length > 0) {
        setSelectedConversationId(list[0].id);
      }
    } catch (error) {
      console.error('Failed to refresh conversations:', error);
    }
  }, [identity.id, identity.role, selectedConversationId]);

  /**
   * Refreshes the active thread independently to avoid resetting the whole panel.
   */
  const refreshMessages = useCallback(async (conversationId: string) => {
    try {
      const list = await messagingService.listMessages(conversationId);
      setMessages((prev) => (areMessagesEqual(prev, list) ? prev : list));
    } catch (error) {
      console.error('Failed to refresh messages:', error);
    }
  }, []);

  const markConversationAsRead = useCallback(async (conversationId: string) => {
    markConversationReadLocally(conversationId);

    try {
      await messagingService.markConversationAsRead(conversationId, identity.id);
    } catch (error) {
      console.error('Failed to mark conversation as read:', error);
    } finally {
      await refreshConversations();
    }
  }, [identity.id, markConversationReadLocally, refreshConversations]);

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    void markConversationAsRead(conversationId);
  };

  useEffect(() => {
    if (!role || !receiverRoles.has(role)) return;
    const kickoffId = window.setTimeout(() => {
      void refreshConversations();
    }, 0);

    return () => window.clearTimeout(kickoffId);
  }, [role, refreshConversations]);

  useEffect(() => {
    if (!role || !receiverRoles.has(role)) return;

    const pollId = window.setInterval(() => {
      void (async () => {
        if (selectedConversationId) {
          await refreshMessages(selectedConversationId);
        }
        await refreshConversations();
      })();
    }, uiDefaults.chatPollIntervalMs);

    return () => window.clearInterval(pollId);
  }, [role, selectedConversationId, refreshConversations, refreshMessages]);

  useEffect(() => {
    if (!role || !receiverRoles.has(role) || !selectedConversationId) {
      return;
    }

    const preloadThreadId = window.setTimeout(() => {
      void refreshMessages(selectedConversationId);
    }, 0);

    return () => window.clearTimeout(preloadThreadId);
  }, [role, selectedConversationId, refreshMessages]);

  useEffect(() => {
    if (!open || !selectedConversationId) {
      return;
    }

    void markConversationAsRead(selectedConversationId);
  }, [open, selectedConversationId, markConversationAsRead]);

  /**
   * Sends only non-empty messages and then reloads both thread and conversation summaries.
   */
  const handleSend = async () => {
    if (!activeConversation) return;

    const text = input.trim();
    if (!text) return;

    const recipientId = activeConversation.participantIds.find((id) => id !== identity.id);
    if (!recipientId) return;

    try {
      await messagingService.sendMessage({
        conversationId: activeConversation.id,
        senderId: identity.id,
        senderName: identity.name,
        recipientId,
        text,
        valuationJobId: activeConversation.valuationJobId,
      });

      setInput('');
      await refreshMessages(activeConversation.id);
      await refreshConversations();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  if (!role || !receiverRoles.has(role)) {
    return null;
  }

  const wrapperStyle: CSSProperties = {
    position: 'fixed',
    right: '20px',
    bottom: '20px',
    zIndex: 2600,
  };

  const fabStyle: CSSProperties = {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: theme.colors.primary.main,
    color: '#fff',
    boxShadow: '0 12px 24px rgba(0,0,0,0.22)',
    position: 'relative',
  };

  const panelStyle: CSSProperties = {
    position: 'absolute',
    right: 0,
    bottom: '68px',
    width: isSinglePaneRole ? '420px' : '360px',
    height: '470px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    border: `1px solid ${theme.colors.border}`,
    overflow: 'hidden',
    display: 'flex',
    boxShadow: '0 20px 32px rgba(15,23,42,0.2)',
    willChange: 'opacity, transform',
  };

  const panelVisibilityStyle: CSSProperties = {
    opacity: open ? 1 : 0,
    transform: open ? 'translateY(0)' : 'translateY(8px)',
    visibility: open ? 'visible' : 'hidden',
    pointerEvents: open ? 'auto' : 'none',
    transition: open
      ? 'opacity 160ms ease, transform 160ms ease'
      : 'opacity 120ms ease, transform 120ms ease, visibility 0s linear 120ms',
  };

  return (
    <div style={wrapperStyle}>
      <div style={{ ...panelStyle, ...panelVisibilityStyle }} aria-hidden={!open}>
          {!isSinglePaneRole && (
            <div style={{ width: '38%', borderRight: `1px solid ${theme.colors.border}`, overflowY: 'auto' }}>
              <div style={{ padding: '10px 12px', fontSize: '13px', fontWeight: 600 }}>Messages</div>
              {conversations.map((c) => {
                const otherId = c.participantIds.find((id) => id !== identity.id) || 'Unknown';
                const otherName = c.participantNames?.[otherId] || otherId;
                return (
                  <button
                    key={c.id}
                    style={{
                      width: '100%',
                      border: 'none',
                      textAlign: 'left',
                      backgroundColor: selectedConversationId === c.id ? '#f0f5ff' : '#fff',
                      padding: '10px 12px',
                      borderTop: `1px solid ${theme.colors.border}`,
                      cursor: 'pointer',
                    }}
                    onClick={() => handleSelectConversation(c.id)}
                  >
                    <div style={{ fontSize: '12px', fontWeight: 600 }}>{otherName}</div>
                    <div style={{ fontSize: '11px', color: theme.colors.text.secondary, marginTop: '2px' }}>
                      Job ID: {c.valuationJobId || 'N/A'}
                    </div>
                    <div style={{ fontSize: '11px', color: theme.colors.text.secondary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {c.lastMessage || 'No messages yet'}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '10px 12px', borderBottom: `1px solid ${theme.colors.border}`, fontSize: '12px', fontWeight: 600 }}>
              {activeConversation ? 'Conversation' : 'Select a conversation'}
              {activeConversation && (
                <div style={{ marginTop: '6px', fontSize: '11px', fontWeight: 400, color: theme.colors.text.secondary }}>
                  <div>Valuation Job ID: {activeConversation.valuationJobId || 'N/A'}</div>
                </div>
              )}
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '10px', backgroundColor: '#f8fafc' }}>
              {messages.map((m) => {
                const mine = m.senderId === identity.id;
                return (
                  <div key={m.id} style={{ display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start', marginBottom: '8px' }}>
                    <div style={{
                      maxWidth: '85%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      backgroundColor: mine ? theme.colors.primary.main : '#fff',
                      color: mine ? '#fff' : theme.colors.text.primary,
                      border: mine ? 'none' : `1px solid ${theme.colors.border}`,
                    }}>
                      {m.text}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: '8px', padding: '8px', borderTop: `1px solid ${theme.colors.border}` }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    void handleSend();
                  }
                }}
                placeholder="Reply..."
                style={{
                  flex: 1,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '8px',
                  padding: '8px',
                  fontSize: '12px',
                  outline: 'none',
                }}
                disabled={!activeConversation}
              />
              <button
                onClick={() => void handleSend()}
                style={{ border: 'none', borderRadius: '8px', width: '36px', cursor: 'pointer', backgroundColor: theme.colors.primary.main, color: '#fff' }}
                disabled={!activeConversation}
              >
                <SendOutlined />
              </button>
            </div>
          </div>
      </div>

      <button style={fabStyle} onClick={() => setOpen((v) => !v)}>
        <MessageOutlined style={{ fontSize: '22px' }} />
      </button>
    </div>
  );
};

export default FloatingChatWidget;
