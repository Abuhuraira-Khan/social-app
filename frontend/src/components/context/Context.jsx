import React, { createContext, useContext, useState } from 'react'

export const postBtnContext = createContext(false);
export const getPostContext = createContext([]);

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
