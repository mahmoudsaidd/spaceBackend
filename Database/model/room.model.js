import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  price: {
    type: Number,
    required: true
  },
  isBooked: {
    type: Boolean,
    default: false
  },
  capacity: {
    type: Number,
    required: true
  },
  type: {
    type: String, // aw momken nekhaliha enums zay desk w room w shared space w keda
    required: true
  },
  roomImages: [{
    type: String,
    required: true
  }],
  workingSpace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'workingSpace'
  }
});

export const room = mongoose.model('room', roomSchema);

