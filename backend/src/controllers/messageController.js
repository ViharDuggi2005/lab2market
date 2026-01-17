const Message = require("../models/Message");

exports.sendMessage = async (req, res) => {
  try {
    const { receiver, content } = req.body;
    const message = await Message.create({
      sender: req.user.id,
      receiver,
      content,
    });
    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "name _id")
      .populate("receiver", "name _id");
    res.json(populatedMessage);
  } catch (err) {
    console.error("sendMessage error:", err);
    res.status(500).json({ message: "Server error sending message" });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user.id }, { receiver: req.user.id }],
    })
      .populate("sender", "name _id")
      .populate("receiver", "name _id")
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    console.error("getMessages error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Message.findById(id);
    if (!message) return res.status(404).json({ message: "Message not found" });
    if (message.receiver.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });
    message.read = true;
    await message.save();
    res.json({ message: "Marked as read" });
  } catch (err) {
    console.error("markAsRead error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.expressInterest = async (req, res) => {
  try {
    const { projectId } = req.body;
    // Assuming we can get the project creator (researcher) from projectId
    // For now, we'll need to fetch the project to get the creator
    const Project = require("../models/Project");
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const researcherId = project.createdBy;
    const investorId = req.user.id;

    // Check if a chat already exists between them
    const existingMessage = await Message.findOne({
      $or: [
        { sender: investorId, receiver: researcherId },
        { sender: researcherId, receiver: investorId },
      ],
    });

    if (existingMessage) {
      return res.json({
        message: "Chat already exists",
        researcherId: researcherId.toString(),
      });
    }

    // Create initial message
    const message = await Message.create({
      sender: investorId,
      receiver: researcherId,
      content: `Hi! I'm interested in your project "${project.title}". Let's discuss!`,
    });

    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "name _id")
      .populate("receiver", "name _id");

    res.json({
      message: "Interest expressed successfully",
      chat: populatedMessage,
      researcherId: researcherId.toString(),
    });
  } catch (err) {
    console.error("expressInterest error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
