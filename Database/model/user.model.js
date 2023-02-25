import mongoose from "mongoose";

const userSchema= new mongoose.Schema(
    {
        userName: {
            type: String,
            required: [true, "userName is required"],
            min: [2, "minimum length 2 char"],
            max: [20, "max length 2 char"],
            unique: [true, "userName must be unique value"]
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


          phone: String,

          role: {
            type: String,
            default: "User",
            enum: ["User", "Admin", "Owner"],
          },


          isConfirmed: {
            type: Boolean,
            default: false
          },


          gender: {
            type: String,
            enum: ["Male", "Female"]
          },


          profilePic: String,
          
          age: Date
        },
          {
            timestamps: true,
          }

    
);


export const userModel = mongoose.model("user", userSchema);