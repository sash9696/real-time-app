import user from "../models/userModel.js";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
  console.log("reqbody", req.body);

  const { firstname, lastname, email, password } = req.body;

  try {
    //check if the email alredy exists in the mongo db
    const existingUser = await user.findOne({ email: email });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const fullName = `${firstname} ${lastname}`;
    const newUser = new user({ email, password, name: fullName });
    const token = await newUser.generateAuthToken();
    await newUser.save();
    res.json({ message: "success", token: token });
  } catch (error) {
    console.log(`Error in registering user: `, error);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const validUser = await user.findOne({ email: email });
    //if user exists
    if (!validUser) {
      return res.status(404).json({ error: "User does not exist" });
    }
    //if its a valid password
    const validPassword = await bcrypt.compare(password, validUser.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = await validUser.generateAuthToken();
    res.cookie("userToken", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });
    res.status(200).json({ token, status: 200 });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const selectedUser = await user.findOne({ _id: id }).select("-password");
    res.status(200).json(selectedUser);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const logout = async (req, res) => {
  try {
    //clear the user token cookie
    res.clearCookie("userToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    res.status(200).json({
      message: "logged out successfully",
      status: 200,
    });
  } catch (error) {
    console.log("Logout error: ", error);

    res.status(500).json({
      message: "Error during Logout",
      status: 500,
    });
  }
};

export const updateInfo = async (req, res) => {
  const { id } = req.params;
  const { name, bio } = req.body;

  try {
    const updatedUser = await user
      .findByIdAndUpdate(id, { name, bio })
      .select("-password");

    if (!updatedUser) {
      res.status(404).json({
        error: "User not found",
      });
    }

    return res
      .status(200)
      .json({ message: "User info updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};
