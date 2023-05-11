const express = require("express");
const {
  getAllPosts,
  createPost,
  deletePost,
  updatePost,
  getSinglePost,
} = require("../controllers/postController");

const router = express.Router();

//localhost:3000/
router.route("/").get(getAllPosts).post(createPost);

router.route("/:id").get(getSinglePost).put(updatePost).delete(deletePost);

module.exports = router;
