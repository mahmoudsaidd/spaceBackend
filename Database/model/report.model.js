import { Schema, model, Types } from "mongoose";

const reportSchema = new Schema(
  {

    report: {
        type: String,
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

const reportModel = model("report", reportSchema);
export default reportModel;
