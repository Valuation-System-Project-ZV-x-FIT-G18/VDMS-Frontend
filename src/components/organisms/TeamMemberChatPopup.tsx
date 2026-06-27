import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { CloseOutlined, SendOutlined } from '@ant-design/icons';
import { messagingService } from '../../services/messagingService';
import type { ChatConversation, ChatMessage } from '../../services/messagingService';
import { theme } from '../../styles/theme';

interface TeamMemberChatPopupProps {
  open: boolean;
  valuationJobId?: string;
  currentUserId: string;
  currentUserName: string;
  currentUserRole?: string;
  recipientId: string;
  recipientName: string;
  recipientRole?: string;
  onClose: () => void;
}

const TeamMemberChatPopup = ({
  open,
  valuationJobId,
  currentUserId,
  currentUserName,
  currentUserRole,
  recipientId,
  recipientName,
  recipientRole,
  onClose,
}: TeamMemberChatPopupProps) => {
  const [conversation, setConversation] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const formattedJobId = useMemo(() => valuationJobId || 'N/A', [valuationJobId]);

  const loadMessages = async (conversationId: string) => {
    const list = await messagingService.listMessages(conversationId);
    setMessages(list);
    await messagingService.markConversationAsRead(conversationId, currentUserId);
  };

  useEffect(() => {
    if (!open) return;

    let active = true;
    const init = async () => {
      try {
        setLoading(true);
        const conv = await messagingService.startConversation({
          userId: currentUserId,
          userName: currentUserName,
          userRole: currentUserRole,
          otherUserId: recipientId,
          otherUserName: recipientName,
          otherUserRole: recipientRole,
          valuationJobId,
        });
        if (!active) return;
        setConversation(conv);
        await loadMessages(conv.id);
      } finally {
        if (active) setLoading(false);
      }
    };

    init();

    return () => {
      active = false;
    };
  }, [open, currentUserId, currentUserName, currentUserRole, recipientId, recipientName, recipientRole, valuationJobId]);

  useEffect(() => {
    if (!open || !conversation) return;

    const pollId = window.setInterval(() => {
      void loadMessages(conversation.id);
    }, 5000);

    return () => window.clearInterval(pollId);
  }, [open, conversation, currentUserId]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || !conversation) return;

    await messagingService.sendMessage({
      conversationId: conversation.id,
      senderId: currentUserId,
      senderName: currentUserName,
      recipientId,
      text,
      valuationJobId,
    });

    setInput('');
    await loadMessages(conversation.id);
  };

  if (!open) return null;

  const overlayStyle: CSSProperties = {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.35)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3000,
  };

  const boxStyle: CSSProperties = {
    width: '92%',
    maxWidth: '520px',
    height: '70vh',
    backgroundColor: '#fff',
    borderRadius: '12px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    border: `1px solid ${theme.colors.border}`,
  };

  const headerStyle: CSSProperties = {
    padding: '14px 16px',
    borderBottom: `1px solid ${theme.colors.border}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const messagesStyle: CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    padding: '14px',
    backgroundColor: '#f8fafc',
  };

  const rowStyle = (isMine: boolean): CSSProperties => ({
    display: 'flex',
    justifyContent: isMine ? 'flex-end' : 'flex-start',
    marginBottom: '10px',
  });

  const bubbleStyle = (isMine: boolean): CSSProperties => ({
    maxWidth: '78%',
    padding: '10px 12px',
    borderRadius: '10px',
    fontSize: '13px',
    backgroundColor: isMine ? theme.colors.primary.main : '#fff',
    color: isMine ? '#fff' : theme.colors.text.primary,
    border: isMine ? 'none' : `1px solid ${theme.colors.border}`,
  });

  const footerStyle: CSSProperties = {
    borderTop: `1px solid ${theme.colors.border}`,
    display: 'flex',
    gap: '8px',
    padding: '10px',
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={boxStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '14px' }}>{recipientName}</div>
            <div style={{ fontSize: '12px', color: theme.colors.text.secondary }}>
              Valuation Job: {formattedJobId}
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <CloseOutlined />
          </button>
        </div>

        <div style={messagesStyle}>
          {loading && <div style={{ fontSize: '13px', color: theme.colors.text.secondary }}>Loading messages...</div>}
          {!loading && messages.length === 0 && (
            <div style={{ fontSize: '13px', color: theme.colors.text.secondary }}>
              No messages yet. Start the conversation.
            </div>
          )}
          {messages.map((msg) => {
            const isMine = msg.senderId === currentUserId;
            return (
              <div key={msg.id} style={rowStyle(isMine)}>
                <div style={bubbleStyle(isMine)}>
                  {msg.text}
                  <div style={{ marginTop: '4px', fontSize: '10px', opacity: 0.8 }}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={footerStyle}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                void handleSend();
              }
            }}
            placeholder="Type your message..."
            style={{
              flex: 1,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: '8px',
              padding: '10px',
              fontSize: '13px',
              outline: 'none',
            }}
          />
          <button
            onClick={() => void handleSend()}
            style={{
              border: 'none',
              borderRadius: '8px',
              backgroundColor: theme.colors.primary.main,
              color: '#fff',
              width: '42px',
              cursor: 'pointer',
            }}
          >
            <SendOutlined />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberChatPopup;
