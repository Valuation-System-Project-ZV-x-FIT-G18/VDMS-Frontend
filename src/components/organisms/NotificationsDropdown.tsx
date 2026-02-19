import { useState } from 'react';
import type { CSSProperties } from 'react';
import { BellOutlined, CloseOutlined } from '@ant-design/icons';
import { theme } from '../../styles/theme';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message?: string;
  timestamp: string;
  read: boolean;
}

const NotificationsDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAllModal, setShowAllModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  // Mock notifications - will come from API/WebSocket later
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      title: 'Project #2023-003 Report completed',
      message: 'The valuation report for Project #2023-003 has been completed and is ready for review. The property located at 89 Duplication Rd, Col 03 has been valued at LKR 45,000,000.',
      timestamp: '2 minutes ago',
      read: false,
    },
    {
      id: '2',
      type: 'warning',
      title: 'Documents missing for Project #2023-002',
      message: 'The following documents are still pending for Project #2023-002: Survey Plan, Deed Copy (Prior 30 Years). Please upload these documents to proceed with the valuation process.',
      timestamp: '1 hour ago',
      read: false,
    },
    {
      id: '3',
      type: 'error',
      title: 'Invoice due for Project #2023-004',
      message: 'Payment for Project #2023-004 is overdue. The invoice amount of LKR 150,000 was due on October 20, 2023. Please process the payment to avoid any delays.',
      timestamp: '3 hours ago',
      read: false,
    },
    {
      id: '4',
      type: 'info',
      title: 'New message from Support Team',
      message: 'You have received a new message regarding your query about property valuation guidelines. Our support team has provided detailed information about the latest regulations.',
      timestamp: 'Yesterday',
      read: false,
    },
    {
      id: '5',
      type: 'info',
      title: 'Weekly Summary Available',
      message: 'Your weekly summary report for October 16-22, 2023 is now available. This week you had 5 new projects, 3 completed valuations, and 2 pending payments.',
      timestamp: '2 days ago',
      read: true,
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    setSelectedNotification(notification);
    setIsOpen(false);
  };

  const getColorByType = (type: Notification['type']) => {
    const colors = {
      success: '#52c41a',
      warning: '#faad14',
      error: '#ff4d4f',
      info: '#1890ff',
    };
    return colors[type];
  };

  // Styles
  const bellButtonStyle: CSSProperties = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'white',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  };

  const badgeStyle: CSSProperties = {
    position: 'absolute',
    top: '6px',
    right: '6px',
    width: '18px',
    height: '18px',
    backgroundColor: '#ff4d4f',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: 600,
    color: 'white',
  };

  const dropdownStyle: CSSProperties = {
    position: 'absolute',
    top: '50px',
    right: '0',
    width: '380px',
    maxHeight: '500px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    zIndex: 1000,
    overflow: 'hidden',
  };

  const dropdownHeaderStyle: CSSProperties = {
    padding: '16px 20px',
    borderBottom: '1px solid #f0f0f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const titleStyle: CSSProperties = {
    fontSize: '16px',
    fontWeight: 600,
    color: theme.colors.text.primary,
  };

  const viewAllButtonStyle: CSSProperties = {
    background: 'none',
    border: 'none',
    color: theme.colors.primary.main,
    fontSize: '14px',
    cursor: 'pointer',
    fontWeight: 500,
  };

  const notificationListStyle: CSSProperties = {
    maxHeight: '400px',
    overflowY: 'auto',
  };

  const notificationItemStyle = (read: boolean): CSSProperties => ({
    padding: '16px 20px',
    borderBottom: '1px solid #f0f0f0',
    cursor: 'pointer',
    backgroundColor: read ? 'white' : '#f6ffed',
    transition: 'background-color 0.2s',
    display: 'flex',
    gap: '12px',
  });

  const notificationDotStyle = (color: string): CSSProperties => ({
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: color,
    marginTop: '6px',
    flexShrink: 0,
  });

  const notificationContentStyle: CSSProperties = {
    flex: 1,
  };

  const notificationTitleStyle: CSSProperties = {
    fontSize: '14px',
    fontWeight: 500,
    color: theme.colors.text.primary,
    marginBottom: '4px',
  };

  const notificationTimeStyle: CSSProperties = {
    fontSize: '12px',
    color: theme.colors.text.secondary,
  };

  const modalOverlayStyle: CSSProperties = {
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

  const modalContentStyle: CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '32px',
    maxWidth: '600px',
    width: '90%',
    maxHeight: '80vh',
    overflow: 'auto',
    position: 'relative',
  };

  const modalHeaderStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
  };

  const modalTitleStyle: CSSProperties = {
    fontSize: '20px',
    fontWeight: 600,
    color: theme.colors.text.primary,
    marginBottom: '8px',
  };

  const closeButtonStyle: CSSProperties = {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    color: theme.colors.text.secondary,
  };

  const modalMessageStyle: CSSProperties = {
    fontSize: '14px',
    color: theme.colors.text.primary,
    lineHeight: '1.6',
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Bell Icon Button */}
      <button 
        style={bellButtonStyle}
        onClick={() => setIsOpen(!isOpen)}
      >
        <BellOutlined style={{ fontSize: '18px', color: '#595959' }} />
        {unreadCount > 0 && (
          <span style={badgeStyle}>{unreadCount}</span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999,
            }}
            onClick={() => setIsOpen(false)}
          />
          <div style={dropdownStyle}>
            {/* Header */}
            <div style={dropdownHeaderStyle}>
              <h3 style={titleStyle}>Notifications</h3>
              <button 
                style={viewAllButtonStyle}
                onClick={() => {
                  setShowAllModal(true);
                  setIsOpen(false);
                }}
              >
                View All
              </button>
            </div>

            {/* Notification List */}
            <div style={notificationListStyle}>
              {notifications.slice(0, 5).map(notification => (
                <div
                  key={notification.id}
                  style={notificationItemStyle(notification.read)}
                  onClick={() => handleNotificationClick(notification)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = notification.read ? '#fafafa' : '#e6f7e6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = notification.read ? 'white' : '#f6ffed';
                  }}
                >
                  <div style={notificationDotStyle(getColorByType(notification.type))} />
                  <div style={notificationContentStyle}>
                    <div style={notificationTitleStyle}>{notification.title}</div>
                    <div style={notificationTimeStyle}>{notification.timestamp}</div>
                  </div>
                  <div style={{ color: theme.colors.text.secondary }}>›</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* View All Modal */}
      {showAllModal && (
        <div style={modalOverlayStyle} onClick={() => setShowAllModal(false)}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <div>
                <h2 style={modalTitleStyle}>All Notifications</h2>
                <p style={{ fontSize: '14px', color: theme.colors.text.secondary }}>
                  {notifications.length} total notifications
                </p>
              </div>
              <button style={closeButtonStyle} onClick={() => setShowAllModal(false)}>
                <CloseOutlined />
              </button>
            </div>

            {/* All Notifications List */}
            <div>
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  style={{
                    ...notificationItemStyle(notification.read),
                    borderRadius: '6px',
                    marginBottom: '8px',
                  }}
                  onClick={() => {
                    handleNotificationClick(notification);
                    setShowAllModal(false);
                  }}
                >
                  <div style={notificationDotStyle(getColorByType(notification.type))} />
                  <div style={notificationContentStyle}>
                    <div style={notificationTitleStyle}>{notification.title}</div>
                    <div style={notificationTimeStyle}>{notification.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Single Notification Detail Modal */}
      {selectedNotification && (
        <div style={modalOverlayStyle} onClick={() => setSelectedNotification(null)}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <div style={{ ...notificationDotStyle(getColorByType(selectedNotification.type)), marginTop: 0 }} />
                  <h2 style={{ ...modalTitleStyle, marginBottom: 0 }}>{selectedNotification.title}</h2>
                </div>
                <p style={{ fontSize: '13px', color: theme.colors.text.secondary }}>
                  {selectedNotification.timestamp}
                </p>
              </div>
              <button style={closeButtonStyle} onClick={() => setSelectedNotification(null)}>
                <CloseOutlined />
              </button>
            </div>

            <div style={modalMessageStyle}>
              {selectedNotification.message}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;