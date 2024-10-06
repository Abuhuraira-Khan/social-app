import React, { useContext, useState,useEffect } from "react";
import HomePage from "./components/HomePage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProfilePage from "./components/ProfilePage";
import UploadCard from "./components/UploadCard";
import AuthForm from "./components/AuthForm";
import FriendsPage from "./components/FriendsPage";
import Notifications from "./components/Notifications";
import PostViewPage from "./components/PostViewPage";
import SettingsPage from "./components/SettingsPage";
import SearchPage from "./components/SearchPage";
import { postBtnContext, getPostContext,IsDarkModecontext } from "./components/context/Context";
import { useGetNotifications } from "./components/context/SocketContext";

const App = () => {
  const [postBtn, setPostBtn] = useState(false);
  const [getPosts, setGetPosts] = useState([]);
  const [darkMode, setDarkMode] = useContext(IsDarkModecontext);

  
  useEffect(() => {
    if (darkMode==='true') {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);
  
  useGetNotifications();

  return (
    <postBtnContext.Provider value={{ postBtn, setPostBtn }}>
      <getPostContext.Provider value={{getPosts,setGetPosts}}>
        <BrowserRouter>

            {postBtn ? <UploadCard /> : null}
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<AuthForm />} />
                <Route path="/profile/:userId" element={<ProfilePage />} />
                <Route path="/post/:postId" element={<PostViewPage />} />
                <Route path="/profile/:userId/friends" element={<FriendsPage />} />
                <Route path="/friend-request" element={<FriendsPage />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/search" element={<SearchPage />} />
              </Routes>
        </BrowserRouter>
      </getPostContext.Provider>
    </postBtnContext.Provider>
  );
};

export default App;
