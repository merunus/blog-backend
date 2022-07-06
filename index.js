require("dotenv").config();
const fs = require("fs")
const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const cors = require("cors");
const {
  registerValidation,
  loginValidation,
  postCreateValidation,
  commentCreateValidation,
} = require("./validations");
const { handleValidationErrors, checkAuth } = require("./utils");
const {
  login,
  register,
  getMe,
  createPost,
  getAllPosts,
  getSinglePost,
  deletePost,
  getLastTags,
  updatePost,
  getPopularPosts,
  getPostsWithTagOf,
  updatePostCommentaries,
  deletePostCommentaries,
  getLastCommentaries,
} = require("./controllers");

const app = express();
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("DB is OK");
  })
  .catch((error) => {
    console.log(`DB ERROR ${error}`);
  });

const storage = multer.diskStorage({
  destination: (_, __, callback) => {
    if(!fs.existsSync("uploads")) {
      fs.mkdirSync("uploads")
    }
    callback(null, "uploads");
  },
  filename: (_, file, callback) => {
    callback(null, file.originalname);
  },
});
const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// USER ROUTES
app.post("/auth/login", loginValidation, handleValidationErrors, login);
app.post(
  "/auth/register",
  registerValidation,
  handleValidationErrors,
  register
);
app.get("/auth/me", checkAuth, getMe);
app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

// POST ROUTES
app.get("/tags", getLastTags);
app.get("/posts/withTags/:id", getPostsWithTagOf);
app.get("/posts", getAllPosts);
app.get("/posts/popular", getPopularPosts);
app.get("/posts/tags", getLastTags);
app.get("/posts/commentaries", getLastCommentaries)
app.get("/posts/:id", getSinglePost);
app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  createPost
);
app.delete("/posts/:id", checkAuth, deletePost);
app.patch(
  "/posts/commentaries/:id/:commentId",
  checkAuth,
  deletePostCommentaries
);
app.patch(
  "/posts/:id",
  postCreateValidation,
  checkAuth,
  handleValidationErrors,
  updatePost
);
app.patch(
  "/posts/commentaries/:id",
  commentCreateValidation,
  checkAuth,
  handleValidationErrors,
  updatePostCommentaries
);

app.listen(process.env.PORT || 4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server is listening on port 4444");
});
