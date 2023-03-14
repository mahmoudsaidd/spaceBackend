import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  // price: { type: Number, required: true },
  // workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'workingSpace' },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'room', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user',
  //  required: true 
  },
  bookingStart: {type: Date, required: true},
  bookingEnd:{type: Date, required: true},
  // startHour:Number,
  // endHour:Number,
  // duration:Number,
  // recurring: [],


  fees: { type: Number },
  promoCode: { type: String },
  dateCreated: {
    type: Date,
    default: Date.now
}
},{
  timestamps: true
});

 export const bookingModel = mongoose.model('booking', bookingSchema);

