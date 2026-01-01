const express = require("express");
const router = express.Router();
const auth = require("../middleware/authmiddleware");
const role = require("../middleware/rolemiddleware");
const {
  createProject,
  getProjects,
  getMyProjects,
  updateProject,
  deleteProject,
} = require("../controllers/projectcontroller");

router.post("/", auth, role(["researcher"]), createProject);
router.get("/", auth, role(["investor", "admin"]), getProjects);
router.get("/mine", auth, role(["researcher"]), getMyProjects);
router.put("/:id", auth, role(["researcher"]), updateProject);
router.delete("/:id", auth, role(["researcher"]), deleteProject);

module.exports = router;
