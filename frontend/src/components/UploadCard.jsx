import React,{useContext, useEffect, useRef, useState} from "react";
import { useNavigate } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import { LuImagePlus } from "react-icons/lu";
import { RiVideoAddLine } from "react-icons/ri";
import { useAuth,postBtnContext,getPostContext,apiUrl } from "./context/Context";


const UploadCard = () => {

    const cardShowbtn = useContext(postBtnContext);
    const [imgList, setimgList] = useState([])
    const sImgRef = useRef(null);
    const sVdoRef = useRef(null);
    const navigate = useNavigate();

    const [postForm, setPostForm] = useState({
        title: '',
        imgVdo:[...imgList],
        userId:'',
        userImage:'',
        userFullName:'',
        postTime:new Date(),
        postType:'',
        comment:[],
        like:[],
        share:[],
    });

    const handleImgU = () =>{
        sImgRef.current.click()
    }

    const handleVdoU = () =>{
        sVdoRef.current.click()
    }

    const handleChangeI = (e)=>{
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setimgList([...imgList, {type:"img",url:reader.result}]);
            }
            reader.readAsDataURL(file);
    }

    const handleChangeV = (e)=>{
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setimgList([...imgList,{type:"vdo",url:reader.result}]);
            }
            reader.readAsDataURL(file);
    }


    const vdoRemoveH = (idx)=>{
        setimgList(imgList.filter((item,i)=> i !== idx))
    }
    const imgRemoveH = (idx)=>{
        setimgList(imgList.filter((item,i)=> i !== idx))
    }
    //upload post 
    const [authUser,setAuthUser] = useAuth();

    useEffect(() => {
       const getUserDetails = async ()=>{
        try {
            const res = await fetch(`${apiUrl}/post/upload-post/user/${authUser._id}`)
            const result = await res.json();
            setPostForm({
                ...postForm,
                userId:result._id,
                userImage:result.profilePic,
                userFullName:result.fullName
            })
        } catch (error) {
            
        }
       }
    getUserDetails();

    }, [authUser])
    
    // upload new post
    const sendPostData = useContext(getPostContext);
    const uploadPost = async () => {
        const res = await fetch(`${apiUrl}/post/upload-post`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authUser?._id}`
            },
            body: JSON.stringify({
                ...postForm,
                imgVdo: imgList,

            })
        }).then(async(result) => {
            const data = await result.json();
            if(result.ok){
                alert("Post Uploaded Successfully");
                cardShowbtn.setPostBtn(!cardShowbtn.postBtn);
                sendPostData.setGetPosts([...sendPostData.getPosts,data])

            }
            else{
                alert(data.message)
                navigate('/login')
            }
        })
    }

    // body scrollbar hidden
    useEffect(() => {
      document.body.style.overflow='hidden'
    
      return () => {
        document.body.style.overflow='auto'
      }
    }, [])
    

  return (
    <div className="w-screen h-screen bg-black-rgba fixed top-0 left-0 z-30">
      <div className="upload-card w-full h-full flex justify-center items-center ">
        <div className="wrapper relative w-[500px] bg-bgc p-1">
            <div className="flex justify-end  items-start">
            <button onClick={()=>{cardShowbtn.setPostBtn(!cardShowbtn.postBtn)}} className=" top-0 right-0 hover:bg-slate-200 p-1 rounded-full"><RxCross2 size={25}/></button>
            </div>
          <div className="sec relative bg-bgc p-2">
            <div className="text border-b-2 mb-2">
              <textarea
              onChange={(e)=>{setPostForm({...postForm,[e.target.name]:e.target.value})}}
                name="title"
                placeholder="whats your mind"
                className="w-full h-28 bg-slate-200 resize-none focus:outline-pink-600 p-1"
              ></textarea>
            </div>
            {/* img vdo tak sec */}
            <div className="w-full h-full">
                <div className="wrapper relative ">
                {imgList.map((im,i)=>{
                    if(im.type === "img"){
                        return (
                            <div  key={i} className="w-20 h-20 relative inline-block">
                            <button onClick={()=>imgRemoveH(i)}><RxCross2/></button>
                                <div className="w-full h-full overflow-hidden">
                                <img className="w-full h-full object-cover" src={im.url} alt=""></img>
                                </div>
                            </div>
                        )
                    }
                    else if(im.type === "vdo"){
                        return (
                            <div  key={i} className="w-20 h-20 relative inline-block">
                                <button onClick={()=>vdoRemoveH(i)} ><RxCross2/></button>
                                <div className="w-full h-full overflow-hidden">
                                <video className="w-full h-full object-cover" src={im.url} alt=""></video>
                                </div>
                            </div>
                        )
                    }
                })}
                </div>
            </div>
            {/* img vdo */}
            <div className="flex space-x-1 border-t-2">
                <button onClick={handleImgU} className="p-1 px-5 flex font-bold capitalize items-center space-x-1 text-lg "><LuImagePlus size={35} /><input ref={sImgRef} onChange={handleChangeI} type="file" name="vdo" className="hidden"/> <span>photo</span></button>
                <button onClick={handleVdoU} className="p-1 px-5 flex font-bold capitalize items-center space-x-1 text-lg "><RiVideoAddLine size={35} /><input ref={sVdoRef} onChange={handleChangeV} type="file" name="img" className="hidden"/> <span>video</span></button>
            </div>
          </div>
          <div className="flex justify-center">
            <button onClick={uploadPost} className=" bg-primery p-2 px-4 rounded-md text-bgc text-xl font-medium">Post</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadCard;
