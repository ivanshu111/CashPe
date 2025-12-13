import { useDispatch } from 'react-redux';
import { markAsRead } from '../slice/notificationSlice';

const NotificationsList = ({ notifications }) => {
  const dispatch = useDispatch();

  const handleMarkAsRead = (id) => {
    dispatch(markAsRead(id));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Notifications</h3>
      </div>
      <div className="divide-y max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="p-4 text-gray-500">No notifications yet.</p>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification._id}
              className={`p-4 ${
                notification.read ? 'bg-gray-100' : 'bg-white'
              } hover:bg-gray-50 cursor-pointer`}
              onClick={() => !notification.read && handleMarkAsRead(notification._id)}
            >
              <p className="font-semibold">{notification.title}</p>
              <p className="text-sm text-gray-600">{notification.message}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(notification.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsList;
