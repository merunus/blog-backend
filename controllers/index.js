const {
  createPost,
  getAllPosts,
  getSinglePost,
  deletePost,
  updatePost,
  getLastTags,
  getPopularPosts,
  getPostsWithTagOf,
  updatePostCommentaries,
  deletePostCommentaries,
  getLastCommentaries,
} = require("./PostController");

const { login, register, getMe } = require("./UserController");

module.exports = {
  createPost,
  getAllPosts,
  getSinglePost,
  deletePost,
  updatePost,
  login,
  register,
  getMe,
  getLastTags,
  getPopularPosts,
  getPostsWithTagOf,
  updatePostCommentaries,
  deletePostCommentaries,
  getLastCommentaries,

};
