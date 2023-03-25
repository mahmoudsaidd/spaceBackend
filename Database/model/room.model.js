import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  price: {
    type: Number,
    required: true
  },
  roomNumber:{
    type: String,
    // required: [true, 'Room number is required']
  },
  isBooked: {
    type: Boolean,
    default: false
  },
  capacity: {
    type: Number,
    // required: true
  },
  Amenities:{
    //Equipments
    scanner:{type:Boolean,default:false},
    microphone:{type:Boolean,default:false},
    printer:{type:Boolean,default:false},
    smartTv:{type:Boolean,default:false},
    computer:{type:Boolean,default:false},
    monitor:{type:Boolean,default:false},
    projectors:{type:Boolean,default:false},
    //services
    wifi:{type:Boolean,default:false},
    heating:{type:Boolean,default:false},
    airConditioning:{type:Boolean,default:false},
    //seating
    desk:{type:Boolean,default:false},
    chairs:{type:Boolean,default:false},

  },
  type: {
    type: String, // aw momken nekhaliha enums zay desk w room w shared space w keda
    // required: [true, 'Please specify room type']
  },
  roomImages: [{
    type: String,
    // required: true
  }],
  dateCreated: {
    type: Date,
    default: Date.now
},
  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'workingSpace'
  }
});

export const roomModel = mongoose.model('room', roomSchema);

