const User = require("../models/user");
const Drawing = require("../models/drawings");
let drawingDataBatch = []; // Array to accumulate drawing data
const BATCH_TIME = 300; // Set the time interval (in milliseconds) for batching
const MAX_BATCH_SIZE = 1000; // Set the maximum number of drawings to save in one batch


// Join user to chat
const userJoin = async (id, username, room, host, presenter) => {
  try {
    // Check if the user is already in the room
    const existingUser = await User.findOne({ userId: id, room });
    if (existingUser) {
      throw new Error(`User with ID ${id} is already in the room ${room}`);
    }

    // Create a new user if not already in the room
    const user = new User({ userId: id, username, room, host, presenter });
    await user.save();
    return user;
  } catch (error) {
    console.error("Error joining user:", error.message);
    throw new Error(error.message || "Error joining user");
  }
};

// User leaves chat
const userLeave = async (id) => {
  try {
    const user = await User.findOneAndDelete({ userId: id });
    return user;
  } catch (error) {
    console.error("Error leaving user:", error.message);
    throw new Error("Error leaving user");
  }
};

// Get user by ID
const getUserById = async (userId) => {
  try {
    const user = await User.findOne({ id: userId });
    return user;
  } catch (error) {
    console.error("Error fetching user:", error.message);
    throw new Error("Error fetching user");
  }
};

// Get all users in a room
const getUsers = async (roomId) => {
  try {
    const users = await User.find({ room: roomId });
    return users;
  } catch (error) {
    console.error("Error fetching users:", error.message);
    throw new Error("Error fetching users");
  }
};

// Add a drawing to a specific room
const addDrawing = async (roomId, drawingData) => {
  try {
    const drawing = new Drawing({ room: roomId, data: drawingData });
    await drawing.save();
  } catch (error) {
    console.error("Error adding drawing:", error.message);
    throw new Error("Error adding drawing");
  }
};

// Get all drawings for a specific room
const getDrawings = async (roomId) => {
  try {
    const drawings = await Drawing.find({ room: roomId });
    return drawings;
  } catch (error) {
    console.error("Error fetching drawings:", error.message);
    throw new Error("Error fetching drawings");
  }
};

// Clear drawings for a room (optional: in case of reset or new session)
const clearDrawings = async (roomId) => {
  try {
    await Drawing.deleteMany({ room: roomId });
  } catch (error) {
    console.error("Error clearing drawings:", error.message);
    throw new Error("Error clearing drawings");
  }
};
// Function to add drawing data
const addDrawings = async (roomId, drawingData) => {
  try {
    // Add drawing data to the batch
    drawingDataBatch.push(drawingData);

    // If the batch size exceeds MAX_BATCH_SIZE, save the batch to the DB
    if (drawingDataBatch.length >= MAX_BATCH_SIZE) {
      await saveDrawingsToDB(roomId, drawingDataBatch);
      drawingDataBatch = []; // Clear the batch after saving
    }

    // Throttle the saving of drawings at regular intervals
    setTimeout(async () => {
      if (drawingDataBatch.length > 0) {
        await saveDrawingsToDB(roomId, drawingDataBatch);
        drawingDataBatch = []; // Clear the batch after saving
      }
    }, BATCH_TIME);
  } catch (error) {
    console.error("Error adding drawing:", error.message);
    throw new Error("Error adding drawing");
  }
};

// Function to save the drawings to the database
const saveDrawingsToDB = async (roomId, drawingsBatch) => {
  try {
    // Create a new Drawing document with the room ID and accumulated drawing data
    const drawing = new Drawing({ room: roomId, data: drawingsBatch });
    await drawing.save();
    console.log(`Successfully saved drawing batch for room ${roomId}`);
  } catch (error) {
    console.error("Error saving drawing batch:", error.message);
  }
};

module.exports = {
  userJoin,
  userLeave,
  getUserById,
  getUsers,
  addDrawing,
  getDrawings,
  clearDrawings,
  addDrawings
};
