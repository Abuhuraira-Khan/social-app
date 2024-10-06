import io from "socket.io-client";
import { createContext, useContext, useEffect, useState } from "react";
import { apiUrl, useAuth,UnKnowNotificationsContext } from "./Context";

export const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [authUser, setAuthUser] = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (authUser?._id) {
      const newSocket = io(apiUrl, {
        query: { userId: authUser?._id },
      });
      setSocket(newSocket);
  
      newSocket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });
  
      return () => {
        newSocket?.close();
      };
    }
  }, [authUser?._id, apiUrl]);
  
  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

// get notifications
export const useGetNotifications = ()=>{
  const [notifications, setNotifications] = useState([]);
  const {socket} = useSocketContext();
  const [authUser, setAuthUser] = useAuth();
  const {notifications:unknowNoti,setNotifications:setUnknowNoti}=useContext(UnKnowNotificationsContext)

  useEffect(() => {
    if (authUser?._id) {
      socket?.on("getNotifications", (notifications) => {
        console.log("notifications", notifications);
        setUnknowNoti(prev=>prev+1)
        setNotifications(notifications);
      });
    }
  
    return () => {
      socket?.off("getNotifications");
    }
  }, [authUser?._id, socket]);

}