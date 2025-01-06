const express = require("express");
const { createPost, updatePost, deletePost, likePost, addComment, viewPosts } = require("../controllers/postController");
const { protect } = require("../middleware/authMiddleware"); 
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get("/", protect, viewPosts); 
router.post("/createPost", protect, upload.single("image"), createPost);
router.put("/:postId", protect, upload.single("image"), updatePost); 
router.delete("/:postId", protect, deletePost); 
router.post("/:postId/like", protect, likePost); 
router.post("/:postId/comment", protect, addComment); 

module.exports = router;
