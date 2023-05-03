import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // firstName: {
    //   type: String,
    //   required: true,
    // },
    // lastName: {
    //   type: String,
    //   required: true,
    // }, 
    userName: {
      type: String,
      required: [true, "userName is required"],
      min: [2, "minimum length 2 char"],
      max: [20, "max length 2 char"],
      unique: [true, "userName must be unique value"],
    },
   

    email: {
      type: String,
      unique: [true, "email must be unique value"],
      required: [true, "userName is required"],
    },

    password: {
      type: String,
      required: [true, "password is required"],
    },

    phone: Number,

    role: {
      type: String,
      default: "User",
      enum: ["User", "Admin", "Owner"],
    },

    gender: {
      type: String,
      enum: ["Male", "Female"],
    },

    profilePic: String,
    publicImageId: String,

    City:String,
    StreetName:String,
    BuildingNumber:String,
    age: Date,
    OTPCode:String,
    confirmEmail: {
      type: Boolean,
      default: false,
    },
    
    //Accept or Refuse
    adminValidation:{
      type:Boolean,
      default:false
    },

    favorites: [
      {
        type:mongoose.Schema.ObjectId,
        ref: "workSpace",
      },
    ],


  
    
  },
  {
    timestamps: true,
  }
);

export const userModel = mongoose.model("user", userSchema);
