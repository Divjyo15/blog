const { Router } = require("express");
const Blog = require("../models/blog");

const router = Router();

// Route to display all blogs created by the logged-in user (Your Blog feature)
router.get("/", async (req, res) => {
  if (!req.user) {
    return res.redirect("/user/signin");  // Redirect to signin if user is not logged in
  }

  try {
    const blogs = await Blog.find({ createdBy: req.user._id });  // Find blogs by the logged-in user

    res.render("yourBlog", {
      user: req.user,
      blogs: blogs,  // Pass the fetched blogs to the "yourBlog" page
    });
  } catch (error) {
    console.error("Error fetching user's blogs:", error);
    res.status(500).send("Error fetching your blogs.");
  }
});

module.exports = router;
