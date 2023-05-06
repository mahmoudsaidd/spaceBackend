import mongoose from "mongoose";

const connection=async()=>{
    return await mongoose.connect(process.env.DBCONNECTION)
    .then(()=>{
        ;console.log(`Database Connected on ${process.env.DBCONNECTION}`);
    }).catch(()=>{
        console.log("Database Error");
    })

}


export default connection;