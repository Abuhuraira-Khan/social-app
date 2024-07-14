import { MongoClient,ObjectId } from "mongodb";
import { configDotenv } from "dotenv";
import { client } from "../index.js";

configDotenv();

const mdb = process.env.DB;

export const signUpUser = async (req,res) => {
    const {fullName,email,userName,password,confirmPassword} = req.body;

    if(!fullName || !email || !userName || !password || !confirmPassword){
        return (
            res.status(500).json({message:"pleas fill out the al field"})
        )
    }

    const userD = {
        fullName,
        email,
        userName,
        password,
        coverPic:'',
        profilePic:'',
        bio:'',
        friends:{
            request:[],
            yourRequest:[],
            allFriends:[]
        },
        posts:[]
    }

    try {
        await client.connect();
        const db = client.db(mdb);
        const coll = db.collection("users");
        // Check if the user already exists
        const existingUser = await coll.findOne({$or: [{ email }, { userName }]});
        if (existingUser) {
            res.status(409).json({ message: "User already exists" });
            return;
        }

        const user = await coll.insertOne(userD);

            res.status(201).json({message:'bro success', data:{_id:userD._id}})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'bro error'})
    }
    finally{
        client.close()
    }
}


export const loginUser = async (req,res)=>{
    const {email,password} = req.body;

    try {
        await client.connect();
        const db = client.db(mdb);
        const coll = db.collection("users");
        const user = await coll.findOne({email,password});
        if(user){
            return res.status(200).json({message:"login succes", data:{_id:user._id}})
        }
        else{
            return res.status(401).json({message:"login failed", data:null})
        }

    } catch (error) {
        console.log(error)
    }
        
}

export const getUserProfile = async (req,res)=>{
    const {id} = req.params;
    try {
        await client.connect();
        const db = client.db(mdb);
        const coll = db.collection("users");
        const user = await coll.findOne({_id: new ObjectId(id)});
        res.json(user)
    } catch (error) {
        res.status(404).json({message:"error"})
    }
}

export const updateUserProfile = async (req,res)=>{
    const {id} = req.params;
    const udoc = req.body;



    try {
        await client.connect();
        const db = client.db(mdb);
        const coll = db.collection("users");
        const user = await coll.updateOne({_id: new ObjectId(id)},{$set:{
            profilePic:udoc.profilePic,
            coverPic:udoc.coverPic,
            fullName:udoc.fullName,
            userName: udoc.userName,
            bio:udoc.bio,
            friends:udoc.friends,
            posts:udoc.posts,
        }});
        res.json(user)

    } catch (error) {
        
    }
}

export const deletePost = async (req,res)=>{
    const {postId:id} = req.body;
    try {
        await client.connect();
        const db = client.db(mdb);
        const coll = db.collection("posts");
        const post = await coll.deleteOne({_id: new ObjectId(id)});
        if(post){
            res.status(200).json(post)
        }
    } catch (error) {
        res.status(404).json({message:"error"})
    }
}

export const getPostAuthor = async (req,res)=>{
    const {userId} = req.params;
    try {
        await client.connect();
        const db = client.db(mdb);
        const coll = db.collection("users");
        const user = await coll.findOne({_id: new ObjectId(userId)});
        const result = {
            userId: user._id,
            userImage: user.profilePic,
            userFullName:user.fullName
        };
        res.status(200).json(result)
    } catch (error) {
        
    }
}

  
