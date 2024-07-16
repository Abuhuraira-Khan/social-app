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
import {FaCopy} from 'react-icons/fa6';
import { getPostContext } from './context/Context';


const DeleteWarning = ({postId,dispatch}) => {

  const deleteCardRef = useRef(null);
  const postC = useContext(getPostContext);

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
      const res = await fetch(`https://social-app-kigf.onrender.com/user/delete-post`,{
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

  const deleteComment = async (id)=>{
    console.log(id)
    const res = await fetch(`https://social-app-kigf.onrender.com/post/delete-comment/${id}&${props.comment.postId}`,{
      method:'PUT',
      headers: {
        'Content-Type': 'application/json',
        }
    })
    .then((result)=>{
      if(result.ok){
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
      const res = await fetch(`https://social-app-kigf.onrender.com/post/get-commented-user/${props.comment.userId}`)
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
        className="w-10 h-10 rounded-full mr-3"
      />
      <div>
        <div className="bg-gray-100 p-3 rounded-lg relative ">
          <button onClick={()=>deleteComment(cardComment._id)} className={`absolute ${cardComment.userId===props.comment.userId?'block':'hidden'} top-0 right-1 hover:text-red-500`}><MdDeleteOutline/></button>
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

const CommentSection = (props) => {
  const [comments, setComments] = useState([
  ]);

  const [authUser,setAuthUser] = useAuth();
  const [newComment, setNewComment] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const navigate = useNavigate();


  // const handleLike = (id) => {
  //   setComments((prevComments) =>
  //     prevComments.map((comment) =>
  //       comment.id === id ? { ...comment, likes: comment.likes + 1 } : comment
  //     )
  //   );
  // };

  const [newCommentObj,setNewCommentObj] = useState(
    {
      postId:props.postId,
      userId: props.userId,
      profilePic: '',
      userFullName:'',
      text: newComment,
      likes: [],
      replies: [],
    }
  )

  const handleAddComment = async () => {
    if (newComment.trim() === '') return;

    const commentDoc = {
     postId: newCommentObj.postId,
     userId: newCommentObj.userId,
     profilePic:newCommentObj.profilePic,
     userFullName:newCommentObj.userFullName,
     text: newComment,
     likes: [],
     replies: [],
    }
    const res  = await fetch(`https://social-app-kigf.onrender.com/post/add-new-comment`,{
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

  let [userProfile,setUserProfile] = useState('');

  useEffect(() => {
    const getUser = async ()=>{
      const res = await fetch(`https://social-app-kigf.onrender.com/post/get-user-in-comment/${authUser._id}`)
      const data = await res.json();
      setUserProfile(data);
    }
  getUser();
    return () => {
      setUserProfile('')
    }
  }, [])
  
  return (
    <div className='w-screen h-screen z-30 fixed bg-black-rgba top-0 left-0 '>
      <div className="max-w-lg h-screen mx-auto my-5 p-4 bg-white rounded shadow-2xl overflow-y-auto">
        <div className='flex justify-end items-center'>
          <button onClick={()=>props.dispatch({type:'open-comment'})} className='hover:bg-slate-200 p-1 rounded-full'><RxCross2 size={25} /></button>
        </div>
        <h2 className="text-2xl font-bold mb-4">Comments</h2>
        <div className="mb-4">
          <div className="flex items-start mb-2">
            <img
              src={userProfile}
              alt="Profile"
              className="w-10 h-10 rounded-full mr-3"
            />
            <textarea
              className="w-full max p-2 border rounded focus:outline-none resize-none focus:ring-2 focus:ring-primery"
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

const ShareSection = ({url,dispatch})=>{

  const handleCopyUrl = ()=>{
    navigator.clipboard.writeText(url)
    dispatch({type:'open-share'})
  }

  return(
    <div className='w-screen h-screen top-0 left-0 fixed bg-black-rgba z-50 flex justify-center items-center'>
      <div>
        <div className='bg-white relative rounded-md p-5 flex w-96 h-22 justify-center items-center'>
          <button onClick={()=>dispatch({type:'open-share'})} className=' absolute top-0 right-1'><RxCross2 size={18}/></button>
          <div className="w-full flex">
            <p className='bg-slate-200 p-1 w-full truncate'>{url}</p>
            <button onClick={handleCopyUrl} className='bg-primery w-10 text-white flex justify-center items-center'><FaCopy size={22}/></button>
          </div>
        </div>
      </div>
    </div>
  )
}

const initialState = {
  like:[],
  comment:[],
  share:[],
  isEdit:false,
  showDWarning:false,
  openComment:false,
  openShare:false,
  imgVdo: [],
  title:``
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
      return {...state,...action.author}
    // case 'go_post':
    //   return {...state,...action.post}  
    default:
      return state;
  }
};


const PostCard = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();
  const [authUser,setAuthUser] = useAuth();

  const likeHandle = async () => {
    if(state.like.some(like=>like.likedUserId===authUser._id)){
    const res = await fetch(`https://social-app-kigf.onrender.com/post/like-the-post`,{
      method:'PUT',
      headers: {
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        postId:state._id,
        userId:authUser._id,
        type:'liked'
      })
    })
    dispatch({ type: 'remove-like', value:{_id:'',likedUserId:authUser._id} });
  }
   else{
    const res = await fetch(`https://social-app-kigf.onrender.com/post/like-the-post`,{
      method:'PUT',
      headers: {
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        postId:state._id,
        userId:authUser._id,
        type:'unlike'
      })
    })
    dispatch({ type: 'add-like', value:{_id:'',likedUserId:authUser._id} });
  }
  };

  useEffect(() => {
    const getPost = ()=>{
      const post = props.post;
      dispatch({type:'get_post',post:post})
    }
    getPost();
  }, [props.post])

  // get post author information
  useEffect(() => {
    const getAuthor = async () => {
      const res = await fetch(`https://social-app-kigf.onrender.com/user/get-post-author/${props.post.userId}`)
      const data = await res.json();
      dispatch({type:'get_author', author:data})
    }
    getAuthor();
  },[props.post.userId])

  const [shareUrl, setShareUrl] = useState('')

  const handleShare = (e)=>{
    dispatch({type:'open-share'})
    const ur = location.href+'post/'+props.post._id;
    setShareUrl(ur)
  }


  const iSize = 22;

  return (
    <div className='max-w-[550px]'>
      <div className="postCard relative border">
        <div className="postCard-wrapper p-2">
          <div className="user flex justify-between items-center font-medium">
            <div onClick={()=>{navigate(`/profile/${state.userId}`)}} className=' hover:underline flex space-x-2 items-center cursor-pointer'>
              <img className='w-10 h-10 rounded-full' src={state.userImage} />
              <p>{state.userFullName}</p>
            </div>
            {/* post edit delete */}
            <div className={`${authUser && state.userId === authUser._id?'block': 'hidden'}`}> 
              <div className='flex items-center space-x-3'>
                <button onClick={()=>{dispatch({type:'show_d_warning'})}}><MdDeleteOutline size={iSize}/></button>
                <button><CiEdit size={iSize}/></button>
              </div>
            </div>
          </div>
          {/* conditional show post delete warning */}
          {state.showDWarning?<DeleteWarning postId={state._id} dispatch={dispatch}/>:null}
          <div className="post-content p-2">
            <p>{state.title}</p>
          </div>
          <div className={`post-image rounded-md lg:max-w-full`}>
            <div className={` lg:max-w-full rounded-md overflow-hidden ${state.imgVdo.length > 1 ? "grid grid-cols-2" : ""} ${state.imgVdo.length > 3 ? 'grid-rows-2' : ''}`}> 

              {state.imgVdo.slice(0,3).map((img, i) =>{
                return(
                  <img key={i} className='w-full object-cover border-2' src={img.url} />
                )
              })}
              <div className={`bg-red-600 flex justify-center items-center ${state.imgVdo.length>3?'block':'hidden'}`}>
              <button>see more</button>
              </div>
            </div>
          </div>
        </div>
        <div className=' capitalize flex justify-between border-t-2 px-5 text-slate-500'>
          <p><span>{state.like.length}</span> like</p>
          <p><span>{state.comment.length}</span> comment</p>
          <p><span>{state.share.length}</span> share</p>
        </div>
        <div className="flex items-center border-t-2 p-2 px-5 justify-between capitalize text-slate-700">
          <button onClick={()=>authUser?likeHandle():navigate(`/login`)} className={`flex items-center space-x-2 capitalize ${state.like.some(like=>like.likedUserId===authUser._id)? 'text-accent' : ''}`}>
            {state.like.some(like=>like.likedUserId===authUser._id) ? <BiSolidLike size={iSize} /> : <BiLike size={iSize} />} <span>Like</span>
          </button>
          <button onClick={()=>dispatch({type:'open-comment'})} className='flex items-center space-x-2 capitalize'><MdOutlineModeComment size={iSize} /><span>Comment</span></button>
          <button onClick={handleShare} className='flex items-center space-x-2 capitalize'><TbShare2 size={iSize} /><span>Share</span></button>
        </div>
      </div>
      {/* conditional comment open closs */}
      {state.openComment?<CommentSection comment={state.comment} userId={authUser && authUser._id}  postId={state._id} dispatch={dispatch} />:null}
      {/* conditional share open closs */}
      {state.openShare?<ShareSection url={shareUrl} dispatch={dispatch}/>:null}



    </div>
  );
};

export default React.memo(PostCard);
