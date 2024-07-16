import React, { useContext, useEffect, useState } from "react";
import PostCard from "./PostCard";
import { useNavigate } from "react-router-dom";
import { postBtnContext ,getPostContext} from "./context/Context";

const FriendSuggestCard = ({ getSuggest }) => {

  const [sendF, setSendF] = useState(false);
  const [getFSuggest, setGetFSuggest] = useState({});
  const navigate = useNavigate();


  const handleSendF = () => {
    setSendF(!sendF)
  }

  useEffect(() => {
    const getSuggestionUser = () => {
      const suggestF = getSuggest;
      setGetFSuggest(suggestF)
    }
    getSuggestionUser();

    return () => {
      setGetFSuggest();
    }
  }, [])

  return (

    <div className="w-full flex justify-between cursor-pointer p-2  ">
      <div className="user flex items-center space-x-2">
        <img
          src={getFSuggest.profilePic}
          className="w-10 h-10 rounded-full"
        />
        <div className=" lg:w-44">
          <p onClick={()=>navigate(`/profile/${getFSuggest._id}`)} className=" font-medium hover:underline">{getFSuggest.fullName}</p>
          <p><span>@</span>{getFSuggest.userName}</p>
        </div>
      </div>
      <div className="Btn">
        <button onClick={handleSendF} className={` text-bgc text-sm capitalize p-2 rounded-lg font-semibold bg-primery`}>
          {sendF ? 'cancel' : 'add friend'}
        </button>
      </div>
    </div>
  )
}




const HomePage = () => {
  const postC = useContext(postBtnContext);
  const [allPost,setAllPost] = useState([]);
  const [getFSuggest,setGetFSuggest]= useState([]);
  const navigate = useNavigate();



  const getPostData = useContext(getPostContext);
  useEffect(() => {
    const getPost = ()=>{
      setAllPost([...allPost,...getPostData.getPosts].reverse())
    }
  getPost();
  }, [,getPostData])
  
  
  useEffect(() => {
    const getAllPost = async ()=>{
      try {
        const res = await fetch('https://social-app-kigf.onrender.com/post/getAllPost')
        const result = await res.json();
        setAllPost(result.data.reverse())
      } catch (error) {
        console.log(error)
      }
    }
    getAllPost();
    
    return ()=>{
      setAllPost([])
    }
    
    }, []);

    useEffect(() => {
      const getSuggestionUser = async ()=>{
        const res = await fetch(`https://social-app-kigf.onrender.com/random/friends-suggest`);
        const data = await res.json();
        setGetFSuggest(data);
      }
      getSuggestionUser();
  
      return ()=>{
        setGetFSuggest([]);
      }
    }, [])

  return (
    <div className="homePage p-5">
      <div className="">
        <div className="flex space-x-5">
          <div className={`postSection lg:min-w-[550px] lg:max-w-[550px] p-2 `}>
            {allPost.map((post,index)=>{
              return(
                <PostCard
                 key={index}
                 post={post}
                />
              )
            })}
            <div className={`capitalize text-center ${allPost.length == 0 ? 'block':'hidden'}`}>
              <p>no post found</p>
              <button onClick={()=>navigate(0)} className="capitalize text-white bg-primery p-2 px-5 font-medium text-lg rounded-md">reload page</button>
            </div>
          </div>
          <div className="suggestSection lg:w-full lg:h-full p-2 sticky top-0">
            <div>
              <div className="friendSuggest lg:h-96 border p-2 overflow-y-auto  rounded-md ">
                <h1 className="text-xl font-bold">Friends Suggestion</h1>
                <div className="suggest mt-4">
                  {getFSuggest.map((suggest,index)=>{
                    return(
                      <FriendSuggestCard key={index} getSuggest={suggest}/>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
