const mongoose = require("mongoose");

const drawingSchema = new mongoose.Schema({
  room: { type: String, ref: 'Room', required: true },
  data: { type: Object, required: true },  // This stores drawing data (e.g., path, color, etc.)
  timestamp: { type: Date, default: Date.now }
});

const Drawing = mongoose.model("Drawing", drawingSchema);

module.exports = Drawing;
