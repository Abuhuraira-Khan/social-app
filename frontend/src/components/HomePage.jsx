import React, { useContext, useEffect, useState } from "react";
import PostCard from "./PostCard";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import { postBtnContext, getPostContext, apiUrl,useAuth,IsDarkModecontext } from "./context/Context";

export const FriendSuggestCard = ({ getSuggest }) => {
  const [sendF, setSendF] = useState(false);
  const [getFSuggest, setGetFSuggest] = useState({});
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useAuth();
  const [darkMode, setDarkMode] = useContext(IsDarkModecontext);
  const handleSendF = async () => {
    const res = await fetch(`${apiUrl}/user/send-friend-request`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: getSuggest?._id,
        friendId: authUser?._id,
      }),
    })
    if(res.ok) {
    setSendF(!sendF);
    }
  };

  useEffect(() => {
    const getSuggestionUser = () => {
      const suggestF = getSuggest;
      setGetFSuggest(suggestF);
    };
    getSuggestionUser();

    return () => {
      setGetFSuggest();
    };
  }, []);

  return (
    <div className="w-full flex justify-between cursor-pointer p-2 dark:hover:bg-gray-800 hover:bg-gray-100 transition-all rounded-lg">
      <div className="user flex items-center space-x-2">
        <img
          onClick={() => navigate(`/profile/${getFSuggest._id}`)}
          src={getFSuggest.profilePic}
          className="w-10 h-10 overflow-hidden object-cover rounded-full"
        />
        <div className="lg:w-44">
          <p
            onClick={() => navigate(`/profile/${getFSuggest._id}`)}
            className="font-medium hover:underline"
          >
            {getFSuggest.fullName}
          </p>
          <p className="text-gray-500">@{getFSuggest.userName}</p>
        </div>
      </div>
      <div className="Btn">
        {!getFSuggest?.isFriend &&(
        <button
        onClick={handleSendF}
        className={`text-sm capitalize p-2 rounded-lg font-semibold transition-all ${
          sendF ? 'bg-red-500 text-white' : 'bg-primery text-white'
        }`}
      >
        {sendF ? "Cancel" : "Add Friend"}
      </button>
        ) }

      </div>
    </div>
  );
};

const HomePage = () => {
  const postC = useContext(postBtnContext);
  const [allPost, setAllPost] = useState([]);
  const [getFSuggest, setGetFSuggest] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useAuth();

  const getPostData = useContext(getPostContext);
useEffect(() => {
  if (getPostData.getPosts) {
    setAllPost(prevAllPost => [...prevAllPost, ...getPostData.getPosts]);
    setLoading(false);
  }
}, [getPostData]);


  useEffect(() => {
    const getAllPost = async () => {
      try {
        const res = await fetch(`${apiUrl}/post/getAllPost?page=${page}&limit=5`);
        const result = await res.json();
        setAllPost(prevAllPost => [...prevAllPost, ...result.data]);
        setTotalPages(result.totalPages);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    getAllPost();
  }, [page]);

  useEffect(() => {
    const getSuggestionUser = async () => {
      const res = await fetch(`${apiUrl}/random/friends-suggest`,{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authUser?._id}`
        }
      });
      const data = await res.json();
      setGetFSuggest(data);
      setLoadingSuggestions(false);
    };
    getSuggestionUser();

    return () => {
      setGetFSuggest([]);
    };
  }, []);

  const handleScroll = () => {
    const {scrollHeight, scrollTop, clientHeight} = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight) {
        setPage(prevPage => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // set title on page
  useEffect(() => {
    document.title = "CrestNet";
  }, []);

  return (
    <div className="homePage dark:bg-gray-900 dark:text-white flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 mt-14 md:mt-0 p-5">
        <div className="flex flex-col lg:flex-row lg:space-x-5">
          {/* Post Section */}
          <div className="postSection w-full lg:min-w-[550px] lg:max-w-[550px] p-2">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-lg">Loading posts...</p>
              </div>
            ) : (
              allPost?.map((post, index) => (
                <PostCard key={index} post={post} />
              ))
            )}
            <div
              className={`capitalize text-center ${
                allPost.length == 0 ? "block" : "hidden"
              }`}
            >
              <p>No posts found</p>
              <button
                onClick={() => navigate(0)}
                className="capitalize text-white bg-primery p-2 px-5 font-medium text-lg rounded-md"
              >
                Reload Page
              </button>
            </div>
          </div>
          {/* Suggestion Section */}
          <div className="suggestSection lg:w-full lg:h-full p-2 sticky top-0">
            <div className="friendSuggest lg:h-96 border p-2 rounded-md overflow-y-auto">
              <h1 className="text-xl font-bold">Friends Suggestion</h1>
              <div className="suggest mt-4">
                {loadingSuggestions ? (
                  <div className="text-center">
                    <p>Loading suggestions...</p>
                  </div>
                ) : (
                  getFSuggest?.length == 0 ? (
                    <div className="text-center">
                      <p>No suggestions found</p>
                    </div>
                  ):
                  getFSuggest?.map((suggest, index) => (
                    <FriendSuggestCard key={index} getSuggest={suggest} />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
