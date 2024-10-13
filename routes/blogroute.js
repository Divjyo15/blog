const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const Blog = require("../models/blog");
const Comment = require("../models/comment");

const router = Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

// Route to render Add Blog page
router.get("/add-new", (req, res) => {
  if (!req.user) {
    return res.redirect("/user/signin");
  }
  return res.render("addBlog", {
    user: req.user,
  });
});

// Route to handle blog submission
router.post("/", upload.single("coverImage"), async (req, res) => {
  const { title, body } = req.body;
  try {
    const blog = await Blog.create({
      title,
      body,
      createdBy: req.user._id,
      coverImageURL: `/uploads/${req.file.filename}`,
    });
    return res.redirect(`/blog/${blog._id}`);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error creating the blog.");
  }
});

// Route to display all blogs created by the logged-in user (Your Blog feature)
router.get("/your-blog", async (req, res) => {
  if (!req.user) {
    return res.redirect("/user/signin");
  }

  try {
    const blogs = await Blog.find({ createdBy: req.user._id });
    res.render("yourBlog", {
      user: req.user,
      blogs: blogs
    });
  } catch (error) {
    console.error("Error fetching user's blogs:", error);
    res.status(500).send("Error fetching your blogs.");
  }
});

// Route to display a specific blog post by its ID
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("createdBy");
    const comments = await Comment.find({ blogId: req.params.id }).populate("createdBy");

    if (!blog) {
      return res.status(404).send("Blog not found");
    }

    res.render("blog", {
      user: req.user,
      blog: blog,
      comments
    });
  } catch (error) {
    console.error("Error retrieving the blog:", error);
    return res.status(500).send("Error retrieving the blog.");
  }
});

// Route to handle comment submission
router.post("/comment/:blogId", async (req, res) => {
  try {
    await Comment.create({
      content: req.body.content,
      blogId: req.params.blogId,
      createdBy: req.user._id,
    });
    return res.redirect(`/blog/${req.params.blogId}`);
  } catch (error) {
    console.error("Error submitting the comment:", error);
    return res.status(500).send("Error submitting the comment.");
  }
});

// Route to handle comment edit submission
router.post("/comment/:commentId/edit", async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment || comment.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).send("You are not allowed to edit this comment.");
    }

    if (!req.body.content || req.body.content.trim() === "") {
      return res.status(400).send("Comment content is required.");
    }

    comment.content = req.body.content;
    await comment.save();

    res.redirect(`/blog/${comment.blogId}`);
  } catch (error) {
    console.error("Error updating the comment:", error);
    res.status(500).send("Error updating the comment.");
  }
});

// Route to delete a blog by ID
router.post("/delete/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (blog && blog.createdBy.toString() === req.user._id.toString()) {
      await Blog.findByIdAndDelete(req.params.id);
      return res.redirect("/blog/your-blog");
    }
    res.status(403).send("Unauthorized");
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).send("Error deleting the blog.");
  }
});

module.exports = router;
