/*const { Router } = require("express");
const User = require("../models/user");

const router = Router();

router.get("/signin", (req, res) => {
  return res.render("signin");
});

router.get("/signup", (req, res) => {
  return res.render("signup");
});


router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    res.cookie("token", token); 
    return res.redirect("/");  
  } catch (error) {
    return res.render("signin", {
      error: "Incorrect Email or Password",
    });
  }
});


router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
});

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;
  await User.create({
    fullName,
    email,
    password,
  });
  return res.redirect("/");
});

module.exports = router;
 */
// routes/useroute.js
const { Router } = require("express");
const User = require("../models/user");

const router = Router();

router.get("/signin", (req, res) => {
  return res.render("signin");
});

router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    
    return res.cookie("token", token).redirect("/");
  } catch (error) {
    return res.render("signin", {
      error: "Incorrect Email or Password",
    });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
});

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    await User.create({
      fullName,
      email,
      password,
    });
    return res.redirect("/user/signin");
  } catch (error) {
    return res.render("signup", {
      error: "Error creating account",
    });
  }
});

module.exports = router;
/* routes/useroute.js
const { Router } = require("express");
const User = require("../models/user");

const router = Router();

// ... other routes remain the same ...

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    const user = await User.create({
      fullName,
      email,
      password,
    });
    
    // Generate token for the newly created user
    const token = user.generateToken();
    
    // Set the token in a cookie and redirect to homepage
    res.cookie("token", token).redirect("/");
  } catch (error) {
    return res.render("signup", {
      error: "Error creating account",
    });
  }
});

// ... other routes remain the same ...

module.exports = router;*/
