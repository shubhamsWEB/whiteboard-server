const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  room: { type: String, ref: 'Room', required: true },
  userId: { type: String, required: true },
  host: { type: Boolean, default: false },
  presenter: { type: Boolean, default: false }
});

// Adding compound index to ensure unique combination of userId and room
userSchema.index({ userId: 1, room: 1 }, { unique: true });



const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
