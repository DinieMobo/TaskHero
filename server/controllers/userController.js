import asyncHandler from "express-async-handler";
import Notice from "../models/notice.js";
import User from "../models/userModel.js";
import createJWT from "../utils/index.js";
import generateOTP from "../utils/generateOTP.js";
import passwordResetTemplate from "../utils/passwordResetTemplate.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";

// Login controller
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res
      .status(401)
      .json({ status: false, message: "Invalid email or password." });
  }

  if (!user?.isActive) {
    return res.status(401).json({
      status: false,
      message: "User account has been deactivated, contact the administrator",
    });
  }

  const isMatch = await user.matchPassword(password);

  if (user && isMatch) {
    const token = createJWT(res, user._id);

    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      role: user.role,
      title: user.title,
      isActive: user.isActive,
    };

    res.status(200).json({
      status: true,
      user: userData,
      token,
    });
  } else {
    return res
      .status(401)
      .json({ status: false, message: "Invalid email or password" });
  }
});

// Signup controller
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, isAdmin, role, title } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res
      .status(400)
      .json({ status: false, message: "Email address already exists" });
  }

  const user = await User.create({
    name,
    email,
    password,
    isAdmin,
    role,
    title,
  });

  if (user) {
    isAdmin ? createJWT(res, user._id) : null;

    user.password = undefined;

    res.status(201).json({
      status: true,
      message: "User registered successfully",
      user
    });
  } else {
    return res
      .status(400)
      .json({ status: false, message: "Invalid user data" });
  }
});

// Logout controller
const logoutUser = (_req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/", // Make sure to specify the same path as when setting
  });
  res.status(200).json({ status: true, message: "Logged out successfully" });
};

// @GET -   Get user profile
// const getUserProfile = asyncHandler(async (req, res) => {
//   const { userId } = req.user;

//   const user = await User.findById(userId);

//   user.password = undefined;

//   if (user) {
//     res.json({ ...user });
//   } else {
//     res.status(404);
//     throw new Error("User not found");
//   }
// });

const getTeamList = asyncHandler(async (req, res) => {
  const { search } = req.query;
  let query = {};

  if (search) {
    const searchQuery = {
      $or: [
        { title: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
        { role: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    };
    query = { ...query, ...searchQuery };
  }

  const user = await User.find(query).select("name title role email isActive");

  res.status(201).json(user);
});

// Get Notifications List
const getNotificationsList = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const notice = await Notice.find({
    isRead: { $nin: [userId] },
  })
    .populate({
      path: "task", 
      match: { team: { $in: [userId] } },
      select: "title team"
    })
    .sort({ _id: -1 })
    .then(notices => {
      return notices.filter(notice => notice.task);
    });

  res.status(200).json(notice);
});

// Get Task Status
const getUserTaskStatus = asyncHandler(async (_req, res) => {
  const tasks = await User.find()
    .populate("tasks", "title stage")
    .sort({ _id: -1 });

  res.status(200).json(tasks);
});

// Mark Notifications as Read
const markNotificationRead = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.user;
    
    const isReadType = req.body.isReadType || req.query.isReadType;
    const id = req.body.id || req.query.id;
    
    console.log("Mark notification read params:", { userId, isReadType, id });
    console.log("Request body:", req.body);
    console.log("Request query:", req.query);

    if (!isReadType || (isReadType !== "all" && isReadType !== "one")) {
      return res.status(400).json({ 
        status: false, 
        message: "isReadType must be 'all' or 'one'" 
      });
    }

    if (isReadType === "all") {
      await Notice.updateMany(
        { isRead: { $nin: [userId] } },
        { $push: { isRead: userId } }
      );
      
      console.log("All notifications marked as read for user:", userId);
    } else if (isReadType === "one" && id) {
      const result = await Notice.findOneAndUpdate(
        { _id: id, isRead: { $nin: [userId] } },
        { $push: { isRead: userId } },
        { new: true }
      );
      
      if (!result) {
        console.log("No notification found or already read:", id);
      } else {
        console.log("Notification marked as read:", id);
      }
    } else {
      return res.status(400).json({ 
        status: false, 
        message: "For 'one' type, id parameter is required" 
      });
    }
    
    res.status(200).json({ status: true, message: "Notification(s) marked as read" });
  } catch (error) {
    console.error("Mark notification read error:", error);
    res.status(500).json({ status: false, message: "Server error" });
  }
});

// User Profile Update Controller
const updateUserProfile = asyncHandler(async (req, res) => {
  const { userId, isAdmin } = req.user;
  const { _id } = req.body;

  const id =
    isAdmin && userId === _id
      ? userId
      : isAdmin && userId !== _id
      ? _id
      : userId;

  const user = await User.findById(id);

  if (user) {
    user.name = req.body.name || user.name;
    // user.email = req.body.email || user.email;
    user.title = req.body.title || user.title;
    user.role = req.body.role || user.role;

    const updatedUser = await user.save();

    user.password = undefined;

    res.status(201).json({
      status: true,
      message: "Profile Updated Successfully.",
      user: updatedUser,
    });
  } else {
    res.status(404).json({ status: false, message: "User not found" });
  }
});

// Activate or Deactivate User Profile
const activateUserProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (user) {
    user.isActive = req.body.isActive;

    await user.save();

    user.password = undefined;

    res.status(201).json({
      status: true,
      message: `User account has been ${
        user?.isActive ? "activated" : "disabled"
      }`,
    });
  } else {
    res.status(404).json({ status: false, message: "User not found" });
  }
});

const changeUserPassword = asyncHandler(async (req, res) => {
  const { userId } = req.user;

  if (userId === "65ff94c7bb2de638d0c73f63") {
    return res.status(404).json({
      status: false,
      message:
        "This is a test user. You can not chnage password. Thank you!!!",
    });
  }

  const user = await User.findById(userId);

  if (user) {
    user.password = req.body.password;

    await user.save();

    user.password = undefined;

    res.status(201).json({
      status: true,
      message: `Password chnaged successfully.`,
    });
  } else {
    res.status(404).json({ status: false, message: "User not found" });
  }
});

// Delete controller
const deleteUserProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await User.findByIdAndDelete(id);

  res.status(200).json({ status: true, message: "User deleted successfully" });
});

// Forgot Password Controller
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ 
      status: false, 
      message: "Email is required" 
    });
  }

  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user) {
      return res.status(404).json({ 
        status: false, 
        message: "User not found with this email" 
      });
    }

    const otp = generateOTP();
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 15); // OTP valid for 15 minutes

    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = otpExpiry;
    await user.save();


    try {
      await sendEmail({
        to: email,
        subject: "TaskHero Password Reset",
        html: passwordResetTemplate({ name: user.name, otp })
      });
      
      res.status(200).json({
        status: true,
        success: true,
        message: "OTP sent to your email address",
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError.message);
      res.status(500).json({ 
        status: false, 
        message: "Failed to send OTP email. Please try again later."
      });
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ 
      status: false, 
      message: "Failed to process request" 
    });
  }
});

// Verify OTP Controller
const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ 
      status: false, 
      message: "Email and OTP are required" 
    });
  }

  try {
    const user = await User.findOne({ 
      email, 
      resetPasswordOTP: otp,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        status: false, 
        message: "Invalid or expired OTP" 
      });
    }

    // Generate Password reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    await user.save();

    res.status(200).json({
      status: true,
      success: true,
      message: "OTP verified successfully",
      token: resetToken
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ 
      status: false, 
      message: "Failed to verify OTP" 
    });
  }
});

// Reset Password Controller
const resetPassword = asyncHandler(async (req, res) => {
  const { email, token, password } = req.body;

  if (!email || !token || !password) {
    return res.status(400).json({ 
      status: false, 
      message: "All fields are required" 
    });
  }

  try {
    const user = await User.findOne({ 
      email, 
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        status: false, 
        message: "Invalid or expired reset token" 
      });
    }
    user.password = password;
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;
    user.resetPasswordToken = undefined;
    await user.save();

    res.status(200).json({
      status: true,
      success: true,
      message: "Password has been reset successfully"
    });
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({ 
      status: false, 
      message: "Failed to reset password" 
    });
  }
});

const getUserStats = asyncHandler(async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ 
        status: false, 
        message: "Access denied. Admin privileges required."
      });
    }
    
    const totalUsers = await User.countDocuments({});
    const activeUsers = await User.countDocuments({ isActive: true });
    const adminUsers = await User.countDocuments({ isAdmin: true });
    
    res.status(200).json({
      status: true,
      stats: {
        totalUsers,
        activeUsers,
        adminUsers
      }
    });
  } catch (error) {
    console.error("Error fetching user statistics:", error);
    res.status(500).json({ 
      status: false, 
      message: "Failed to fetch user statistics"
    });
  }
});

export {
  activateUserProfile,
  changeUserPassword,
  deleteUserProfile,
  forgotPassword,
  getNotificationsList,
  getTeamList,
  getUserTaskStatus,
  loginUser,
  logoutUser,
  markNotificationRead,
  registerUser,
  resetPassword,
  updateUserProfile,
  verifyOTP,
  getUserStats,
};