import { Dropdown, Modal } from 'antd';
import { BellOutlined, CloseOutlined } from '@ant-design/icons';
import { useEffect, useMemo, useState } from 'react';
import { theme } from '../../styles/theme';
import { notificationService } from '../../services/notificationService';
import type { Notification } from '../../services/notificationService';
import { getPortalClientId, uiDefaults } from '../../config/portalConfig';
import { formatRelativeTime } from '../../utils/formatters';
import { getChatIdentity } from '../../services/chatIdentity';

const notificationCardWidthPx = '380px';

interface NotificationsDropdownProps {
  role?: string;
}

/**
 * Consolidates notification preview, read-state updates, and detail modal behavior for the global bell menu.
 */
const NotificationsDropdown = ({ role }: NotificationsDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [showAllModal, setShowAllModal] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const recipientId = useMemo(() => {
    if (role === 'owner' || role === 'bank') {
      return getPortalClientId(role);
    }

    if (role) {
      return getChatIdentity(role as Parameters<typeof getChatIdentity>[0]).id;
    }

    return getPortalClientId('bank');
  }, [role]);

  useEffect(() => {
    /**
     * Fetches the latest notifications once on mount to keep dropdown interactions fast.
     */
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const data = await notificationService.getForUser(recipientId);
        setNotifications(data);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    void fetchNotifications();
    const pollId = window.setInterval(() => {
      void fetchNotifications();
    }, uiDefaults.chatPollIntervalMs);

    return () => window.clearInterval(pollId);
  }, [recipientId]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  /**
   * Updates read state optimistically so the badge count reacts immediately.
   */
  const markAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  /**
   * Uses bulk update to reduce API round trips when clearing unread notifications.
   */
  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead(recipientId);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  /**
   * Marks an item as read and opens detail immediately to keep user flow single-click.
   */
  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    setSelectedNotification(notification);
    setIsOpen(false);
  };

  /**
   * Maps semantic notification types to consistent UI colors.
   */
  const getColorByType = (type: Notification['type']) => {
    const colors = {
      success: '#52c41a',
      warning: '#faad14',
      error: '#ff4d4f',
      info: '#1890ff',
    };
    return colors[type];
  };

  const dropdownContent = (
    <div
      style={{
        width: notificationCardWidthPx,
        backgroundColor: 'white',
        border: '1px solid #000',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h3
          style={{
            fontSize: '16px',
            fontWeight: 600,
            color: theme.colors.text.primary,
            margin: 0,
          }}
        >
          Notifications
        </h3>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {unreadCount > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                markAllAsRead();
              }}
              style={{
                background: 'none',
                border: 'none',
                color: theme.colors.text.secondary,
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              Mark all read
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowAllModal(true);
              setIsOpen(false);
            }}
            style={{
              background: 'none',
              border: 'none',
              color: theme.colors.primary.main,
              fontSize: '14px',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            View All
          </button>
        </div>
      </div>

      {/* Notification List */}
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {loading ? (
          <div
            style={{
              padding: '40px',
              textAlign: 'center',
              color: theme.colors.text.secondary,
            }}
          >
            Loading...
          </div>
        ) : notifications.length === 0 ? (
          <div
            style={{
              padding: '40px',
              textAlign: 'center',
              color: theme.colors.text.secondary,
            }}
          >
            No notifications
          </div>
        ) : (
          notifications.slice(0, uiDefaults.notificationPreviewLimit).map((notification) => (
            <div
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid #f0f0f0',
                cursor: 'pointer',
                backgroundColor: notification.isRead ? 'white' : '#f6ffed',
                display: 'flex',
                gap: '12px',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = notification.isRead
                  ? '#fafafa'
                  : '#e6f7e6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = notification.isRead
                  ? 'white'
                  : '#f6ffed';
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: getColorByType(notification.type),
                  marginTop: '6px',
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: theme.colors.text.primary,
                    marginBottom: '4px',
                  }}
                >
                  {notification.title}
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: theme.colors.text.secondary,
                  }}
                >
                  {formatRelativeTime(notification.createdAt)}
                </div>
              </div>
              <div style={{ color: theme.colors.text.secondary }}>›</div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Bell Icon with Dropdown */}
      <Dropdown
        open={isOpen}
        onOpenChange={setIsOpen}
        dropdownRender={() => dropdownContent}
        trigger={['click']}
        placement="bottomRight"
      >
        <div style={{ position: 'relative', cursor: 'pointer' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <BellOutlined style={{ fontSize: '18px', color: '#595959' }} />
            {unreadCount > 0 && (
              <span
                style={{
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
                }}
              >
                {unreadCount}
              </span>
            )}
          </div>
        </div>
      </Dropdown>

      {/* View All Modal */}
      <Modal
        open={showAllModal}
        onCancel={() => setShowAllModal(false)}
        footer={null}
        width={600}
        closeIcon={<CloseOutlined />}
        styles={{
          body: { padding: '32px' },
          header: { borderBottom: '1px solid #f0f0f0' },
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <h2
            style={{
              fontSize: '20px',
              fontWeight: 600,
              color: theme.colors.text.primary,
              margin: 0,
            }}
          >
            All Notifications
          </h2>
          <span
            style={{
              minWidth: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: theme.colors.background.default,
              border: '2px solid #000',
              color: '#000',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '13px',
              fontWeight: 700,
              padding: '0 8px',
            }}
          >
            {notifications.length}
          </span>
        </div>

        <div>
          {notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => {
                handleNotificationClick(notification);
                setShowAllModal(false);
              }}
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid #f0f0f0',
                cursor: 'pointer',
                backgroundColor: notification.isRead ? 'white' : '#f6ffed',
                borderRadius: '6px',
                marginBottom: '8px',
                display: 'flex',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: getColorByType(notification.type),
                  marginTop: '6px',
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: theme.colors.text.primary,
                    marginBottom: '4px',
                  }}
                >
                  {notification.title}
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: theme.colors.text.secondary,
                  }}
                >
                  {formatRelativeTime(notification.createdAt)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* Single Notification Detail Modal */}
      <Modal
        open={!!selectedNotification}
        onCancel={() => setSelectedNotification(null)}
        footer={null}
        width={600}
        closeIcon={<CloseOutlined />}
        styles={{
          body: { padding: '32px' },
          header: { borderBottom: '1px solid #f0f0f0' },
        }}
      >
        {selectedNotification && (
          <>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '8px',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: getColorByType(selectedNotification.type),
                }}
              />
              <h2
                style={{
                  fontSize: '20px',
                  fontWeight: 600,
                  color: theme.colors.text.primary,
                  margin: 0,
                }}
              >
                {selectedNotification.title}
              </h2>
            </div>
            <p
              style={{
                fontSize: '13px',
                color: theme.colors.text.secondary,
                marginBottom: '20px',
              }}
            >
              {formatRelativeTime(selectedNotification.createdAt)}
            </p>
            <div
              style={{
                fontSize: '14px',
                color: theme.colors.text.primary,
                lineHeight: '1.6',
              }}
            >
              {selectedNotification.message}
            </div>
          </>
        )}
      </Modal>
    </>
  );
};

export default NotificationsDropdown;