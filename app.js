const express = require("express");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT;
const path = require("path");
const userRoute = require("./routes/useroute");
const blogRoute = require("./routes/blogroute.js");
const mongoose = require("mongoose");
const { connectdb } = require("./connect.js");
const cookieParser = require("cookie-parser");
const { checkForAuthenticationCookie } = require("./middleware/auth.js");
const Blog = require("./models/blog");
const YourBlog = require("./routes/yourblogroute.js")
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.static('public'));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));

// Middleware to pass user data to views
app.use((req, res, next) => {
    res.locals.user = req.user || null; // Pass user data to views
    next();
});

// Home route - fetch and display all blogs on homepage
app.get("/", async (req, res) => {
    try {
        const blogs = await Blog.find().populate('createdBy').exec(); // Fetch all blogs
        res.render("home", { 
            user: req.user,
            blogs: blogs // Pass blogs to the template
        });
    } catch (error) {
        console.error("Error fetching blogs:", error);
        res.status(500).send("Error retrieving blogs.");
    }
});

// User routes
app.use("/user", userRoute);

// Blog routes
app.use("/blog", blogRoute);
app.use("/your-blog", YourBlog); // Make sure this is set correctly in index.js


// Start the server
app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));

// Connect to the MongoDB database
connectdb();
