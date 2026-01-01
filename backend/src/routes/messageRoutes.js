const express = require("express");
const router = express.Router();
const {
  sendMessage,
  getMessages,
  markAsRead,
} = require("../controllers/messageController");
const authMiddleware = require("../middleware/authmiddleware");

router.use(authMiddleware);

router.post("/", sendMessage);
router.get("/", getMessages);
router.put("/:id/read", markAsRead);

module.exports = router;
