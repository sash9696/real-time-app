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
    // Explicitly set bio and profilePic to ensure they're not mixed up
    const newUser = new user({ 
      email, 
      password, 
      name: fullName,
      bio: 'Available', // Explicit default for bio
      profilePic: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" // Explicit default for profilePic
    });
    const token = await newUser.generateAuthToken();
    await newUser.save();
    res.json({ message: "success", token: token });
  } catch (error) {
    console.log(`Error in registering user: `, error);
    res.status(500).json({ error: "Internal server error" });
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
  const { name, bio, profilePic } = req.body;

  try {
    // Build update object only with provided fields
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (bio !== undefined) {
      // Prevent profilePic URL from being saved to bio
      if (bio && bio.includes('icon-library.com') && bio.includes('anonymous-avatar')) {
        console.warn('Attempted to save profilePic URL to bio field, ignoring');
        // Don't update bio if it looks like a profilePic URL
      } else {
        updateData.bio = bio;
      }
    }
    if (profilePic !== undefined) updateData.profilePic = profilePic;

    const updatedUser = await user
      .findByIdAndUpdate(id, updateData, { new: true })
      .select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    return res
      .status(200)
      .json({ message: "User info updated successfully", user: updatedUser });
  } catch (error) {
    console.log('Update info error:', error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const validUser = async (req, res) => {
  try {
    const validUser = await user
      .findOne({ _id: req.rootUserId })
      .select("-password");
    
    console.log('validUser controller - User ID from req:', req.rootUserId);
    console.log('validUser controller - User found:', validUser?.email, validUser?.name);

    if (!validUser) {
      return res.status(401).json({ error: "User is not valid" });
    }

    res.status(200).json({
      user: validUser,
      token: req.token,
    });
  } catch (error) {
    console.log("validUser error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const searchUsers = async (req, res) => {
  try {
    // $or is a mongo db operator that matches if at least one condition is true
    // $regex pattern matching similar LIKE in SQL, can perform partial or flexible text searches here
    // {name: {$regex: 'john}} would match john, johnny, john.doe
    // its case sensitive by default
    // $options: 'i' means case - insensitive
    // would match john, johnny, john.doe, JOHN, JoHnny
    // 'm' => multiline matching
    // 'x' => ignore whitespaces in regex

    const keyword = req.query.search ? {
      $or: [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
      ]
    } : {};

    const users = await user.find({
      ...keyword,
      _id: { $ne: req.rootUserId }
    }).select('-password');

    return res.status(200).json({ users });
  } catch (error) {
    console.log('Search error: ', error);
    return res.status(500).json({ error });
  }
};
