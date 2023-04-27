import { Schema, model, Types } from "mongoose";

const reviewSchema = new Schema(
  {
    rating: {
      type: Number,
      default: 0,
      min: [1, "min 1"],
      max: [5, "max 5"],
    },

    // comments: [
    //   {
    //     type: String,
    //   },
    // ],

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
