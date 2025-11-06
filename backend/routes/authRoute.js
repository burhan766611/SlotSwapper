import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password) {
      return res.status(400).json({ result: false, msg: "Enter Details" });
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.json({
        result: false,
        msg: "User Already Exits",
      });
    }

    const hashPassword = await bcrypt.hash(password, 12);
    console.log("Hash Password", hashPassword);

    const user = await User.create({
      username: username,
      email: email,
      password: hashPassword,
    });


    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.SECRET_KEY
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1 * 60 * 60 * 1000,
    });


    return res.status(201).json({
      result: true,
      msg: "signup Successfully",
    });
  } catch {
    res.status(500).json({
      result: false,
      msg: "Server Error",
    });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        result: false,
        msg: "Enter Credentials",
      });
    }

    const userExist = await User.findOne({ email });

    if (!userExist) {
      return res.json({
        result: false,
        msg: "User Not Found",
      });
    }

    const hashresult = await bcrypt.compare(password, userExist.password);

    if (!hashresult) {
      return res.json({
        result: false,
        msg: "Invalid Credentials",
      });
    }

    const token = jwt.sign(
      {
        id: userExist._id,
        email: email,
      },
      process.env.SECRET_KEY
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      msg: "Logged in Successfully",
      user: userExist,
      result: true,
    });
  } catch {
    return res.status(500).json({
      result: false,
      msg: "Server Error",
    });
  }
});

router.post("/logout", async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
    });
    res.status(200).json({
      result: true,
      msg: "Logged out successfully",
    });
  } catch (err) {
    console.error("Error logging out:", err);
    return res.status(500).json({
      result: false,
      msg: "Server error during logout",
    });
  }
});

export default router;
