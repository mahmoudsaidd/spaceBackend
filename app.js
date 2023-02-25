import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import connectDB from './Database/connection.js';
import * as allRoutes from './modules/index.route.js'
const app=express();



app.use(express.json());
 //app.use(`${process.env.baseURL}user`,allRoutes.userRouter)
 app.use(`${process.env.baseURL}auth`,allRoutes.authRouter)
// app.use(`${process.env.baseURL}post`,allRoutes.postRouter)



app.get('*',(req,res)=>{
    res.json({message:"Invalid Api"})
     
})

connectDB()
app.listen(3000,()=>{
    console.log("Server is running");
})