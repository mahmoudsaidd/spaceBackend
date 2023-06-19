import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cors from 'cors'

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "./config/.env") });

import express from "express";
import { globalError } from "./src/services/asyncHandler.js";
import * as indexRouter from "./src/modules/index.router.js";
import connection from "./Database/connection.js";
import morgan from "morgan";


//Express
const app = express();

const port =process.env.PORT
const baseUrl = process.env.BASEURL;


app.use(express.json());
app.use(cors({}))
app.use(morgan("common"));


// if(process.env.ENV ==="DEV"){
//   app.use(morgan('dev'))
// }else{
//   app.use(morgan('common'))
// }



//setUp API Routing
app.get('/',(req,res)=>{
  res.send("<h1> Home Page </h1>")
})


app.use(`${baseUrl}/user`, indexRouter.userRouter);
app.use(`${baseUrl}/auth`, indexRouter.authRouter);
app.use(`${baseUrl}/workingSpace`, indexRouter.workingSpaceRouter);
app.use(`${baseUrl}/room`, indexRouter.roomRouter);
app.use(`${baseUrl}/booking`, indexRouter.bookingRouter);
app.use(`${baseUrl}/favorite`, indexRouter.favoriteRouter);

app.use("*", (req, res) => {
  res.send("In-valid Routing Plz check url  or  method");
});

app.use(globalError);

connection();

app.listen(port, () =>  console.log(`Server is running on port ${port}`));
