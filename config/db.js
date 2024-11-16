const mongoose = require("mongoose");

/**
 * Connects to the MongoDB database using Mongoose.
 * Retrieves the database URI from environment variables.
 */
const connectDB = async () => {
  try {
    const dbURI = process.env.MONGODB_URI;
    if (!dbURI) {
      throw new Error("MONGODB_URI not found in environment variables.");
    }

    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB connected successfully.");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message);
    process.exit(1); // Exit process with failure
  }
};

/**
 * Disconnects from the MongoDB database.
 * Useful for graceful shutdowns or testing environments.
 */
const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log("✅ MongoDB disconnected successfully.");
  } catch (error) {
    console.error("❌ Error disconnecting MongoDB:", error.message);
  }
};

module.exports = { connectDB, disconnectDB };
