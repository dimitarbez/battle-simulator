import React, { useEffect } from 'react';

const NotificationSystem = ({ notifications, removeNotification }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};

const NotificationItem = ({ notification, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove();
    }, notification.duration || 4000);

    return () => clearTimeout(timer);
  }, [notification, onRemove]);

  const typeStyles = {
    success: 'bg-green-600 border-green-500',
    error: 'bg-red-600 border-red-500',
    warning: 'bg-yellow-600 border-yellow-500',
    info: 'bg-blue-600 border-blue-500',
  };

  const typeIcons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };

  return (
    <div className={`${typeStyles[notification.type]} backdrop-blur-sm border rounded-lg p-4 shadow-lg animate-slide-in-right`}>
      <div className="flex items-start space-x-3">
        <span className="text-xl flex-shrink-0">
          {typeIcons[notification.type]}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-white font-medium text-sm">
            {notification.title}
          </p>
          {notification.message && (
            <p className="text-gray-100 text-xs mt-1">
              {notification.message}
            </p>
          )}
        </div>
        <button
          onClick={onRemove}
          className="text-white hover:text-gray-300 transition-colors flex-shrink-0 ml-2"
        >
          <span className="text-lg">×</span>
        </button>
      </div>
    </div>
  );
};

export default NotificationSystem;
