import { userModel } from "../../../../Database/model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../../services/sendEmail.js";
import { asyncHandler } from "../../../services/asyncHandler.js";
import {
  findById,
  findByIdAndUpdate,
  findOne,
  findOneAndUpdate,
} from "../../../../Database/DBMethods.js";
import { nanoid } from "nanoid";

export const signUp = asyncHandler(async (req, res, next) => {
  const { userName, email, password } = req.body;
  const user = await findOne({
    model: userModel,
    condition: { email },
    select: "email",
  });
  if (user) {
    next(new Error("This email already register", { cause: 409 }));
  } else {
    let hashedPassword = bcrypt.hashSync(
      password,
      parseInt(process.env.SALTROUND)
    );
    let addUser = new userModel({
      userName,
      email,
      password: hashedPassword,
    });

    let token = jwt.sign(
      { id: addUser._id, isLoggedIn: true },
      process.env.emailToken,
      { expiresIn: "1h" }
    );
    let refreshToken = jwt.sign(
      { id: addUser._id, isLoggedIn: true },
      process.env.emailToken,
      { expiresIn: 60 * 60 * 24 }
    );
    let link = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/confirmEmail/${token}`;
    let refreshLink = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/refreshToken/${refreshToken}`;
    let message = `Please verify your email <a href="${link}">Here</a>
          <br/>
          
          To refresh Token please click <a href="${refreshLink}">Here</a>
          
          `;

    let emailResult = await sendEmail(email, "Confirm to Register", message);
    if (emailResult.accepted.length) {
      let savedUser = await addUser.save();
      res.status(201).json({ message: "Added Successfully", savedUser });
    } else {
      next(new Error("Invalid Email", { cause: 404 }));
    }
  }
});

export const confirmEmail = asyncHandler(async (req, res, next) => {
  let { token } = req.params;
  let decoded = jwt.verify (token, process.env.emailToken);
   if (!decoded && !decoded.id) {
    next(new Error("Invalid data token", { cause: 400 }));
  } else {
    let updatedUser=await findOneAndUpdate({
      model:userModel,
      condition:{_id:decoded.id,confirmEmail:false},
      data:{confirmEmail:true},
      options:{new:true}
    })
    if(updatedUser){
      next (new Error("Confirmed",{cause:200}))
    }else{
      next(new Error("Invalid token data confirmmm",{cause:400}))
    }
}});

export const refreshToken = async (req, res) => {
  let { token } = req.params;
  let decoded = jwt.verify(token, process.env.emailToken);
  if (!decoded || !decoded.id) {
    res.json({ message: "Invalid Token or ID" });
  } else {
    let user = await userModel.findById(decoded.id);
    if (!user) {
      res.json({ message: "user didn't register" });
    } else {
      if (user.confirmEmail) {
        res.json({ message: "Already confirmed" });
      } else {
        //Create refresh token
        let token = jwt.sign({ id: user._id }, process.env.emailToken);
        let message = `<a href="http://localhost:3000/api/v1/auth/confirmEmail/${token}">This is the second email</a>`;
        sendEmail(user.email, "Refresh Token", message);
        res.json({ message: "Done, please check your email" });
      }
    }
  }
};

export const signIn = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await findOne({ model: userModel, condition: { email } });
  if (!user) {
    next(new Error("you have to register first", { cause: 404 }));
  } else {
    let matched = bcrypt.compareSync(
      password,
      user.password,
      parseInt(process.env.SALTROUND)
    );
    if (matched) {
      if (!user.confirmEmail) {
        next(new Error("you have to confirm email first", { cause: 404 }));
      } else {
        let token = jwt.sign(
          { id: user._id, isLoggedIn: true },
          process.env.tokenSignature,
          { expiresIn: 60 * 60 * 24 * 2 }
        );
        res.status(200).json({ message: "Welcome", token });
      }
    } else {
      next(new Error("Invalid password", { cause: 400 }));
    }
  }
});

export const updateRole = async (req, res, next) => {
  let { userId } = req.body;
  let user = await findById({ model: userModel, id: userId });
  if (!user) {
    next(new Error("Invalid user id", { cause: 404 }));
  } else {
    if (!user.confirmEmail) {
      next(new Error("Please confirm your email first", { cause: 400 }));
    } else {
      let updatedUser = await findByIdAndUpdate({
        model: userModel,
        condition: { _id: user._id },
        data: { role: "Admin" },
        options: { new: true },
      });
      res.status(200).json({ message: "Updated", updatedUser });
      console.log(updatedUser);
    }
  }
};

export const sendCode = async (req, res) => {
  let { email } = req.body;
  let user = await userModel.findOne({ email });
  if (!user) {
    res.json({ message: "User didn't register yet" });
  } else {
    let OTPCode = nanoid();
    console.log(OTPCode);
    await userModel.findByIdAndUpdate(user._id, { OTPCode });
    let message = `your OTPCode is ${OTPCode}`;
    sendEmail(user.email, "your OTP Code", message);
    res.json({ message: "Done, please check your email" });
  }
};

export const forgetPassword = asyncHandler(async (req, res) => {
  let { OTPCode, email, password} = req.body;
  if (!OTPCode) {
    res.json({ message: "Code is not valid" });
  } else {
    let user = await userModel.findOne({ email, OTPCode });
    if (!user) {
      res.json({ message: "Email or code is not valid" });
    } else {
      const hashedPass = await bcrypt.hash(
        password,
        parseInt(process.env.saltRound)
      );
      let updated = await userModel.findByIdAndUpdate(
        user._id,
        { OTPCode: null, password: hashedPass },
        { new: true }
      );
      res.json({ message: "Success", updated });
    }
  }
});





