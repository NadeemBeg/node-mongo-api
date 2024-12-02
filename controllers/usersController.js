const { v4: uuidv4 } = require("uuid");
const User = require("../models/User");

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  const { userId } = req.params;

  if (!uuidv4.validate(userId)) {
    return res.status(400).json({ message: "Invalid User ID format" });
  }

  try {
    const user = await User.findOne({ id: userId });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Create new user
exports.createUser = async (req, res) => {
  const { username, age, hobbies } = req.body;

  if (!username || typeof age !== "number" || !Array.isArray(hobbies)) {
    return res.status(400).json({ message: "Invalid request body" });
  }

  const newUser = new User({
    id: uuidv4(),
    username,
    age,
    hobbies,
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update user by ID
exports.updateUserById = async (req, res) => {
  const { userId } = req.params;
  const { username, age, hobbies } = req.body;

  if (!uuidv4.validate(userId)) {
    return res.status(400).json({ message: "Invalid User ID format" });
  }

  try {
    const user = await User.findOne({ id: userId });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.username = username || user.username;
    user.age = typeof age === "number" ? age : user.age;
    user.hobbies = Array.isArray(hobbies) ? hobbies : user.hobbies;

    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete user by ID
exports.deleteUserById = async (req, res) => {
  const { userId } = req.params;

  if (!uuidv4.validate(userId)) {
    return res.status(400).json({ message: "Invalid User ID format" });
  }

  try {
    const user = await User.findOneAndDelete({ id: userId });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
