const express = require('express');
const router = express.Router();
const aiController = require("../controllers/ai.controller")
const rateLimiter = require("../middleware/rateLimiter")


// Apply rate limiting to the review endpoint
router.post("/get-review", rateLimiter, aiController.getReview)


module.exports = router;    