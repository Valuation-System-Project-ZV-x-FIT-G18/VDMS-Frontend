import { useState } from 'react';
import type { CSSProperties } from 'react';
import {
  SendOutlined,
  PaperClipOutlined,
  DownloadOutlined,
  CloseOutlined,
  SmileOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { theme } from '../../styles/theme';

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  isSent: boolean;
  file?: {
    name: string;
    size: string;
    url: string;
  };
}

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread?: number;
  avatar: string;
}

const MessagingSystem = ({ onClose }: { onClose: () => void }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<string>('1');
  const [messageInput, setMessageInput] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);

  // Mock conversations - will come from API
  const conversations: Conversation[] = [
    {
      id: '1',
      name: 'John Doe',
      lastMessage: 'Waiting for the inspection report to proceed',
      timestamp: '10:45 AM',
      unread: 0,
      avatar: 'JD',
    },
    {
      id: '2',
      name: 'ABC Corp - Sarah Jen',
      lastMessage: 'The documents have been uploaded for review',
      timestamp: 'Oct 24',
      unread: 2,
      avatar: 'SJ',
    },
    {
      id: '3',
      name: 'Michael Smith',
      lastMessage: 'Property photos are now in the shared folder',
      timestamp: 'Oct 24',
      unread: 0,
      avatar: 'MS',
    },
    {
      id: '4',
      name: 'RealEstate Partners',
      lastMessage: 'Confirmation of receipt for the final valuation',
      timestamp: 'Oct 23',
      unread: 0,
      avatar: 'RP',
    },
  ];

  // Mock messages - will come from API
  const messages: Message[] = [
    {
      id: '1',
      sender: 'John Doe',
      text: 'Hi, I just wanted to check if you received the initial floor plan documents I sent last night?',
      timestamp: '09:15',
      isSent: false,
    },
    {
      id: '2',
      sender: 'You',
      text: 'Yes, John! Ive received them. I am currently reviewing the floor plans. However, we are still missing the signed inspection consent form for the basement access.',
      timestamp: '09:23 AM',
      isSent: true,
    },
    {
      id: '3',
      sender: 'John Doe',
      text: 'I just uploaded the signed consent form. Please let me know if everything is in order now. Waiting for the inspection report to proceed!',
      timestamp: '09:45',
      isSent: false,
    },
    {
      id: '4',
      sender: 'You',
      text: '',
      timestamp: '10:12 AM',
      isSent: true,
      file: {
        name: 'Inspection_Consent_v2.pdf',
        size: 'PDF • 1.2 MB',
        url: '#',
      },
    },
  ];

  const templates = [
    'Could you please provide the missing documents?',
    'The inspection has been scheduled for [DATE]',
    'Your valuation report is ready for review',
    'Payment confirmation received',
    'Please upload the signed consent form',
  ];

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    
    // TODO: Send message via WebSocket/API
    console.log('Sending message:', messageInput);
    setMessageInput('');
  };

  const handleFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // TODO: Upload file and send via API
        console.log('Uploading file:', file.name);
        alert(`File "${file.name}" will be uploaded and sent`);
      }
    };
    input.click();
  };

  const applyTemplate = (template: string) => {
    setMessageInput(template);
    setShowTemplates(false);
  };

  // Styles
  const overlayStyle: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
  };

  const containerStyle: CSSProperties = {
    width: '90%',
    maxWidth: '1000px',
    height: '80vh',
    backgroundColor: 'white',
    borderRadius: '12px',
    display: 'flex',
    overflow: 'hidden',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
  };

  const sidebarStyle: CSSProperties = {
    width: '320px',
    borderRight: '1px solid #f0f0f0',
    display: 'flex',
    flexDirection: 'column',
  };

  const headerStyle: CSSProperties = {
    padding: '20px',
    borderBottom: '1px solid #f0f0f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const titleStyle: CSSProperties = {
    fontSize: '20px',
    fontWeight: 600,
    color: theme.colors.text.primary,
  };

  const searchBoxStyle: CSSProperties = {
    padding: '12px 20px',
    borderBottom: '1px solid #f0f0f0',
  };

  const searchInputStyle: CSSProperties = {
    width: '100%',
    padding: '10px 16px 10px 40px',
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%238c8c8c\' stroke-width=\'2\'%3E%3Ccircle cx=\'11\' cy=\'11\' r=\'8\'/%3E%3Cpath d=\'m21 21-4.35-4.35\'/%3E%3C/svg%3E")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '12px center',
  };

  const conversationListStyle: CSSProperties = {
    flex: 1,
    overflowY: 'auto',
  };

  const conversationItemStyle = (isSelected: boolean): CSSProperties => ({
    padding: '16px 20px',
    borderBottom: '1px solid #f5f5f5',
    cursor: 'pointer',
    backgroundColor: isSelected ? '#f0f5ff' : 'white',
    display: 'flex',
    gap: '12px',
    transition: 'background-color 0.2s',
  });

  const avatarStyle: CSSProperties = {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#e6f4ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.colors.primary.main,
    fontWeight: 600,
    fontSize: '16px',
    flexShrink: 0,
  };

  const chatAreaStyle: CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  };

  const chatHeaderStyle: CSSProperties = {
    padding: '20px 24px',
    borderBottom: '1px solid #f0f0f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const messagesContainerStyle: CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    padding: '24px',
    backgroundColor: '#fafafa',
  };

  const dateHeaderStyle: CSSProperties = {
    textAlign: 'center',
    fontSize: '12px',
    color: theme.colors.text.secondary,
    marginBottom: '20px',
  };

  const messageRowStyle = (isSent: boolean): CSSProperties => ({
    display: 'flex',
    justifyContent: isSent ? 'flex-end' : 'flex-start',
    marginBottom: '16px',
    gap: '12px',
  });

  const messageBubbleStyle = (isSent: boolean): CSSProperties => ({
    maxWidth: '70%',
    padding: '12px 16px',
    borderRadius: '12px',
    backgroundColor: isSent ? theme.colors.primary.main : 'white',
    color: isSent ? 'white' : theme.colors.text.primary,
    fontSize: '14px',
    lineHeight: '1.5',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
  });

  const fileMessageStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    backgroundColor: 'white',
    border: '1px solid #d9d9d9',
    borderRadius: '8px',
    maxWidth: '300px',
  };

  const timeStampStyle = (isSent: boolean): CSSProperties => ({
    fontSize: '11px',
    color: theme.colors.text.secondary,
    marginTop: '4px',
    textAlign: isSent ? 'right' : 'left',
  });

  const inputAreaStyle: CSSProperties = {
    padding: '16px 24px',
    borderTop: '1px solid #f0f0f0',
    backgroundColor: 'white',
  };

  const inputRowStyle: CSSProperties = {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    marginTop: '12px',
  };

  const messageInputStyle: CSSProperties = {
    flex: 1,
    padding: '12px 16px',
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
  };

  const iconButtonStyle: CSSProperties = {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    border: `1px solid ${theme.colors.border}`,
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '18px',
    color: theme.colors.text.secondary,
  };

  const sendButtonStyle: CSSProperties = {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: theme.colors.primary.main,
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '18px',
  };

  const templateDropdownStyle: CSSProperties = {
    position: 'absolute',
    bottom: '60px',
    left: '24px',
    width: '400px',
    backgroundColor: 'white',
    border: '1px solid #e8e8e8',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    maxHeight: '200px',
    overflowY: 'auto',
    zIndex: 10,
  };

  const templateItemStyle: CSSProperties = {
    padding: '12px 16px',
    borderBottom: '1px solid #f5f5f5',
    cursor: 'pointer',
    fontSize: '14px',
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={containerStyle} onClick={(e) => e.stopPropagation()}>
        
        {/* Sidebar - Conversation List */}
        <div style={sidebarStyle}>
          <div style={headerStyle}>
            <h2 style={titleStyle}>Messages</h2>
          </div>

          <div style={searchBoxStyle}>
            <input
              type="text"
              placeholder="Search Project ID or Client"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={searchInputStyle}
            />
          </div>

          <div style={conversationListStyle}>
            {filteredConversations.map((conv) => (
              <div
                key={conv.id}
                style={conversationItemStyle(selectedConversation === conv.id)}
                onClick={() => setSelectedConversation(conv.id)}
                onMouseEnter={(e) => {
                  if (selectedConversation !== conv.id) {
                    e.currentTarget.style.backgroundColor = '#fafafa';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedConversation !== conv.id) {
                    e.currentTarget.style.backgroundColor = 'white';
                  }
                }}
              >
                <div style={avatarStyle}>{conv.avatar}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: theme.colors.text.primary }}>
                      {conv.name}
                    </span>
                    <span style={{ fontSize: '12px', color: theme.colors.text.secondary }}>
                      {conv.timestamp}
                    </span>
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: theme.colors.text.secondary,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {conv.lastMessage}
                  </div>
                </div>
                {conv.unread && conv.unread > 0 && (
                  <div style={{
                    minWidth: '20px',
                    height: '20px',
                    borderRadius: '10px',
                    backgroundColor: theme.colors.primary.main,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 600,
                  }}>
                    {conv.unread}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div style={chatAreaStyle}>
          <div style={chatHeaderStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={avatarStyle}>JD</div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 600 }}>John Doe</div>
                <div style={{ fontSize: '12px', color: theme.colors.text.secondary }}>Online</div>
              </div>
            </div>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }} onClick={onClose}>
              <CloseOutlined />
            </button>
          </div>

          <div style={messagesContainerStyle}>
            <div style={dateHeaderStyle}>October 25, 2023</div>

            {messages.map((msg) => (
              <div key={msg.id} style={messageRowStyle(msg.isSent)}>
                {!msg.isSent && <div style={{ ...avatarStyle, width: '32px', height: '32px', fontSize: '12px' }}>JD</div>}
                
                <div>
                  {msg.file ? (
                    <div style={fileMessageStyle}>
                      <FileTextOutlined style={{ fontSize: '24px', color: theme.colors.primary.main }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: 500 }}>{msg.file.name}</div>
                        <div style={{ fontSize: '11px', color: theme.colors.text.secondary }}>{msg.file.size}</div>
                      </div>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.colors.primary.main }}>
                        <DownloadOutlined style={{ fontSize: '18px' }} />
                      </button>
                    </div>
                  ) : (
                    <div style={messageBubbleStyle(msg.isSent)}>
                      {msg.text}
                    </div>
                  )}
                  <div style={timeStampStyle(msg.isSent)}>{msg.timestamp}</div>
                  {msg.isSent && (
                    <div style={{ ...timeStampStyle(msg.isSent), color: theme.colors.text.secondary }}>
                      Coordinator (You)
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div style={inputAreaStyle}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', position: 'relative' }}>
              <button
                style={iconButtonStyle}
                onClick={() => setShowTemplates(!showTemplates)}
              >
                <FileTextOutlined />
              </button>

              {showTemplates && (
                <div style={templateDropdownStyle}>
                  {templates.map((template, index) => (
                    <div
                      key={index}
                      style={templateItemStyle}
                      onClick={() => applyTemplate(template)}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                      {template}
                    </div>
                  ))}
                </div>
              )}

              <span style={{ fontSize: '12px', color: theme.colors.text.secondary, display: 'flex', alignItems: 'center' }}>
                Use Template
              </span>
            </div>

            <div style={inputRowStyle}>
              <button style={iconButtonStyle} onClick={handleFileUpload}>
                <PaperClipOutlined />
              </button>
              <button style={iconButtonStyle}>
                <SmileOutlined />
              </button>
              <input
                type="text"
                placeholder="Type your message here..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                style={messageInputStyle}
              />
              <button style={sendButtonStyle} onClick={handleSendMessage}>
                <SendOutlined />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MessagingSystem;