import { MongoClient,ObjectId } from "mongodb";
import { configDotenv } from "dotenv";
import { client } from "../index.js";

configDotenv();

const mdb = process.env.DB;

export const getuserDetails = async (req,res)=>{
    const {id} = req.params;
    try {
        await client.connect();
        const db = client.db(mdb);
        const coll = db.collection("users");
        const user = await coll.findOne({_id: new ObjectId(id)});
        res.json(user)
    } catch (error) {
        
    }
}

export const newPost = async (req,res)=>{
    const {
        title,
        imgVdo,
        userId,
        userImage,
        userFullName,
        postTime,
        postType,
        comment,
        like,
        share
    } = req.body;

    const post = {
        title,
        imgVdo,
        userId,
        userImage,
        userFullName,
        postTime,
        postType,
        comment,
        like,
        share
    }

    try {
        await client.connect();
        const db = client.db(mdb);
        const coll = db.collection("posts");
        const result = await coll.insertOne(post);
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const showPost = async (req,res)=>{
    try {
        await client.connect();
        const db = client.db(mdb);
        const coll = db.collection("posts");
        const result = await coll.find().toArray();
        res.status(200).json({data:result})
    } catch (error) {
        res.status(404).json({message:'not have post'})
    }
}

export const likeThePost = async (req,res)=>{
    const {postId,userId,type} = req.body;
    try {
        await client.connect();
        const db = client.db(mdb);
        const coll = db.collection("posts");
        if (type==="unlike") {
            const result = await coll.updateOne({_id:new ObjectId(postId)},{$push:{like:{
                _id:new ObjectId(),
                likedUserId:userId,
            }}})
            res.status(200).json(result)
        }

        if(type==='liked'){
            const result = await coll.updateOne({_id:new ObjectId(postId)},{$pull:{like:{
                likedUserId:userId,
                }}})
                res.status(200).json(result)
        }

    } catch (error) {
        console.log(error)
    }
}

export const commentThePost = async (req,res)=>{
    const comment = req.body;

    const commentDoc = {
        _id:new ObjectId(),
        postId:comment.postId,
        userId: comment.userId,
        profilePic:comment.profilePic,
        userFullName:comment.userFullName,
        text:comment.text,
        likes:comment.likes,
        replies:comment.replies,
        date:new Date()

    }

    try {
        await client.connect();
        const db = client.db(mdb);
        const coll = db.collection("posts");
        const result = await coll.updateOne({_id:new ObjectId(comment.postId)},{$push:{comment:commentDoc
        }})
        res.status(200).json(result)
    } catch (error) {
        console.log(error)
    }
}

export const getCommentedUser = async(req,res)=>{
    const {userId} = req.params;
    try {
        await client.connect();
        const db = client.db(mdb);
        const coll = db.collection("users");
        const result = await coll.findOne({_id:new ObjectId(userId)});
        res.status(200).json({data:{userFullName:result.fullName,profilePic:result.profilePic}})
    } catch (error) {
        console.log(error)
    }

}

export const deleteComment = async (req,res)=>{
    const {id,postId} = req.params;
    try {
        await client.connect();
        const db = client.db(mdb);
        const coll = db.collection("posts");
        const result = await coll.updateOne({_id:new ObjectId(postId)},{$pull:{comment:{_id:new ObjectId(id)}}})
        res.status(200).json(result)
    } catch (error) {
        console.log(error)
    }
}

export const getUserInComment = async (req,res) =>{
    const {userId} = req.params;

    try {
        await client.connect();
        const db = client.db(mdb);
        const coll = db.collection("users");
        const result = await coll.findOne({_id:new ObjectId(userId)});
        res.status(200).json(result.profilePic)
    } catch (error) {
        console.log(error)
    }
}

export const viewOnePost = async (req,res)=>{
    const {postId} = req.params;
    console.log(postId)
    try {
        await client.connect();
        const db = client.db(mdb);
        const coll = db.collection("posts");
        const result = await coll.findOne({_id:new ObjectId(postId)});
        res.status(200).json(result)
    } catch (error) {
        console.log(error)
    }
}