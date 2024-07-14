import React, { useState,useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import UploadCard from './UploadCard';
import { useAuth } from './context/Context';
import { FaRegUser } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";
import { GrHomeRounded } from "react-icons/gr";
import { FaRegMessage } from "react-icons/fa6";
import { RiSettings3Line } from "react-icons/ri";
import { postBtnContext } from './context/Context';


const Sidebar = () => {
    const [iconSize, setIconSize] = useState(25)
    const [postBtn, setPostBtn] = useState(false);
    const navigate = useNavigate();
    const value = useContext(postBtnContext);
    const [authUser, setAuthUser ] = useAuth();

    const handleNewPost = () =>{
        value.setPostBtn(!value.postBtn)
    }

  return (
    <div className='sidebar border-r-2 lg:w-1/4 lg:h-screen sticky top-0'>
      <div>
      <div className="logo px-4 py-1 font-bold text-xl">
       {/* <span className=' text-accent'>Crest</span><span className=' text-pink-600'>Net</span> */}
       <span onClick={()=>navigate('/')} style={{['WebkitBackgroundClip']:'text', ['WebkitTextFillColor']:'transparent'}} className=' bg-gradient-to-r cursor-pointer from-accent to-pink-600'>CrestNet</span>
      </div>
        <div className="sidebarwrapper">
            {/* search bar */}
            <div className="searchBar capitalize border-b-2 px-4 py-2 flex space-x-1">
                <div className=' bg-white p-2 flex items-center border rounded-md shadow-md'>
                    <span className=''><CiSearch size={20} stroke='' /></span>
                    <input type="text" placeholder="Search..." className='px-1 placeholder:font-medium focus:outline-none '/>
                </div>
                <button className='border p-2 rounded-md font-bold shadow-md bg-white text-primery'>Search</button>
            </div>
            {/* post button */}
            <div onClick={handleNewPost} className="postBtn">
                <div className=' flex justify-left mt-3 px-4'>
                    <button className=' text-slate-200 shadow-md duration-200 hover:shadow-pink-600 rounded-lg bg-gradient-to-r from-accent to-pink-600 pb-1 px-5 capitalize text-2xl font-bold'><span className='text-3xl'>+</span> new</button>
                </div>
            </div>
            {/* sidebar item */}
            <div className="sidebarItem px-1 py-2 capitalize">
                <div onClick={()=> navigate('/')} className="item flex items-center space-x-3 text-xl cursor-pointer hover:bg-slate-200 p-3 rounded-full">
                    <span><GrHomeRounded size={iconSize} /></span>
                    <span>home</span>
                </div>
                <div onClick={()=>navigate(authUser?`/profile/${authUser._id}`:`/login`)} className="item flex items-center space-x-3 text-xl cursor-pointer hover:bg-slate-200 p-3 rounded-full">
                    <span><FaRegUser size={iconSize} /></span>
                    <span>Profile</span>
                </div>
                <div className="item flex items-center space-x-3 text-xl cursor-pointer hover:bg-slate-200 p-3 rounded-full">
                    <span><FaRegMessage size={iconSize} /></span>
                    <span>messages</span>
                </div>
                <div className="item flex items-center space-x-3 text-xl cursor-pointer hover:bg-slate-200 p-3 rounded-full">
                    <span><RiSettings3Line size={iconSize} /></span>
                    <span>setiing</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
