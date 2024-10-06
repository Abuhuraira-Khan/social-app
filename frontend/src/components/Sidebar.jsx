import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  useAuth,
  UnKnowNotificationsContext,
  postBtnContext,
} from "./context/Context";
import { FaRegUser, FaRegMessage, FaBars } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { GrHomeRounded } from "react-icons/gr";
import { RiSettings3Line } from "react-icons/ri";
import { IoNotificationsOutline } from "react-icons/io5";
import { HiOutlineUsers } from "react-icons/hi2";

const SidebarNavbar = () => {
  const [iconSize] = useState(25);
  const navigate = useNavigate();
  const value = useContext(postBtnContext);
  const [authUser] = useAuth();
  const { notifications, setNotifications } = useContext(UnKnowNotificationsContext);
  const [isOpen, setIsOpen] = useState(false); // State to control mobile menu

  const handleNewPost = () => {
    value.setPostBtn(!value.postBtn);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <div className="hidden md:flex md:flex-col xl:w-4/4 w-full h-screen dark:bg-gray-900 bg-gray-100 border-r border-gray-300 sticky top-0">
        {/* Logo */}
        <div className="logo px-6 py-4 text-3xl font-bold bg-gradient-to-r from-pink-500 to-yellow-500 text-transparent bg-clip-text cursor-pointer">
          <span onClick={() => navigate("/")}>CrestNet</span>
        </div>

        {/* Search Bar */}
        <div className="searchBar border-b-2 px-6 py-4">
          <div className="relative flex items-center dark:bg-gray-800 bg-white shadow-sm rounded-md">
            <CiSearch className="absolute left-2 text-gray-500" size={20} />
            <input
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  navigate(e.target.value&&`/search?q=${e.target.value}`);
                }
              }}
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
        </div>

        {/* New Post Button */}
        <div onClick={handleNewPost} className="px-6 py-4">
          <button className="w-full py-3 bg-gradient-to-r from-pink-500 to-yellow-500 text-white rounded-md text-xl font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-transform duration-300">
            <span className="text-3xl">+</span> New Post
          </button>
        </div>

        {/* Sidebar Items */}
        <div className="sidebarItems overflow-y-auto px-6 space-y-6 py-4">
          <div
            onClick={() => navigate("/")}
            className="item flex items-center space-x-3 dark:hover:bg-gray-800 text-lg cursor-pointer hover:bg-pink-50 p-3 rounded-lg transition-colors duration-200"
          >
            <GrHomeRounded size={iconSize} />
            <span>Home</span>
          </div>
          <div
            onClick={() =>
              navigate(authUser?._id ? `/profile/${authUser._id}` : `/login`)
            }
            className="item flex items-center space-x-3 text-lg cursor-pointer dark:hover:bg-gray-800 hover:bg-pink-50 p-3 rounded-lg transition-colors duration-200"
          >
            <FaRegUser size={iconSize} />
            <span>Profile</span>
          </div>
          <div
            onClick={() => navigate(authUser?._id ? `/friend-request` : `/login`)}
            className="item flex items-center space-x-3 text-lg cursor-pointer dark:hover:bg-gray-800 hover:bg-pink-50 p-3 rounded-lg transition-colors duration-200"
          >
            <HiOutlineUsers size={iconSize} />
            <span>Friend Request</span>
          </div>
          <div
            onClick={() => navigate(authUser?._id ? `/notifications` : '/login')}
            className="item flex items-center space-x-3 text-lg cursor-pointer dark:hover:bg-gray-800 hover:bg-pink-50 p-3 rounded-lg transition-colors duration-200"
          >
            <span className="relative">
              <span
                className={`p-1 w-6 h-6 overflow-hidden ${
                  notifications > 0 ? "" : "hidden"
                } flex justify-center items-center text-white bg-red-500 rounded-full absolute text-xs top-[-50%] right-[-40%]`}
              >
                {notifications > 99 ? 99 + "+" : notifications}
              </span>
              <IoNotificationsOutline size={iconSize} />
            </span>
            <span>Notifications</span>
          </div>
          <div onClick={() => navigate(authUser?._id ? `/settings` : `/login`)} className="item dark:hover:bg-gray-800 flex items-center space-x-3 text-lg cursor-pointer hover:bg-pink-50 p-3 rounded-lg transition-colors duration-200">
            <RiSettings3Line size={iconSize} />
            <span>Settings</span>
          </div>
        </div>

        {/* Footer */}
        <div className="py-4 text-center text-gray-500 text-sm border-t border-gray-200">
          &copy; {new Date().getFullYear()} CrestNet. All Rights Reserved.
        </div>
      </div>

      {/* Navbar for Mobile */}
      <div className="md:hidden fixed z-50 w-full top-0  dark:bg-gray-900 bg-gray-100 border-b border-gray-300">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="logo text-3xl font-bold bg-gradient-to-r from-pink-500 to-yellow-500 text-transparent bg-clip-text cursor-pointer">
            <span onClick={() => navigate("/")}>CrestNet</span>
          </div>

          {/* Hamburger menu for mobile */}
          <div>
            <button onClick={toggleMenu} className="text-3xl">
              {isOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="flex flex-col items-start space-y-4 px-6 py-4 border-t border-gray-300">
                    {/* Search Bar */}
            <div className="searchBar border-b-2 px-6 py-4">
              <div className="relative flex items-center dark:bg-gray-800 bg-white shadow-sm rounded-md">
                <CiSearch className="absolute left-2 text-gray-500" size={20} />
                <input
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      navigate(e.target.value && `/search?q=${e.target.value}`);
                    }
                  }}
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>
        
            <div
              onClick={() => navigate("/")}
              className="flex items-center space-x-3 text-lg cursor-pointer w-full dark:hover:bg-gray-800 hover:bg-pink-50 p-3 rounded-lg transition-colors duration-200"
            >
              <GrHomeRounded size={iconSize} />
              <span>Home</span>
            </div>
            <div
              onClick={() =>
                navigate(authUser ? `/profile/${authUser?._id}` : `/login`)
              }
              className="flex items-center space-x-3 text-lg cursor-pointer w-full dark:hover:bg-gray-800 hover:bg-pink-50 p-3 rounded-lg transition-colors duration-200"
            >
              <FaRegUser size={iconSize} />
              <span>Profile</span>
            </div>
            <div
              onClick={() => navigate(authUser?._id ? `/friend-request` : `/login`)}
              className="item flex items-center space-x-3 text-lg cursor-pointer w-full dark:hover:bg-gray-800 hover:bg-pink-50 p-3 rounded-lg transition-colors duration-200"
            >
              <HiOutlineUsers size={iconSize} />
              <span>Friend Request</span>
            </div>
            <div
              onClick={() => navigate(authUser?._id ? `/notifications` : "/login")}
              className="flex items-center space-x-3 text-lg cursor-pointer w-full dark:hover:bg-gray-800 hover:bg-pink-50 p-3 rounded-lg transition-colors duration-200"
            >
              <span className="relative">
                <span
                  className={`p-1 w-6 h-6 overflow-hidden flex ${
                    notifications > 0 ? "" : "hidden"
                  } justify-center items-center text-white bg-red-500 rounded-full absolute text-xs top-[-50%] right-[-40%]`}
                >
                  {notifications > 99 ? 99 + "+" : notifications}
                </span>
                <IoNotificationsOutline size={iconSize} />
              </span>
              <span>Notifications</span>
            </div>
            <div onClick={() => navigate(authUser?._id ? `/settings` : "/login")} className="flex items-center space-x-3 text-lg cursor-pointer hover:bg-pink-50 dark:hover:bg-gray-800 w-full p-3 rounded-lg transition-colors duration-200">
              <RiSettings3Line size={iconSize} />
              <span>Settings</span>
            </div>
            <button
              onClick={handleNewPost}
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-yellow-500 text-white rounded-md text-xl font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-transform duration-300"
            >
              <span className="text-3xl">+</span> New Post
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarNavbar;
