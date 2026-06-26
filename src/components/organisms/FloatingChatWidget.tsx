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

/**
 * Provides compact real-time chat for operational roles while remaining non-invasive to page layout.
 */
const FloatingChatWidget = ({ role, userNameHint }: FloatingChatWidgetProps) => {
  const [open, setOpen] = useState(false);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');

  const identity = useMemo(
    () => getChatIdentity((role as Parameters<typeof getChatIdentity>[0]) || undefined, userNameHint),
    [role, userNameHint],
  );

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === selectedConversationId) || null,
    [conversations, selectedConversationId],
  );

  /**
   * Keeps sidebar conversations fresh so unread badges and latest previews stay accurate.
   */
  const refreshConversations = useCallback(async () => {
    try {
      const list = await messagingService.listConversations(identity.id, identity.role);
      setConversations(list);
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
      setMessages(list);
    } catch (error) {
      console.error('Failed to refresh messages:', error);
    }
  }, []);

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
      void refreshConversations();
      if (selectedConversationId) {
        void refreshMessages(selectedConversationId);
      }
    }, uiDefaults.chatPollIntervalMs);

    return () => window.clearInterval(pollId);
  }, [role, selectedConversationId, refreshConversations, refreshMessages]);

  useEffect(() => {
    if (!selectedConversationId) {
      return;
    }

    const loadThreadId = window.setTimeout(() => {
      void refreshMessages(selectedConversationId);
    }, 0);
    void messagingService.markConversationAsRead(selectedConversationId, identity.id).then(refreshConversations);

    return () => window.clearTimeout(loadThreadId);
  }, [selectedConversationId, identity.id, refreshConversations, refreshMessages]);

  const unreadCount = useMemo(
    () => conversations.reduce((sum, c) => sum + (c.unreadBy?.[identity.id] || 0), 0),
    [conversations, identity.id],
  );

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
    width: '360px',
    height: '470px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    border: `1px solid ${theme.colors.border}`,
    overflow: 'hidden',
    display: 'flex',
    boxShadow: '0 20px 32px rgba(15,23,42,0.2)',
  };

  return (
    <div style={wrapperStyle}>
      {open && (
        <div style={panelStyle}>
          <div style={{ width: '38%', borderRight: `1px solid ${theme.colors.border}`, overflowY: 'auto' }}>
            <div style={{ padding: '10px 12px', fontSize: '13px', fontWeight: 600 }}>Messages</div>
            {conversations.map((c) => {
              const otherId = c.participantIds.find((id) => id !== identity.id) || 'Unknown';
              const otherName = c.participantNames?.[otherId] || otherId;
              const unread = c.unreadBy?.[identity.id] || 0;
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
                  onClick={() => setSelectedConversationId(c.id)}
                >
                  <div style={{ fontSize: '12px', fontWeight: 600 }}>{otherName}</div>
                  <div style={{ fontSize: '11px', color: theme.colors.text.secondary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {c.lastMessage || 'No messages yet'}
                  </div>
                  {unread > 0 && (
                    <span style={{
                      marginTop: '6px',
                      display: 'inline-block',
                      minWidth: '18px',
                      height: '18px',
                      borderRadius: '9px',
                      padding: '0 6px',
                      lineHeight: '18px',
                      fontSize: '10px',
                      color: '#fff',
                      backgroundColor: '#ef4444',
                    }}>{unread}</span>
                  )}
                </button>
              );
            })}
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '10px 12px', borderBottom: `1px solid ${theme.colors.border}`, fontSize: '12px', fontWeight: 600 }}>
              {activeConversation ? 'Conversation' : 'Select a conversation'}
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
      )}

      <button style={fabStyle} onClick={() => setOpen((v) => !v)}>
        <MessageOutlined style={{ fontSize: '22px' }} />
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-4px',
              right: '-2px',
              minWidth: '20px',
              height: '20px',
              lineHeight: '20px',
              borderRadius: '10px',
              backgroundColor: '#ef4444',
              color: '#fff',
              fontSize: '11px',
              fontWeight: 700,
              padding: '0 6px',
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
};

export default FloatingChatWidget;
