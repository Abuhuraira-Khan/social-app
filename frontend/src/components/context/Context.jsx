import React, { createContext, useContext, useEffect, useState } from 'react'

export const postBtnContext = createContext(false);
export const getPostContext = createContext([]);

export const apiUrl = 'https://social-app-server-production-c0ab.up.railway.app'

const AuthContext = createContext()
const AuthProvider = ({children}) => {
    const initial = localStorage.getItem("User");
    const [authUser, setAuthUser] = useState(
        initial ? JSON.parse(initial) : null
    )
  return (
    <AuthContext.Provider value={[authUser,setAuthUser]}>
        {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider

export const useAuth = () => useContext(AuthContext);

export const UnKnowNotificationsContext = createContext()

export const  UnKnowNotificationsContextProvider = ({children})=>{
  const [notifications,setNotifications] = useState(0);
  const [authUser,setAuthUser] = useAuth();

  useEffect(() => {
    (async()=>{
      const res = await fetch(`${apiUrl}/user/get-unknow-notifications/${authUser?._id}`);
      const data = await res.json();
      setNotifications(data)
    })()
  
    return () => {
      setNotifications()
    }
  }, [])
  

  return(
    <UnKnowNotificationsContext.Provider value={{notifications,setNotifications}}>
      {children}
    </UnKnowNotificationsContext.Provider>
  )
  

}

// is dark mode
export const IsDarkModecontext = createContext();

export const IsDarkModeProvider = ({children}) => {
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode"));

  return (
    <IsDarkModecontext.Provider value={[darkMode, setDarkMode]}>
      {children}
    </IsDarkModecontext.Provider>
  );
}