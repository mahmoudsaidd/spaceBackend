import mongoose from "mongoose";
// kol el composite attributes 3amaltelha schema lwa7daha
// badal ma akhaly el model kolo f schema wa7da 7ases keda a7san w as-hal
const scheduleSchema = new mongoose.Schema({
  holidays: {
    type: Date,
    required: true
  },
  openingTime: {
    type: Date,
    required: true
  },
  closingTime: {
    type: Date,
    required: true
  }
});

const feedbackSchema = new mongoose.Schema({
  rate: {
    type: Number,
    required: true
  },
  comments: {
    type: String,
    required: true
  }
});

const locationSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true
  },
  streetName: {
    type: String,
    required: true
  },
  buildingNumber: {
    type: String,
    required: true
  }
});

const contactSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  socialMedia: {
    type: String,
    required: true
  }
});

const workingSpaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description:{
    type: String,
    required: true
  },
  images: {
    type: [String],
    required: [true, "Workspace images are required"],
  },
  publicImageIds: [String],
  schedule: [scheduleSchema],
  feedback: [feedbackSchema],
  contact: contactSchema,

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',  //3ayzeen lesa ne3mel validation eno lazem yekon owner
    required: true
  },
  location: locationSchema
}, {
    timestamps: true,
  });

 export const workingSpaceModel = mongoose.model('workingSpace', workingSpaceSchema);
