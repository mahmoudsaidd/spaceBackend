import { Schema, model, Types } from "mongoose";

const reviewSchema = new Schema(
  {

    rating: {
        type: Number,
        required: [true, 'Please enter a rating'],
        min: 1,
        max: 5, 
        default: 0
      },
      


    createdBy: {
      type: Types.ObjectId,
      ref: "user",
  
    },

    workspace: {
      type: Types.ObjectId,
      ref: "workSpace",
    },
    date: {
      type: Date,
      default: Date.now
    },
  },
  {
    timestamps: true,
  }
);

const reviewModel = model("Review", reviewSchema);
export default reviewModel;
