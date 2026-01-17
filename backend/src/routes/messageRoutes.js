const express = require("express");
const router = express.Router();
const {
  sendMessage,
  getMessages,
  markAsRead,
  expressInterest,
} = require("../controllers/messageController");
const authMiddleware = require("../middleware/authmiddleware");

router.use(authMiddleware);

router.post("/", sendMessage);
router.get("/", getMessages);
router.put("/:id/read", markAsRead);
router.post("/express-interest", expressInterest);

module.exports = router;
