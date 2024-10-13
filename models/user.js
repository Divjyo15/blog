/*const { Schema,model } = require("mongoose");
const { createHmac, randomBytes } = require("crypto");
const userSchema = new Schema(
    {
      fullName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      
      salt: {
        type: String,
      },
      password: {
        type: String,
        required: true,
      },
      profileImageURL: {
        type: String,
        default: "/img/image.jpg",
      },
      role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER",
      },
    },
    { timestamps: true }
  );
  
  userSchema.pre("save", function (next) {
    const user = this;
  
    if (!user.isModified("password")) return;
  
    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac("sha256", salt)
      .update(user.password)
      .digest("hex");
  
    this.salt = salt;
    this.password = hashedPassword;
  
    next();
  });
  
  userSchema.static(
    "matchPasswordAndGenerateToken",
    async function (email, password) {
      const user = await this.findOne({ email });
      if (!user) throw new Error("User not found!");
  
      const salt = user.salt;
      const hashedPassword = user.password;
  
      const userProvidedHash = createHmac("sha256", salt)
        .update(password)
        .digest("hex");
  
      if (hashedPassword !== userProvidedHash)
        throw new Error("Incorrect Password");
  
      const token = createTokenForUser(user);
      return token;
    }
  );
  
  const User = model("user", userSchema);
  
  module.exports = User;
  */
  const { Schema, model } = require("mongoose");
  const { createHmac, randomBytes } = require("crypto");
  const JWT = require("jsonwebtoken");
  
  const secret = "$uperMan@123"; // JWT Secret
  
  const userSchema = new Schema(
    {
      fullName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      salt: {
        type: String,
      },
      password: {
        type: String,
        required: true,
      },
      profileImageURL: {
        type: String,
        default: "/img/image.jpg",
      },
      role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER",
      },
    },
    { timestamps: true }
  );
  
  // Hash password before saving
  userSchema.pre("save", function (next) {
    const user = this;
  
    // Check if password has been modified
    if (!user.isModified("password")) return next();
  
    // Generate salt and hash the password
    const salt = randomBytes(16).toString("hex");
    const hashedPassword = createHmac("sha256", salt)
      .update(user.password)
      .digest("hex");
  
    user.salt = salt;
    user.password = hashedPassword;
  
    next();
  });
  
  // Function to match password and generate token
  userSchema.static("matchPasswordAndGenerateToken", async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error("User not found!");
  
    const salt = user.salt;
    const hashedPassword = user.password;
  
    // Hash the provided password with the stored salt
    const userProvidedHash = createHmac("sha256", salt)
      .update(password)
      .digest("hex");
  
    // Check if the hashed passwords match
    if (hashedPassword !== userProvidedHash) throw new Error("Incorrect Password");
  
    // Create a token for the authenticated user
    const token = createTokenForUser(user);
    return token;
  });
  
  // Function to create JWT token
  function createTokenForUser(user) {
    const payload = {
      _id: user._id,
      email: user.email,
      role: user.role,
    };
    return JWT.sign(payload, secret, { expiresIn: "1h" });
  }
  
  const User = model("user", userSchema);
  
  module.exports = User;
  