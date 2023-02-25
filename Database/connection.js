import mongoose from 'mongoose'
const connectDB  = async ()=>{
    return await mongoose.connect(process.env.DBCONNECTION)
    .then(res=>console.log(`DB Connected successfully on .........${process.env.DBCONNECTION} `))
    .catch(err=>console.log(` Fail to connect  DB.........${err} `))
}


export default connectDB;