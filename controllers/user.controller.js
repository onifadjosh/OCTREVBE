const UserModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

const signUp = async (req, res, next) => {
  const { firstName, lastName, email, password, profilePicture } = req.body;
  console.log(req.body);
  try {
    let saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const hashedPassword = await bcrypt.hash(password, salt);

    const image = await cloudinary.uploader.upload(
      profilePicture,
      { resource_type: "image" },
      (err, result) => {
        if (err) {
          console.log(err);
          next();
        } else {
          // console.log(result)
          return result;
        }
      }
    );
    const user = await UserModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      profilePicture: image.secure_url,
    });

    console.log(user);
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      status: true,
      message: "user created successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    if (error.code == "11000") {
      res.status(400).json({
        status: false,
        message: "user already exist",
      });
    } else {
      res.status(404).json({
        status: false,
        message: "user cannot be created at this time",
      });
    }
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await UserModel.findOne({ email }).select("+password");
    console.log(user);
    if (!user) {
      res.json({
        status: false,
        message: "Invalid credentials!",
      });
    } else {
      let isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        res.json({
          status: false,
          message: "Invalid credentials!",
        });
      } else {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
        res.json({
          status: true,
          message: "user can login",
          user: {
            id: user._id,
            email: user.email,
            fullname: user.firstName + " " + user.lastName,
          },
          token,
        });
      }
    }
  } catch (error) {
    console.log(error);

    res.json({
      status: false,
      message: "Invalid credentials!",
    });
  }
};

const verify = async (req, res, next) => {
  try {
    const token = req.headers["authorization"].split(" ")[1]
      ? req.headers["authorization"].split(" ")[1]
      : req.headers["authorization"].split(" ")[0];

    console.log(token);

    const user = jwt.verify(
      token,
      process.env.JWT_SECRET,
      function (err, decoded) {
        if (err) {
          res.send({
            status: false,
            message: "User Unauthorized!",
          });
        } else {
          console.log(decoded.id);
          req.userId = decoded.id;
          next();
        }
      }
    );

    console.log(user, "this is user");
  } catch (error) {
    console.log(error);
    res.send({
      status: false,
      message: "User Unauthorized!",
    });
  }
};

const getUser = async (req, res) => {
  const { id } = req.params;
  console.log("from the verify", req.userId);

  try {
    let user = await UserModel.findById({ _id: id });
    if (user) {
      res.send({
        status: true,
        user,
      });
    }
  } catch (error) {
    console.log(error);
    res.send({
      status: false,
      message: "user fetch failed",
    });
  }
};

module.exports = {
  signUp,
  login,
  verify,
  getUser,
};
