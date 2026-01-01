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
