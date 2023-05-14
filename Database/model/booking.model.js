import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    price: { type: Number, required: true },

    room: { type: mongoose.Schema.Types.ObjectId, ref: "room", required: true },
    duration: { type: Number, required: true }, 

    startTime: { type: Date },
    endTime: { type: Date },

    fees: { type: Number },
    promoCode: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    dateCreated: {
      type: Date,
      default: Date.now,
    },
    isCancelled: {type: Boolean, default: false},
    isDone:{type: Boolean, default: false},
    isUpcoming:{type: Boolean, default: true},
    isMissed:{type: Boolean, default: false}
  },
  {
    timestamps: true,
  }
);

export const bookingModel = mongoose.model("booking", bookingSchema);
