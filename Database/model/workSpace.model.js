
import mongoose from "mongoose";
// kol el composite attributes 3amaltelha schema lwa7daha
// badal ma akhaly el model kolo f schema wa7da 7ases keda a7san w as-hal
const scheduleSchema = new mongoose.Schema({
  holidays: {
    type: String, // m4 date 3shan ana 7ktb en el mkan off youm el gom3a msln 
    required: true,
  },
  openingTime: {
    type: Number,
    required: true,
    min:1,
    max:24
  },
  closingTime: {
    type: Number,
    required: true,
    min:1,
    max:24
  },
});

const feedbackSchema = new mongoose.Schema({
  rate: {
    type: Number,
    required: true,
    min:1,
    max:5
  },
  comments: [{
    type: String,
    required: true,
  },]
});

const locationSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
  },
  streetName: {
    type: String,
    required: true,
  },
  buildingNumber: {
    type: String,
    required: true,
  },
});

const contactSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  socialMedia: {
    type: String,
    required: true,
  },
});

const workSpaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
     
    },
    images: {
      type: [String],
      required: [true, "Workspace images are required"],
    },
    publicImageIds: [String],
    schedule: [scheduleSchema],
    feedback: [feedbackSchema],
    contact: contactSchema,
    location: locationSchema,


    dateCreated: {
      type: Date,
      default: Date.now,
    },
    ownerId: 
    { type:mongoose.Schema.ObjectId,
      ref: 'user'},

     

  },
  {
    timestamps: true,
  }
);

export const workSpaceModel = mongoose.model(
  "workSpace",
  workSpaceSchema
);
