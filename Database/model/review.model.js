import { Schema, model, Types } from "mongoose";

const reviewSchema = new Schema(
  {
// <<<<<<< HEAD
//     rating: {
//       type: Number,
//       default: 0,
//       min: [1, "min 1"],
//       max: [5, "max 5"],
//     },
// =======
    rating: {
        type: Number,
        required: [true, 'Please enter a rating'],
        min: 1,
        max: 5, 
        default: 0
      },
      
// >>>>>>> 2ee649f0ff30f0a6899ea75f464b0eb33f9bc14b

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
