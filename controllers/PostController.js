const Post = require("../models/Post");
const User = require("../models/User");
const { v4: uuidv4 } = require("uuid");

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("user").exec(); //.populate("user").exec() = transfer the information about user in the object with posts
    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Can't get posts!",
    });
  }
};

const getPopularPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort("-viewsCount")
      .sort("-viewsCount")
      .populate("user")
      .exec(); //.populate("user").exec() = transfer the information about user in the object with posts
    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Can't get posts!",
    });
  }
};

const getPostsWithTagOf = async (req, res) => {
  try {
    const tag = req.params.id;
    const posts = await Post.find({ tags: tag });
    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Can't get posts!",
    });
  }
};

const getLastTags = async (req, res) => {
  try {
    const posts = await Post.find().limit(5).exec();

    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);

    res.json(tags);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Can't get tags",
    });
  }
};

const getLastCommentaries = async (req, res) => {
  try {
    const posts = await Post.find().limit(8).exec();
    const newArray = [];
    posts.map((obj) => {
      obj.commentaries.forEach((el) =>
        newArray.push({
          userName: el.userName,
          userAvatar: el.userAvatar,
          comment: el.comment,
          commentId: el.commentId,
        })
      );
    });
    // posts.map((obj) => {
    //   obj.commentaries.forEach((el) => console.log(el));
    // });

    res.json(newArray);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Can't get comments",
    });
  }
};

const getSinglePost = async (req, res) => {
  try {
    const postId = req.params.id;
    Post.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: "after",
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: "Can't get a post",
          });
        }
        if (!doc) {
          return res.status(404).json({
            message: `No posts with id ${postId}`,
          });
        }
        res.json(doc);
      }
    ).populate("user");
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Can't get posts!",
    });
  }
};

const createPost = async (req, res) => {
  try {
    const doc = new Post({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags.split(","),
      user: req.userId,
    });

    const post = await doc.save();
    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Can't create a post!",
    });
  }
};

const updatePost = async (req, res) => {
  const postId = req.params.id;
  try {
    await Post.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.userId,
        tags: req.body.tags.split(","),
      }
    );
    res.json({
      success: true,
      message: "Post was edited",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Can't edit post",
    });
  }
};

const updatePostCommentaries = async (req, res) => {
  const postId = req.params.id;
  try {
    const user = await User.findById(req.userId);
    await Post.updateOne(
      {
        _id: postId,
      },
      {
        $push: {
          commentaries: {
            userId: req.userId,
            userName: user.fullName,
            userAvatar: user.avatarUrl
              ? user.avatarUrl
              : "https://www.pngkey.com/png/full/349-3499617_person-placeholder-person-placeholder.png",
            comment: req.body.commentaries,
            commentId: uuidv4(),
          },
        },
      }
    );
    res.json({
      success: true,
      message: "Comment was added",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Can't add comment!",
    });
  }
};
const deletePostCommentaries = async (req, res) => {
  const postId = req.params.id;
  const comId = req.params.commentId;
  try {
    await Post.updateOne(
      {
        _id: postId,
      },
      {
        $pull: {
          commentaries: { commentId: comId },
        },
      }
    );
    res.json({
      success: true,
      message: "Comment was deleted",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Can't delete comment!",
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    Post.findOneAndDelete(
      {
        _id: postId,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: "Can't delete a post",
          });
        }
        if (!doc) {
          return res.status(404).json({
            message: `No posts with id ${postId}`,
          });
        }
        res.json({
          success: true,
          message: "Post was deleted",
        });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Can't get post!",
    });
  }
};

module.exports = {
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
};
