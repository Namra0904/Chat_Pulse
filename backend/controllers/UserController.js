import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import expressAsyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import { request } from "express";

class UserController {
  // User SignUp Function

  static userSignUp = expressAsyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Please Enter all the Fields.");
    }

    const userExists = await User.findOne({ email: email });

    if (userExists) {
      res.status(400);
      throw new Error("User already exits!");
    }

    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashpassword,
      pic,
    });

    if (user) {
      await user.save();

      const saved_user = await User.findOne({ email: email });
      const token = jwt.sign(
        { userId: saved_user._id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1d" }
      );
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: token,
      });
    } else {
      res.status(400);
      throw new Error("User not Found.");
    }
  });

  // User Login Function

  static userLogin = expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("All Fields Required!");
    }

    const user = await User.findOne({ email: email });

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (user.email === email && isMatch) {
        const token = jwt.sign(
          { userID: user._id },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "1d" }
        );
        res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          pic: user.pic,
          token: token,
        });
      } else {
        res.status(400);
        throw new Error("Invalid Credantials");
      }
    } else {
      res.status(400);
      throw new Error("User is not signUp!");
    }
  });

  // All User Function

  static allUser = expressAsyncHandler(async (req, res) => {

        const keyword = req.query.search ? {
            $or: [{ name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } }
            ]
        } : {};

        const users = await User.find(keyword).find({ _id: { $ne: req.user._id } })
       res.send(users)
        
    });
};

export default UserController