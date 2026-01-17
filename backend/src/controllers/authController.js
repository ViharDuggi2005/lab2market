const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    institution,
    googleScholar,
    scopusLink,
    phoneNumber,
  } = req.body;
  if (!name || !email || !password || !role) {
    return res
      .status(400)
      .json({ message: "All required fields must be provided" });
  }
  if ((role === "researcher" || role === "investor") && !institution) {
    return res.status(400).json({
      message: "Institution is required for researchers and investors",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
    institution,
    googleScholar,
    scopusLink,
    phoneNumber,
  });

  res.json(user);
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token, role: user.role, name: user.name });
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, institution, googleScholar, scopusLink, phoneNumber } =
      req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    // institution is optional but may be required depending on role elsewhere
    if (typeof institution !== "undefined") user.institution = institution;
    if (typeof googleScholar !== "undefined")
      user.googleScholar = googleScholar;
    if (typeof scopusLink !== "undefined") user.scopusLink = scopusLink;
    if (typeof phoneNumber !== "undefined") user.phoneNumber = phoneNumber;

    await user.save();

    res.json({
      name: user.name,
      institution: user.institution,
      googleScholar: user.googleScholar,
      scopusLink: user.scopusLink,
      phoneNumber: user.phoneNumber,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select(
      "name institution role email googleScholar scopusLink phoneNumber"
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      name: user.name,
      institution: user.institution,
      role: user.role,
      email: user.email,
      googleScholar: user.googleScholar,
      scopusLink: user.scopusLink,
      phoneNumber: user.phoneNumber,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
