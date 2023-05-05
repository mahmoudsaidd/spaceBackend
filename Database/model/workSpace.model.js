import mongoose from "mongoose";
// kol el composite attributes 3amaltelha schema lwa7daha
// badal ma akhaly el model kolo f schema wa7da 7ases keda a7san w as-hal
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

//  const feedbackSchema = new mongoose.Schema({
//   rate: {
//      type:Number,
//      default:1,
//      required:true,
//      min:[1,"min 1"],
//      max:[5,"max 5"]
//    },
//    comments: [{
//      type: String,
//      required: true,
//    },]
// });

const locationSchema = new mongoose.Schema({
  city: {
    type: String,
    // required: true,
  },
  streetName: {
    type: String,
    // required: true,
  },
  buildingNumber: {
    type: String,
    // required: true,
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

    latitude: {
      type: String,
    },
    longitude: {
      type: String,
    },

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
