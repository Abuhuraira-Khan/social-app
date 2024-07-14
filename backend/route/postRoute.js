import express from "express";
import {
  getuserDetails,
  newPost,
  showPost,
  likeThePost,
  commentThePost,
  deleteComment,
  getCommentedUser,
  getUserInComment,
  viewOnePost
} from "../controller/postController.js";

const router = express.Router();

router.get("/upload-post/user/:id", getuserDetails);
router.post("/upload-post", newPost);
router.get("/getAllPost", showPost);
router.put("/like-the-post", likeThePost);
router.put("/add-new-comment", commentThePost);
router.put("/delete-comment/:id&:postId", deleteComment);
router.get("/get-commented-user/:userId", getCommentedUser);
router.get("/get-user-in-comment/:userId", getUserInComment);
router.get("/view-one-post/:postId", viewOnePost);

export default router;
