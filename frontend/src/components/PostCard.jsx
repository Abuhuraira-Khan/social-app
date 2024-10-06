import React, { useContext, useEffect, useReducer, useRef,useState } from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from './context/Context'
import { BiLike } from "react-icons/bi";
import { BiSolidLike } from "react-icons/bi";
import { MdOutlineModeComment } from "react-icons/md";
import { TbShare2 } from "react-icons/tb";
import { MdDeleteOutline } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { RxCross2 } from "react-icons/rx";
import { MdNavigateNext, MdNavigateBefore, MdClose } from 'react-icons/md';
import {FaCopy} from 'react-icons/fa6';
import { getPostContext,apiUrl } from './context/Context';


// Delete Warning
const DeleteWarning = ({postId,dispatch}) => {

  const deleteCardRef = useRef(null);
  const postC = useContext(getPostContext);

  const [authUser,setAuthUser] = useAuth();

  useEffect(() => {
      const interval = setTimeout(() => {
        deleteCardRef.current.classList.add("top-48");
      }, 10);

      document.body.style.overflow = "hidden"

      return () =>{
        clearInterval(interval)
        document.body.style.overflow = "auto"
      };
  }, []);
  const handleDeletePost = async ()=>{
    try {
      const res = await fetch(`${apiUrl}/user/delete-post/${authUser?._id}`,{
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          },
          body: JSON.stringify({postId})
      })
      const data = await res.json()
      if(res.ok){
        dispatch({type:'show_d_warning'})
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='fixed w-full h-full z-30 top-0 left-0  p-2 bg-black-rgba'>
      <div ref={deleteCardRef} className='w-96 relative duration-300 top-0 left-[50%] translate-x-[-50%] bg-white p-2 '>
        <h1 className='mb-2'>Are you sure you want to delete this post?</h1>
        <div className='flex space-x-3 justify-end'>
        <button onClick={handleDeletePost} className='bg-primery p-1 px-2'>Yes</button>
        <button onClick={()=>{dispatch({type:'show_d_warning'})}} className='bg-slate-200 p-1 px-2'>No</button>
        </div>
      </div>
    </div>
  )
}

const CommentCard = React.memo((props)=>{

  const [authUser,setAuthUser] = useAuth();
  const deleteComment = async (id)=>{
    const res = await fetch(`${apiUrl}/post/delete-comment/${id}&${props.comment.postId}`,{
      method:'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId:authUser?._id,
        authorId:props.comment.authorId
      })

    })
    .then((result)=>{
      if(result.status===200){
        props.setComments((prevComments) => prevComments.filter(comment => comment._id !== id));
        }
    })
  }

  const [cardComment, setCardComment] = useState(
    {
      _id:props.comment._id,
      postId:props.comment.postId,
      userId: props.comment.userId,
      profilePic: '',
      userFullName:'',
      text: props.comment.text,
      likes: [],
      replies: [],
    }
  )

  useEffect(() => {
    const getuser = async ()=>{
      const res = await fetch(`${apiUrl}/post/get-commented-user/${props.comment.userId}`)
      const data = await res.json();
      setCardComment({...cardComment,...data.data});
    }
    getuser();
    return () => {
      setCardComment({})
    }
  }, [])

  return(
    <div className="mb-4">
    <div className="flex items-start">
      <img
        src={cardComment.profilePic}
        alt="Profile"
        className="w-10 h-10 object-cover rounded-full mr-3"
      />
      <div>
        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg relative ">
          <button onClick={()=>deleteComment(cardComment._id)} className={`absolute ${cardComment.userId===authUser?._id?'block':'hidden'} top-0 right-1 hover:text-red-500`}><MdDeleteOutline/></button>
          <p className="font-semibold">{cardComment.userFullName}</p>
          <p>{cardComment.text}</p>
        </div>
        {/* <div className="flex items-center mt-2 text-gray-600">
          <button
            className="text-blue-600 mr-3"
            onClick={() => handleLike(comment.id)}
          >
            Like
          </button>
          <span>{comment.likes} Likes</span>
        </div> */}
      </div>
    </div>
  </div>
  )
})

// Comment Section
const CommentSection = (props) => {
  const [comments, setComments] = useState([]);

  const [authUser,setAuthUser] = useAuth();
  const [newComment, setNewComment] = useState(``);
  const [userProfile,setUserProfile] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  const navigate = useNavigate();


  // const handleLike = (id) => {
  //   setComments((prevComments) =>
  //     prevComments.map((comment) =>
  //       comment.id === id ? { ...comment, likes: comment.likes + 1 } : comment
  //     )
  //   );
  // };

  // Comment handling
  const handleAddComment = async () => {
    if (newComment.trim() === '') return;

    const commentDoc = {
     postId: props.postId,
     userId: props.userId,
     authorId:props.authorId,
     text: newComment,
     likes: [],
     replies: [],
     ...userProfile
    }
    const res  = await fetch(`${apiUrl}/post/add-new-comment`,{
      method:'PUT',
      headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentDoc)
    }).then((result)=>{
      if(result.ok){
        setComments((prevComments) => [...prevComments, commentDoc].reverse());
        setNewComment('');
      }
    })    
  };

  useEffect(() => {
    document.body.style.overflow='hidden';

    return ()=>{
      document.body.style.overflow = "auto"
    }
  }, []);

  useEffect(() => {
    
    const getComment=()=>{
      setComments(props.comment)
    }
    getComment();
    return () => {
      setComments([])
    }
  }, [])

  useEffect(() => {
    const getUser = async ()=>{
      const res = await fetch(`${apiUrl}/post/get-user-in-comment/${authUser._id}`)
      const data = await res.json();
      setUserProfile(data);
    }
  getUser();
    return () => {
      setUserProfile({})
    }
  }, [])

  return (
    <div className='w-screen md:mt-0 mt-14 h-screen z-30 fixed bg-black-rgba top-0 left-0 '>
      <div className="max-w-lg h-screen mx-auto my-5 p-4 bg-white dark:bg-gray-800 rounded shadow-2xl overflow-y-auto">
        <div className='flex justify-end items-center'>
          <button onClick={()=>props.dispatch({type:'open-comment'})} className='hover:bg-slate-200 p-1 rounded-full'><RxCross2 size={25} /></button>
        </div>
        <h2 className="text-2xl font-bold mb-4">Comments</h2>
        <div className="mb-4">
          <div className="flex items-start mb-2">
            <img
              src={userProfile.profilePic}
              alt="Profile"
              className="w-10 h-10 object-cover flex-none rounded-full mr-3"
            />
            <textarea
              className="w-full max p-2 border dark:bg-gray-700 outline-none rounded focus:outline-none resize-none focus:ring-2 focus:ring-primery"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
          </div>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={()=>authUser?handleAddComment():navigate('/login')}
          >
            Post Comment
          </button>
        </div>
        {comments.map((comment,idx) => {
          return(
            <CommentCard key={idx} setComments={setComments} comment={comment}/>
          )
        })}
      </div>
    </div>
  );
};

// Share Section
const ShareSection = ({url,dispatch})=>{

  const handleCopyUrl = ()=>{
    navigator.clipboard.writeText(url)
    dispatch({type:'open-share'})
  }

  return(
    <div className='w-screen h-screen top-0 left-0 fixed bg-black-rgba z-50 flex justify-center items-center'>
      <div>
        <div className='bg-white dark:bg-gray-800 relative rounded-md p-5 flex w-96 h-22 justify-center items-center'>
          <button onClick={()=>dispatch({type:'open-share'})} className=' absolute top-0 right-1'><RxCross2 size={18}/></button>
          <div className="w-full flex">
            <p className='bg-slate-200 dark:bg-gray-700 p-1 w-full truncate'>{url}</p>
            <button onClick={handleCopyUrl} className='bg-primery w-10 text-white flex justify-center items-center'><FaCopy size={22}/></button>
          </div>
        </div>
      </div>
    </div>
  )
}

// view post
const ViewPost = ({ post, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allIndexes, setAllIndexes] = useState([...post?.imgVdo]);

  return (
    <div className="fixed top-0 left-0 z-50 w-full h-screen bg-gray-900 text-white flex justify-center items-center">
      {/* Close Button */}
      <button 
        className="absolute top-4 right-4 bg-gray-800 hover:bg-gray-700 p-2 rounded-full shadow-lg"
        onClick={onClose}
      >
        <MdClose size={24} />
      </button>

      {/* Slider Navigation */}
      <button onClick={() => setCurrentIndex((prevIndex) => prevIndex<=0?prevIndex-0:prevIndex - 1)} className="absolute left-4 top-1/2 z-10 transform -translate-y-1/2 bg-gray-800 hover:bg-gray-700 p-3 rounded-full shadow-lg">
        <MdNavigateBefore size={30} />
      </button>

      <div className='relative overflow-hidden max-h-[90vh] transition-all duration-1000 max-w-[80%]'>
        {
        allIndexes[currentIndex]?.type === 'img' ? (
          <img
          src={allIndexes[currentIndex]?.url}
          className="max-w-80% transition-all duration-1000 relative left-1/2 -translate-x-1/2 max-h-[90vh]"
          alt="Post"
        />
        ) : (
          <video
            src={allIndexes[currentIndex]?.url}
            className="max-w-80% relative transition-all duration-1000 left-1/2 -translate-x-1/2 max-h-[90vh]"
            controls
          />
        )
        }
      </div>

      {/* Slider Navigation */}
      <button onClick={() => setCurrentIndex(prevIndex=>prevIndex>=allIndexes.length-1?prevIndex+0:prevIndex + 1)} className="absolute z-10 right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 hover:bg-gray-700 p-3 rounded-full shadow-lg">
        <MdNavigateNext size={30} />
      </button>
    </div>
  );
};

const initialState = {
  like:[],
  comment:[],
  share:[],
  isEdit:false,
  showDWarning:false,
  openComment:false,
  openShare:false,
  imgVdo: [],
  title:``,
  author:{},
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'add-like':
      return { ...state, like:[...state.like,action.value] };
    case 'remove-like':
      return { ...state, like: state.like.filter((item) => item.likedUserId !== action.value.likedUserId)
        };
    case 'show_d_warning':
      return {...state,showDWarning: !state.showDWarning}
    case 'open-comment':
      return {...state,openComment: !state.openComment}
    case 'open-share':
      return {...state,openShare: !state.openShare}
    case 'get_post':
      return (
        {...state,...action.post}
      )
    case 'get_author':
      return {...state,author:{...action.author}}
    // case 'go_post':
    //   return {...state,...action.post}  
    default:
      return state;
  }
};

const PostCard = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();
  const mediaContainerRef = useRef(null);
  const [authUser, setAuthUser] = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false); // Add state for dropdown menu
  const [viewFullPost, setViewFullPost] = useState(false); // Add state for dropdown menu
  const [mediaDragged, setMediaDragged] = useState(false);
  const [postContentExpanded, setPostContentExpanded] = useState(false);
  const postContentRef = useRef(null);

  // Like handling logic
  const likeHandle = async () => {

    if(!authUser?._id) return navigate('/login');

    const userAlreadyLiked = state.like?.some((like) => like?.likedUserId === authUser?._id);
    const url = `${apiUrl}/post/like-the-post`;

    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        postId: state?._id,
        userId: authUser?._id,
        type: !userAlreadyLiked ? 'unlike' : 'liked',
      }),
    });

    if(res.ok) {
      if (userAlreadyLiked) {
        dispatch({ type: 'remove-like', value: { _id: '', likedUserId: authUser?._id } });
      } else {
        dispatch({ type: 'add-like', value: { _id: '', likedUserId: authUser?._id } });
      }
    }
  };

  useEffect(() => {
    const getPost = () => {
      const post = props.post;
      dispatch({ type: 'get_post', post: post });
    };
    getPost();
  }, [props.post]);
  const [shareUrl, setShareUrl] = useState('')

  const handleShare = (e)=>{
    dispatch({type:'open-share'})
    const ur = location.origin+'/post/'+props.post._id;
    setShareUrl(ur)
  }

  // Get post author information
  useEffect(() => {
    const getAuthor = async () => {
      const res = await fetch(`${apiUrl}/user/get-post-author/${props.post.userId}`);
      const data = await res.json();
      dispatch({ type: 'get_author', author: { ...data } });
    };
    getAuthor();
  }, [props.post.userId]);

  // make horizontal scroll
  useEffect(() => {
    const mediaContainer = mediaContainerRef.current;

    // moushe move
    const mouseMoveListener = (event) => {
        mediaContainer.scrollLeft -= event.movementX;
    };

    if (mediaContainer) {
      mediaContainer.addEventListener('mousedown', (event) => {
        event.preventDefault();
        setMediaDragged(true);
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'grabbing';
        mediaContainer.addEventListener('mousemove', mouseMoveListener);
      });

      // mouse up
      mediaContainer.addEventListener('mouseup', (event) => {
        event.preventDefault();
        setMediaDragged(false);
        document.body.style.userSelect = 'auto';
        document.body.style.cursor = 'auto';
        mediaContainer.removeEventListener('mousemove', mouseMoveListener);
      });
    }
  
    return () => {
      
    }
  }, [])
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mb-4">
      {viewFullPost && <ViewPost post={state} onClose={() => setViewFullPost(false)} />}
      {/* conditional comment open closs */}
      {state.openComment?<CommentSection comment={state.comment}  userId={authUser && authUser._id} authorId={state.author?.userId}  postId={state._id} dispatch={dispatch} />:null}
      {/* conditional share open closs */}
      {state.openShare?<ShareSection url={shareUrl} dispatch={dispatch}/>:null}
      {/* conditional show post delete warning */}
      {state.showDWarning?<DeleteWarning postId={state._id} dispatch={dispatch}/>:null}
      <div className="flex items-center relative justify-between">
        <div className="flex items-center">
          <img onClick={() => navigate(`/profile/${state.author?.userId}`)} src={state.author?.userImage} alt="Author" className="w-10 h-10 object-cover cursor-pointer overflow-hidden rounded-full mr-3" />
          <div>
            <h2 onClick={() => navigate(`/profile/${state.author?.userId}`)} className="font-bold hover:underline cursor-pointer">
              {state.author?.userFullName}
            </h2>
            <p className="text-gray-500 text-sm">{state.postTime}</p>
          </div>
        </div>

        {/* Dropdown Button for Edit/Delete */}
        <div className={`abosolute ${state.userId === authUser?._id ? 'block' : 'hidden'} right-0 top-0`}>
          <button onClick={() => setDropdownOpen(!dropdownOpen)} className="text-gray-700 dark:text-gray-300">
            ⋮ {/* You can use any icon or three dots */}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-32 overflow-hidden bg-white rounded-md shadow-lg z-10">
              <button
                onClick={() => dispatch({ type: 'show_d_warning' })}
                className="block px-4 py-2 text-red-500 hover:bg-gray-100 w-full text-left"
              >
                <MdDeleteOutline className="inline-block mr-2" /> Delete
              </button>
              {/* <button
                onClick={() => navigate(`/edit-post/${state._id}`)}
                className="block px-4 py-2 text-blue-500 hover:bg-gray-100 w-full text-left"
              >
                <CiEdit className="inline-block mr-2" /> Edit
              </button> */}
            </div>
          )}
        </div>
      </div>

      {/* Post Content */}
      <p
        ref={postContentRef}
        className={`text-gray-700 dark:text-gray-300 whitespace-pre-wrap ${postContentExpanded ? 'max-h-full' : 'max-h-24'} overflow-hidden mt-2`}
      >
        {state.title}
      </p>

      {postContentRef.current?.scrollHeight > 96 && (
        <button
          onClick={() => setPostContentExpanded(!postContentExpanded)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
        >
          {postContentExpanded ? 'Show less' : '...Show more'}
        </button>
      )}

      {/* Media Section */}
      <div style={{scrollbarWidth: 'none'}} ref={mediaContainerRef} className={`flex ${state.imgVdo.length ? '' : 'hidden'} ${state.imgVdo.length > 1 ? 'overflow-x-auto' : ''} max-h-80 rounded gap-2 mt-2`}>
        {state.imgVdo.map((media, index) => (
          <div
            key={index}
            className={`rounded-lg ${state.imgVdo.length === 1 ? 'w-full' : 'flex-shrink-0'} overflow-hidden bg-transparent sm:max-h-80`}>
            {media.type === 'img' ? (
              <img
                onClick={() => mediaDragged ? null : setViewFullPost(true)}
                src={media.url}
                alt={`media-${index}`}
                className={`object-contain w-full h-full ${state.imgVdo?.length === 1 ? '' : 'max-w-56 sm:max-w-80 object-cover sm:max-h-80'}`}
              />
            ) : (
              <video
                onClick={() => mediaDragged ? null : setViewFullPost(true)}
                className={`object-contain w-full h-full ${state.imgVdo?.length === 1 ? '' : 'max-h-80'}`}
                controls
              >
                <source src={media.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button onClick={likeHandle} className={`flex ${state.like?.some((like) => like?.likedUserId === authUser?._id) ? 'text-orange-600 dark:text-orange-600' : ' hover:text-blue-600 dark:hover:text-blue-600'} items-center space-x-1 dark:text-gray-300 text-gray-600`}>
          {state.like?.some((like) => like?.likedUserId === authUser?._id)?<BiSolidLike/>:<BiLike />}
          <span>{state.like?.length} <span className='hidden sm:inline'>Likes</span></span>
        </button>
        <button onClick={() => dispatch({ type: 'open-comment' })} className="flex items-center space-x-1 dark:text-gray-300 text-gray-600 hover:text-blue-600 dark:hover:text-blue-600">
          <MdOutlineModeComment />
          <span>{state.comment?.length} <span className='hidden sm:inline'>Comment</span></span>
        </button>
        <button onClick={handleShare} className="flex items-center space-x-1 dark:text-gray-300 text-gray-600 hover:text-blue-600 dark:hover:text-blue-600">
          <TbShare2 />
          <span><span className='hidden sm:inline'>Share</span></span>
        </button>
      </div>
    </div>
  );
};


export default React.memo(PostCard);
