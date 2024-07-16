import React, { useEffect, useState } from 'react';
import PostCard from './PostCard';
import { useParams } from 'react-router-dom';

const PostViewPage = () => {
    const { postId } = useParams();
    const [getPost, setGetPost] = useState({})

    useEffect(() => {
        const getPost = async ()=>{
            const response = await fetch(`https://social-app-kigf.onrender.com/post/view-one-post/${postId}`);
            const data = await response.json();
            console.log("first",data)
            setGetPost(data);
        }
        getPost();
    }, [])
    console.log(getPost)

  return (
    <div>
        <div>
            <PostCard post={getPost} />
        </div>
    </div>
  )
}

export default PostViewPage
