import React, { useEffect, useReducer, useRef,useState } from 'react';
import PostCard from './PostCard';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { GoUpload } from "react-icons/go";
import { useAuth,apiUrl } from './context/Context';

const initialState = {
  user: {
    profilePic: `/assets/user-128.png`,
    coverPic: `https://colorfully.eu/wp-content/uploads/2015/11/sunrise-girl-long-dress-fbcover.jpg`,
    fullName: ``,
    userName: ``,
    bio: ``,
    friends:{
      request:[],
      yourRequest:[],
      allFriends:[]
    },
    posts: [],
  },
  isEdit: false,
  loading: true,
  error: null
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'editing':
      return { ...state, isEdit: !state.isEdit };
    case 'updateBio':
      return { ...state, user: { ...state.user, bio: action.value } };
    case 'get_user':
      return { ...state, user: action.user};
    case 'update_profilePic':
      return { ...state, user: { ...state.user, profilePic: action.value } };
    case 'update_coverPic':
      return { ...state, user: { ...state.user, coverPic: action.value } };
    case 'get_posts':
      return { ...state, user: { ...state.user, posts: [ ...state.user.posts, ...action.posts] } };  
    default:
      return state;
  }
};

const ProfilePage = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { userId } = useParams();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const navigate = useNavigate();

  // useRef for file inputs
  const coverPicRef = useRef(null);
  const profilePicRef = useRef(null);

  const bioChange = (e) => {
    dispatch({ type: 'updateBio', value: e.target.value });
  };

  // handle upload
  const handleProfilePicU = ()=>{
    const file = profilePicRef.current.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      dispatch({ type: 'update_profilePic', value:reader.result });
        };
        reader.readAsDataURL(file);
  }
  const handleCoverPicU = ()=>{
    const file = coverPicRef.current.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      dispatch({ type: 'update_coverPic', value:reader.result});
        };
        reader.readAsDataURL(file);
  }

  // Get user from context
  const [authUser] = useAuth();

  useEffect(() => {
    const getuser = async () => {
      try {
        const res = await fetch(`${apiUrl}/user/get-profile/${userId}`);
        const result = await res.json();
        if (res.ok) {
          dispatch({ type: 'get_user', user: result });
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (authUser) {
      getuser();
    }
  }, [userId]);

  //edit
  const handleEditSave = async () => {
    dispatch({ type: 'editing' });
    if (state.isEdit) {
      const res = await fetch(`${apiUrl}/user/update-profile/${authUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({...state.user})
      });
    }
  }

  //get postss
  const fetchPosts = async () => {
    try {
        const response = await fetch(`${apiUrl}/post/get-user-posts/${userId}?page=${page}&limit=5`);
        const data = await response.json();
        dispatch({ type: 'get_posts', posts: data.posts });
        setTotalPages(data.totalPages);
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
};

// Fetch posts on initial render and when page changes
useEffect(() => {
    fetchPosts();
}, [page]);

    // Infinite scroll logic
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
      if(window.location.pathname === `/profile/${userId}`&&state.user?.fullName) {
        document.title = state.user?.fullName+`(@${state.user?.userName})`;
        return
      }
    }, [state.user?.fullName]);
    
  
    return (
    <div className='flex dark:bg-gray-900 dark:text-white flex-col md:flex-row'>
      <Sidebar/>
      <div className="fullProfile flex-1 md:mt-0 mt-14">
        <div className="profilewrapper">
          <div className="profilepic rounded-lg relative mb-20">
            <div className="cover-wrapper h-64 w-full overflow-hidden rounded-lg">
              <img
                src={state.user.coverPic}
                alt=""
                className="w-full object-cover h-full"
              />
              <button onClick={() => { coverPicRef.current.click() }} className={`z-10 text-sm dark:bg-slate-800 bg-slate-200 ${state.isEdit ? 'block' : 'hidden'} font-medium flex space-x-1 items-center p-1 absolute bottom-1 right-2 capitalize`}>
                <GoUpload size={20} /> <span>upload cover</span>
              </button>
              <input ref={coverPicRef} onChange={handleCoverPicU} type="file" name="coverPic" className='hidden' />
            </div>
            <div className="profile-pic w-full h-full bg-black-rgba absolute top-0 left-0">
              <div className="pic-wrapper absolute top-[50%] left-[50%] translate-x-[-50%] w-40 h-40 overflow-hidden rounded-full outline outline-4 outline-bgc">
                <img
                  src={state.user.profilePic}
                  alt=""
                  className="bg-white object-cover w-full h-full"
                />
                <div className={`w-full h-full bg-black-rgba absolute top-0 left-0 ${state.isEdit ? 'block' : 'hidden'}`}>
                  <button onClick={() => { profilePicRef.current.click() }} className='bg-black-rgba p-2 rounded-full absolute top-[50%] translate-x-[-50%] left-[50%] translate-y-[-50%] z-10 text-bgc hover:text-accent'>
                    <GoUpload size={40} />
                  </button>
                  <input ref={profilePicRef} onChange={handleProfilePicU} type="file" name='profilePic' className='hidden' />
                </div>
              </div>
            </div>
            <div className={`absolute right-2 top-2 ${authUser._id === userId? 'block' : 'hidden'}`}>

              <button onClick={handleEditSave} className='bg-primery capitalize p-1 px-2 rounded-lg text-bgc hover:text-slate-200'>
                {state.isEdit ? 'save edit' : 'Edit profile'}
              </button>
            </div>
          </div>

          <div className='p-5'>
            {/* bio section */}
            <div className="profile-bio">
              <div className="profile-name mb-4">
                <h1 className="text-3xl font-bold">{state.user.fullName}</h1>
                <p className='text-slate-800 dark:text-slate-500'>@{state.user.userName}</p>
              </div>
              <div className="bio">
                <textarea
                  disabled={!state.isEdit}
                  value={state.user?.bio?.substring(0, 140) || ''}
                  className={`w-1/2 p-1 h-20 bg-transparent resize-none ${state.isEdit ? "outline outline-1" : ''}`}
                  onChange={bioChange}
                ></textarea>
              </div>
              <div className="friends mb-4">
                <p onClick={() => navigate(`/profile/${state.user._id}/friends`)} className='text-primery hover:underline inline-block cursor-pointer'><span>{state.user.friends.allFriends.length}</span> friends</p>
              </div>
            </div>
            {/* post button */}
            <div className='border-b-2'>
              {/* <div className='text-lg font-medium capitalize'>
                <button className='capitalize p-2 md:w-1/6 hover:bg-slate-200'>post</button>
                <button className='capitalize p-2 md:w-1/6 hover:bg-slate-200'>image</button>
                <button className='capitalize p-2 md:w-1/6 hover:bg-slate-200'>video</button>
              </div> */}
            </div>

            {/* post */}
            <div className="post-section max-w-[550px]">
            {state.user.posts.map((post,idx)=>{
              return(
                <PostCard
                key={idx}
                post={post}
                />
              )
            })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
