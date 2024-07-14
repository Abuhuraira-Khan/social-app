import express from 'express';
import { MongoClient } from 'mongodb';
import { configDotenv } from 'dotenv';
import cors from 'cors';

import userRoute from './route/userRoute.js';
import postRoute from './route/postRoute.js';
import randRoute from './route/randRoute.js';

configDotenv();


const app = express();
const port = process.env.PORT || 4400;


const uri = process.env.MONGO_URI;
export const client = new MongoClient(uri);

const connectDb = async () =>{
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log(error);
    }
}

// middleware
app.use(cors());
app.use(express.json({limit:"30mb"}));
app.use('/user',userRoute);
app.use('/post',postRoute);
app.use('/random',randRoute);


app.listen(port,()=>{
    connectDb();
    console.log(`server is running on port ${port}`)
})