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
      .populate("sender", "name")
      .populate("receiver", "name");
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
      .populate("sender", "name")
      .populate("receiver", "name")
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
