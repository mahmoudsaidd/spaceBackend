import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  price: {
    type: Number,
    required: true,
    min:0
  },
  roomNumber:{
    type: String,
  },
  roomName:{
    type:String,
  },
  capacity: {
    type: Number,
    min:1
    // required: true
  },
  
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

  
  type: {
    type: String, 
    required: [true, 'Please specify room type']
  },

  roomImages: {
    type: [String],
    required: [true, "Rooms' images are required"],
  },
  publicImageIds: [String],

  dateCreated: {
    type: Date,
    default: Date.now
},
  workspaceId: {
  type:mongoose.Schema.ObjectId,
  ref:'workSpace'
  }
});

export const roomModel = mongoose.model('room', roomSchema);

