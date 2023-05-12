const express = require("express");
const protect = require("../middlewares/authMiddleware");
const {
  getAllPosts,
  createPost,
  deletePost,
  updatePost,
  getSinglePost,
} = require("../controllers/postController");

const router = express.Router();

//localhost:3000/s
router.route("/").get(protect, getAllPosts).post(protect, createPost);

router
  .route("/:id")
  .get(protect, getSinglePost)
  .put(protect, updatePost)
  .delete(protect, deletePost);

module.exports = router;
