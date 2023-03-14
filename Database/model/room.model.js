import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  price: {
    type: Number,
    required: true
  },
  number:{
    type: String,
    // required: [true, 'Room number is required']
  },
  isBooked: {
    type: Boolean,
    default: false
  },
  capacity: {
    type: Number,
    // required: true
  },
  type: {
    type: String, // aw momken nekhaliha enums zay desk w room w shared space w keda
    // required: [true, 'Please specify room type']
  },
  roomImages: [{
    type: String,
    // required: true
  }],
  dateCreated: {
    type: Date,
    default: Date.now
},
  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'workingSpace'
  }
});

export const roomModel = mongoose.model('room', roomSchema);

