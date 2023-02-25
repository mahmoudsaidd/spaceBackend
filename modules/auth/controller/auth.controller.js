import { userModel } from '../../../Database/model/user.model.js'
import bcryptjs from "bcryptjs";
import jwt from 'jsonwebtoken';
import { nanoid } from "nanoid";

export const signUp =async (req, res) => {
    const { userName, email, password, cPassword } = req.body;
    if (password == cPassword) {
      const foundedUser = await userModel.findOne({ email });
      if (foundedUser) {
        res.json({ message: "you're already register " });
      } else {
          let hashed = await bcryptjs.hash(password, parseInt(process.env.saltRound));
          let user = new userModel({ userName, email, password: hashed })
        let savedUser = await user.save();
        // let token = jwt.sign({ id: savedUser._id }, process.env.JWTKEY, { expiresIn: 60 });
        // let refreshToken = jwt.sign({ id: savedUser._id }, process.env.JWTKEY, { expiresIn: 60* 60 });
        console.log(req);
      }
    } else {
      res.json({ message: "password should match cPassword " });
    }
}


export const signIn = async (req, res) => {
  const { userName, password } = req.body;
  const foundedUser = await userModel.findOne({ userName });
  if (foundedUser) {
    let matched = await bcryptjs.compare(password, foundedUser.password);
    if (matched) {
      if (foundedUser) {
        let token = jwt.sign({ id: foundedUser._id }, process.env.JWTKEY, {
          expiresIn: 60*60*24,
        });
        res.json({ message: "Welcome", foundedUser, token });
      }
    } else {
      res.json({ message: "Password in-correct" });
    }
  } else {
    res.json({ message: "you have to register first or confirm the email" });
  }
};


// export const refreshToken = async(req, res) => {
//     let { token } = req.params
//     let decoded = jwt.verify(token, process.env.JWTKEY);
//     if (!decoded || !decoded.id) {
//       res.json({message:"invalid token or id"})
//     } else {
//       let user = await userModel.findById(decoded.id);
//       if (!user) {
//         res.json({message:"user didn't register"})
//       } else {
//         if (user.confirmEmail) {
//           res.json({message:"already confirmed"})
//         } else {
//             let token = jwt.sign({ id: user._id }, process.env.JWTKEY);
//          let message = `<a href="http://localhost:3000/api/v1/auth/confirmEmail/${token}">this is the second email</a>`;
//          sendToEmail(user.email, message);
//          res.json({ message: "Done please check you email" });
//         }
//       }
//     }
//   }



