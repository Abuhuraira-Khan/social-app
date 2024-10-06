import React, { useEffect, useState } from 'react';
import PostCard from './PostCard';
import { useParams } from 'react-router-dom';
import { apiUrl } from './context/Context';

const PostViewPage = () => {
    const { postId } = useParams();
    const [getPost, setGetPost] = useState({})

    useEffect(() => {
        const getPost = async ()=>{
            const response = await fetch(`${apiUrl}/post/view-one-post/${postId}`);
            const data = await response.json();
            console.log("first",data)
            setGetPost(data);
        }
        getPost();
    }, [])
    console.log(getPost)

  return (
    <div className='flex dark:bg-gray-900 bg-gray-100 min-h-screen dark:text-white justify-center'>
        <div className='w-full lg:min-w-[550px] lg:max-w-[550px] p-2'>
            <PostCard post={getPost} />
        </div>
    </div>
  )
}

export default PostViewPage
