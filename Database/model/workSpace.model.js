import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
  holidays: [
    {
      type: String,
      required: true,
      enum: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
    },
  ],
  openingTime: {
    type: String,
    required: true,
    match: /^([01]\d|2[0-3]):([0-5]\d)$/, // regex to match HH:MM format
  },
  closingTime: {
    type: String,
    required: true,
    match: /^([01]\d|2[0-3]):([0-5]\d)$/, // regex to match HH:MM format
  },
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
  region:{
    type: String,
    required: true,
  },
  latitude: {
    type: String,
  },
  longitude: {
    type: String,
  },
});

const contactSchema = new mongoose.Schema({
  phone: [
    {
      type: Number,
      required: true,
    },
  ],
  email: [
    {
      type: String,
    },
  ],
  socialMedia: [
    {
      type: String,
    },
  ],
});

const workSpaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: { type: String },
    images: {
      type: [String],
      required: [true, "Workspace images are required"],
    },
    publicImageIds: [String],
    schedule: scheduleSchema,
    avgRate: Number,

    contact: contactSchema,
    location: locationSchema,


    dateCreated: {
      type: Date,
      default: Date.now,
    },
    ownerId: { type: mongoose.Schema.ObjectId, ref: "user" },
  },
  {
    timestamps: true,
  }
);

export const workSpaceModel = mongoose.model("workSpace", workSpaceSchema);
