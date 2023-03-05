import mongoose from "mongoose";

const paymentSchema= new mongoose.Schema({
    
    
     method: {type: String,

    enum:["online", "on premises"],
    required: true

}, bookingID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'booking',
    required: true

}}

)


export const paymentModel = mongoose.model('payment', paymentSchema);
