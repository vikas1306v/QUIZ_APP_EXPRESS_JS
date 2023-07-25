const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const JWT_SECRET = "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const fetchuser = require("../middlewares/fetchuser.js");

//Route to create  A user(Login Doesnt required)
router.post("/create", async (req, res) => {
  try {
    const { name, email, password, role, user_class } = req.body;
    let user_role = "";
    let user = await User.findOne({ email: email });
    if (user) {
      return res.status(500).json({
        success: false,
        error: "Email Already Taken",
      });
    }
    if (role == undefined || role == "") {
      user_role = "normal_user";
    } else {
      user_role = role;
    }

    const salt = bcrypt.genSaltSync(10);
    const secPassword = await bcrypt.hash(password, salt);
    user = await User.create({
      name: name,
      email: email,
      password: secPassword,
      role: user_role,
      user_class: user_class,
    });
    const Token = jwt.sign({ id: user.id, user_role: user.role }, JWT_SECRET, {
      expiresIn: "24h",
    });
    res.json({
      success: true,
      token: Token,
    });
  } catch (error) {
    return res.status(500).sjon({
      success: false,
      error: "Internal Server Error",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;
    let user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        error: "please try to login with correct credentials",
      });
    }
    const pass = await bcrypt.compare(password, user.password);
    if (!pass) {
      return res.status(400).json({
        error: "please try to login with correct credentials",
      });
    }
    const token = jwt.sign(
      {
        id: user.id,
        user_role: user.role,
      },
      JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );
    res.status(200).json({
      success: true,
      token: token,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

//get All User but we have to get only access to admin to do this
router.get("/getalluser", fetchuser, async (req, res) => {
  const user_role = req.user_role;
  const id = req.id;
  if (user_role === "normal_user") {
    return res.status(400).json({
      status: false,
      error: "Forbidden Unauthrozie Acess ! Denied",
    });
  }
  try {
    const user = await User.find({});
    res.status(200).json({
      succes: true,
      user: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
});

module.exports = router;
