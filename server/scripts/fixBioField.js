// Script to fix users where profilePic URL was incorrectly saved to bio field
import mongoose from "mongoose";
import userModel from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

const fixBioField = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Find all users where bio contains the profilePic URL
    const profilePicUrl = "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";
    
    const usersWithWrongBio = await userModel.find({
      bio: profilePicUrl
    });

    console.log(`Found ${usersWithWrongBio.length} users with profilePic URL in bio field`);

    // Fix each user
    for (const user of usersWithWrongBio) {
      // Set bio to default 'Available' and ensure profilePic is set correctly
      await userModel.findByIdAndUpdate(user._id, {
        bio: 'Available',
        profilePic: profilePicUrl
      });
      console.log(`Fixed user: ${user.email}`);
    }

    console.log("Fix completed!");
    await mongoose.disconnect();
  } catch (error) {
    console.error("Error fixing bio field:", error);
    process.exit(1);
  }
};

fixBioField();

