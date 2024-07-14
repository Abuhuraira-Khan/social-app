import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import { configDotenv } from "dotenv";
import {
  signUpUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deletePost,
  getPostAuthor
} from "../controller/userController.js";

const router = express.Router();

router.post("/sign-up", signUpUser);
router.post("/login", loginUser);
router.get("/get-profile/:id", getUserProfile);
router.put("/update-profile/:id", updateUserProfile);
router.delete("/delete-post", deletePost);
router.get("/get-post-author/:userId", getPostAuthor);

export default router;
