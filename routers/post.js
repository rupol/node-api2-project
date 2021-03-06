const express = require("express");
const router = express.Router();
const posts = require("../data/db");

const commentRouter = require("./comment");
router.use("/:id/comments", commentRouter);

// POST	/api/posts
// Creates a post using the information sent inside the request body.
router.post("/", (req, res) => {
  const { title, contents } = req.body;
  if (!title || !contents) {
    return res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  }

  const newPost = {
    title: title,
    contents: contents
  };

  posts
    .insert(newPost)
    .then(id => {
      res.status(201).json(newPost);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: "There was an error while saving the post to the database"
      });
    });
});

// GET	/api/posts
// Returns an array of all the post objects contained in the database.
router.get("/", (req, res) => {
  posts
    .find()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: "The posts information could not be retrieved."
      });
    });
});

// GET	/api/posts/:id
// Returns the post object with the specified id.
router.get("/:id", (req, res) => {
  posts
    .findById(req.params.id)
    .then(post => {
      if (post && post.length) {
        res.status(200).json(post);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: "The post information could not be retrieved."
      });
    });
});

// DELETE	/api/posts/:id
// Removes the post with the specified id and returns the deleted post object. You may need to make additional calls to the database in order to satisfy this requirement.
router.delete("/:id", (req, res) => {
  posts
    .findById(req.params.id)
    .then(post => {
      if (post && post.length) {
        posts
          .remove(req.params.id)
          .then(count => {
            res.status(200).json({ deleted: post });
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({
              error: "The post could not be removed"
            });
          });
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: "The post information could not be retrieved."
      });
    });
});

// PUT	/api/posts/:id
// Updates the post with the specified id using data from the request body. Returns the modified document, NOT the original.
router.put("/:id", (req, res) => {
  const { title, contents } = req.body;
  if (!title || !contents) {
    return res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  }

  const newPost = {
    title: title,
    contents: contents
  };

  posts
    .update(req.params.id, newPost)
    .then(count => {
      if (count > 0) {
        res.status(200).json(newPost);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: "There was an error while saving the post to the database"
      });
    });
});

module.exports = router;
