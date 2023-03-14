import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  // price: { type: Number, required: true },
  
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'room', required: true },
  duration: { type: Number, required: true }, //3ayzeen neshof data type aw function lel duration gher number de
  // time: { type: Date, required: true },
  startTime: {type: Date, required: true},
  endTime:{type: Date, required: true},
  fees: { type: Number },
  promoCode: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  dateCreated: {
    type: Date,
    default: Date.now
}
});

 export const bookingModel = mongoose.model('booking', bookingSchema);

