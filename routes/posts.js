const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");

//GET A POST
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    await newPost.save();
    res.status(200).json(newPost);
  } catch (err) {
    res.status(500).json(err);
  }
});
//UPDATE POST
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json("Postr not found!");
    if (post.username === req.body.username) {
      try {
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).send(updatedPost);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can only update your posts");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//GET POST
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json("Post not found!");
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});
//GET ALL POSTS
router.get("/", async (req, res) => {
  const username = req.query.user;
  const category = req.query.cat;
  try {
    let posts;
    if (username) {
      posts = await Post.find({ username });
    } else if (category) {
      posts = await Post.find({
        categories: {
          $in: [category],
        },
      });
    } else {
      posts = await Post.find().sort({ createdAt: "desc" });
    }
    res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//DELETE POST
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json("Post not found!");
    if (post.username === req.body.username) {
      try {
        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json("The  post has been deleted !!");
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can only update your posts");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
