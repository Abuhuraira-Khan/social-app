import { MongoClient,ObjectId } from "mongodb";
import { configDotenv } from "dotenv";
import { client } from "../index.js";

configDotenv();

const mdb = process.env.DB;

export const getUserFriendsSuggest = async (req,res)=>{
    try {
       await client.connect();
       const db = client.db(mdb);
       const coll = db.collection('users');
        const result = await coll.find().toArray();
        res.json(result)
    } catch (error) {
        console.log(error);
    }
}