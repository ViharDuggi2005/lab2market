const Project = require("../models/Project");
const User = require("../models/User");

exports.createProject = async (req, res) => {
  try {
    const project = await Project.create({
      ...req.body,
      createdBy: req.user.id,
    });
    res.json(project);
  } catch (err) {
    console.error("createProject error:", err);
    res.status(500).json({ message: "Server error creating project" });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate("createdBy", "name role");
    res.json(projects);
  } catch (err) {
    console.error("getProjects error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ createdBy: req.user.id }).populate(
      "createdBy",
      "name role"
    );
    res.json(projects);
  } catch (err) {
    console.error("getMyProjects error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getInterestedProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      interestedUsers: req.user.id,
    }).populate("createdBy", "name role");
    res.json(projects);
  } catch (err) {
    console.error("getInterestedProjects error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.removeInterestedProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    project.interestedUsers = project.interestedUsers.filter(
      (userId) => userId.toString() !== req.user.id
    );
    await project.save();
    res.json({ message: "Removed from interested projects" });
  } catch (err) {
    console.error("removeInterestedProject error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.expressInterest = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Check if user already expressed interest
    if (project.interestedUsers.includes(req.user.id)) {
      return res.status(400).json({ message: "Already expressed interest" });
    }

    project.interestedUsers.push(req.user.id);
    await project.save();
    res.json({ message: "Interest expressed successfully" });
  } catch (err) {
    console.error("expressInterest error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (project.createdBy.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });
    Object.assign(project, req.body);
    await project.save();
    const updated = await Project.findById(id).populate(
      "createdBy",
      "name role"
    );
    res.json(updated);
  } catch (err) {
    console.error("updateProject error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(
      `deleteProject request: id=${id} by user=${req.user?.id} role=${req.user?.role}`
    );
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (project.createdBy.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });
    // `remove()` may not exist on the returned object in some mongoose setups;
    // use model-level deletion to be safe.
    await Project.findByIdAndDelete(id);
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("deleteProject error:", err);
    res.status(500).json({ message: "Server error deleting project" });
  }
};
