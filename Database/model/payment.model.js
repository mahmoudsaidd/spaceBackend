import mongoose from "mongoose";

const paymentSchema= new mongoose.Schema({
    
    
     mehod: {type: String,

    enum:["online", "on premises"],
    required: true

}, bookingID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'booking',
    required: true

}}

)