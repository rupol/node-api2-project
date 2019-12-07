const express = require("express");

const router = express.Router({
  mergeParams: true
});

const posts = require("../data/db");

// POST	/api/posts/:id/comments	Creates a comment for the post with the specified id using information sent inside of the request body.
router.post("/", (req, res) => {
  if (!req.body.text) {
    return res.status(400).json({
      errorMessage: "Please provide text for the comment."
    });
  }

  const newComment = {
    text: req.body.text,
    post_id: req.params.id
  };

  posts
    .insertComment(newComment)
    .then(id => {
      if (id) {
        res.status(201).json(id);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: "There was an error while saving the comment to the database"
      });
    });
});

// GET	/api/posts/:id/comments	Returns an array of all the comment objects associated with the post with the specified id.
router.get("/", (req, res) => {
  posts
    .findPostComments(req.params.id)
    .then(comment => {
      if (comment && comment.length) {
        res.status(200).json(comment);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: "The comments information could not be retrieved."
      });
    });
});

module.exports = router;
