import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BellIcon } from '@heroicons/react/24/outline';
import NotificationsList from './NotificationsList';
import { markAllAsRead } from '../slice/notificationSlice';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const { items: notifications, unreadCount } = useSelector(
    (state) => state.notifications
  );
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (isOpen && unreadCount > 0) {
      // When closing, mark all as read
      dispatch(markAllAsRead());
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="relative">
      <button onClick={handleToggle} className="relative">
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
            {unreadCount}
          </span>
        )}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80">
          <NotificationsList notifications={notifications} />
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
