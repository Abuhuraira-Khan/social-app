import React, { useContext, useState } from "react";
import HomePage from "./components/HomePage";
import Sidebar from "./components/Sidebar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProfilePage from "./components/ProfilePage";
import UploadCard from "./components/UploadCard";
import AuthForm from "./components/AuthForm";
import Notice from "./components/Notice";
import PostViewPage from "./components/PostViewPage";
import { postBtnContext, getPostContext } from "./components/context/Context";

const App = () => {
  const [postBtn, setPostBtn] = useState(false);
  const [getPosts, setGetPosts] = useState([]);

  return (
    <postBtnContext.Provider value={{ postBtn, setPostBtn }}>
      <getPostContext.Provider value={{getPosts,setGetPosts}}>
        <BrowserRouter>
          <div className="flex">
            <Sidebar />
            {postBtn ? <UploadCard /> : null}
            <Notice/>
            <div className="app lg:w-3/4 ">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<AuthForm />} />
                <Route path="/profile/:userId" element={<ProfilePage />} />
                <Route path="/post/:postId" element={<PostViewPage />} />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      </getPostContext.Provider>
    </postBtnContext.Provider>
  );
};

export default App;
