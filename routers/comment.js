const express = require("express");

const router = express.Router({
  mergeParams: true
});

const posts = require("../data/db");

// POST	/api/posts/:id/comments	Creates a comment for the post with the specified id using information sent inside of the request body.

// GET	/api/posts/:id/comments	Returns an array of all the comment objects associated with the post with the specified id.

module.exports = router;
