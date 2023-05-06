import { userModel } from "../../../../Database/model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../../services/sendEmail.js";
import { asyncHandler } from "../../../services/asyncHandler.js";
import {
  find,
  findById,
  findByIdAndUpdate,
  findOne,
  findOneAndUpdate,
} from "../../../../Database/DBMethods.js";
import { nanoid } from "nanoid";
import { bookingModel } from "../../../../Database/model/booking.model.js";

// signUp api
// HTTP method: POST
// inputs from body:userName, email, password
export const signUp = asyncHandler(async (req, res, next) => {
  const { userName, email, password } = req.body;
  const user = await findOne({
    model: userModel,
    condition: { email },
    select: "email",
  });
  if (user) {
    return next(new Error("This email already register", { cause: 409 }));
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
      return res.status(201).json({ message: "Added Successfully", savedUser });
    } else {
      return next(new Error("Invalid Email", { cause: 404 }));
    }
  }
});

// confirmEmail api
// HTTP method: Get
// inputs from params :Token
export const confirmEmail = asyncHandler(async (req, res, next) => {
  let { token } = req.params;
  let decoded = jwt.verify(token, process.env.emailToken);
  if (!decoded && !decoded.id) {
    return next(new Error("Invalid data token", { cause: 401 }));
  } else {
    let updatedUser = await findOneAndUpdate({
      model: userModel,
      condition: { _id: decoded.id, confirmEmail: false },
      data: { confirmEmail: true },
      options: { new: true },
    });
    if (updatedUser) {
      return res.status(200).json({ message: "Confirmed" });
    } else {
      return next(new Error("Invalid token data confirm", { cause: 401 }));
    }
  }
});

// refreshToken api
// HTTP method: Get
// inputs from params :Token
export const refreshToken = async (req, res) => {
  let { token } = req.params;
  let decoded = jwt.verify(token, process.env.emailToken);
  if (!decoded || !decoded.id) {
    return res.json({ message: "Invalid Token or ID" });
  } else {
    let user = await userModel.findById(decoded.id);
    if (!user) {
      return res.json({ message: "user didn't register" });
    } else {
      if (user.confirmEmail) {
        return res.json({ message: "Already confirmed" });
      } else {
        //Create refresh token
        let token = jwt.sign({ id: user._id }, process.env.emailToken);
        let message = `<a href="http://localhost:3000/api/v1/auth/confirmEmail/${token}">This is the second email</a>`;
        sendEmail(user.email, "Refresh Token", message);
        return res
          .status(200)
          .json({ message: "Done, please check your email" });
      }
    }
  }
};

// signIn api
// HTTP method: POST
// inputs from body:email, password
export const signIn = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await findOne({ model: userModel, condition: { email } });
  if (!user) {
    return next(new Error("you have to register first", { cause: 400 }));
  } else {
    let matched = bcrypt.compareSync(
      password,
      user.password,
      parseInt(process.env.SALTROUND)
    );
    if (matched) {
      if (!user.confirmEmail) {
        return next(
          new Error("you have to confirm email first", { cause: 401 })
        );
      } else {
        let token = jwt.sign(
          { id: user._id, isLoggedIn: true },
          process.env.tokenSignature,
          { expiresIn: 60 * 60 * 24 * 2 }
        );
        return res.status(200).json({ message: "Welcome", token });
      }
    } else {
      return next(new Error("Invalid password", { cause: 400 }));
    }
  }
});

// updateRole api
// HTTP method: PUT
// inputs from body:userId
//if admin want to update someone to be an admin as him
export const updateRole = async (req, res, next) => {
  let { userId } = req.body;
  let user = await findById({ model: userModel, id: userId });
  if (!user) {
    return next(new Error("Invalid user id", { cause: 404 }));
  } else {
    if (!user.confirmEmail) {
      return next(new Error("Please confirm your email first", { cause: 401 }));
    } else {
      let updatedUser = await findByIdAndUpdate({
        model: userModel,
        condition: { _id: user._id },
        data: { role: "Admin" },
        options: { new: true },
      });
      return res.status(200).json({ message: "Updated", updatedUser });
    }
  }
};

// sendCode api
// HTTP method: POST
// inputs from body:email
export const sendCode = async (req, res) => {
  let { email } = req.body;
  let user = await userModel.findOne({ email });
  if (!user) {
    return res.json({ message: "User didn't register yet" });
  } else {
    let OTPCode = nanoid();
    await userModel.findByIdAndUpdate(user._id, { OTPCode });
    let message = `your OTPCode is ${OTPCode}`;
    sendEmail(user.email, "your OTP Code", message);
    return res.status(200).json({ message: "Done, please check your email" });
  }
};

// forgetPassword api
// HTTP method: POST
// inputs from body: OTPCode, email, password
export const forgetPassword = asyncHandler(async (req, res) => {
  let { OTPCode, email, password } = req.body;
  if (!OTPCode) {
    return res.json({ message: "Code is not valid" });
  } else {
    let user = await userModel.findOne({ email, OTPCode });
    if (!user) {
      return res.json({ message: "Email or code is not valid" });
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
      return res.status(200).json({ message: "Success", updated });
    }
  }
});
