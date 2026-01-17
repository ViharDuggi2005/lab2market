const express = require("express");
const router = express.Router();
const {
  register,
  login,
  updateProfile,
} = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get(
  "/profile",
  auth,
  require("../controllers/authController").getProfile
);
router.put("/profile", auth, updateProfile);

module.exports = router;
