// controllers/userController.js

const User = require("../models/User"); // Import the User model

// Controller function to get the count of online users
const getOnlineUsersCount = async (req, res) => {
  try {
    // Retrieve the count of users from the User collection
    const userCount = await User.countDocuments();

    // Return the count of users
    res.status(200).json({ count: userCount });
  } catch (error) {
    console.error("Error fetching user count:", error.message);
    res.status(500).json({ message: "Server error while fetching user count." });
  }
};

module.exports = { getOnlineUsersCount };
