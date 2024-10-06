import React, { useEffect, useState,useContext } from 'react';
// import { useGetNotifications } from './context/SocketContext.jsx';
import { apiUrl,useAuth,UnKnowNotificationsContext } from './context/Context';
import { useNavigate } from 'react-router-dom';
import SidebarNavbar from './Sidebar';

const NotificationPage = () => {

  const [authUser, setAuthUser] = useAuth();
  const navigate = useNavigate();
  const {notifications:unknowNoti,setNotifications:setUnknowNoti} =useContext(UnKnowNotificationsContext)

  // Sample notification data
  const [notifications, setNotifications] = useState([ ]);

  // Delete notification
  // const deleteNotification = (id) => {
  //   setNotifications((prevNotifications) =>
  //     prevNotifications.filter((notification) => notification.id !== id)
  //   );
  // };

  // get notifications
  const getAllNotifications =async ()=>{
    const res = await fetch(`${apiUrl}/user/get-all-notifications/${authUser?._id}`);
    const data = await res.json();
    setNotifications(data.notifications);
  };

  useEffect(() => {
    getAllNotifications();
  }, [apiUrl,authUser?._id]);

  // make notifications as known
  const makeNotificationsKnown = async () => {
    const res = await fetch(`${apiUrl}/user/mark-all-notifications-as-read/${authUser?._id}`,{
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => {
      if (res.status === 200) {
        setUnknowNoti(0)
      }
    });
  };

  useEffect(() => {
    makeNotificationsKnown();
  }, []);

  // handle notification click
  const handleNotificationClick = async (notification) => {
    // Navigate to the post page
    navigate(`/post/${notification?.notifications?.notifyBody?.postId}`);

    // Mark the notification as seen
    const res = await fetch(`${apiUrl}/user/mark-notification-as-seen/${notification?.notifications?._id}&${authUser?._id}`,{
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });

  };

  
  return (
    <div className='min-h-screen flex flex-col md:flex-row dark:text-white dark:bg-gray-900 w-full'>
    <SidebarNavbar/>
    <div className="max-w-2xl md:mt-0 mt-14 dark:bg-gray-900 dark:text-white mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>
      {notifications.length ? (
        <ul className="space-y-4">
          {notifications.map((notification,index) => (
            <li key={index} onClick={() =>handleNotificationClick(notification)} className={`p-4 overflow-hidden cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg shadow-md ${notification?.notifications?.isSeen ? 'bg-gray-300 dark:bg-gray-800' : 'bg-white dark:bg-gray-700'} flex gap-3 items-center`}>
              <div className='flex-none'>
                <img className='w-14 h-14 rounded-full object-cover' src={notification?.userInfo?.profilePic} alt={notification?.userInfo?.fullName} />
              </div>
              <div className='flex justify-between items-center flex-1'>
              <div>
                <h2 className="text-lg font-semibold capitalize">{notification?.notifications?.notifyType}</h2>
                <p className="text-gray-600 dark:text-gray-300 capitalize">
                  {notification?.userInfo?.fullName}
                  {notification?.notifications?.notifyType==='new post'?' Added new post':''}
                  {notification?.notifications?.notifyType==='comment'?' Commented on your post':''}
                </p>
                <span className="text-sm text-gray-400">{notification.notifyTime}</span>
              </div>
              {/* <div className="flex items-center">
                <button
                  className="text-red-500 hover:text-red-700 text-sm"
                  onClick={() => deleteNotification(notification._id)}
                >
                  Delete
                </button>
              </div> */}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No new notifications.</p>
      )}
    </div>
    </div>
  );
};

export default NotificationPage;
