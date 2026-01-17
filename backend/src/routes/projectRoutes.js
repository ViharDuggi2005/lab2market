const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const {
  createProject,
  getProjects,
  getMyProjects,
  getInterestedProjects,
  expressInterest,
  removeInterestedProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectcontroller");

router.post("/", auth, role(["researcher"]), createProject);
router.get("/", auth, role(["investor", "admin"]), getProjects);
router.get("/mine", auth, role(["researcher"]), getMyProjects);
router.get("/interested", auth, role(["investor"]), getInterestedProjects);
router.post("/:id/interest", auth, role(["investor"]), expressInterest);
router.delete(
  "/interested/:id",
  auth,
  role(["investor"]),
  removeInterestedProject
);
router.put("/:id", auth, role(["researcher"]), updateProject);
router.delete("/:id", auth, role(["researcher"]), deleteProject);

module.exports = router;
