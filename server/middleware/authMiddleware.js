import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const protectRoute = asyncHandler(async (req, res, next) => {
  let token = req.cookies.token;

  console.log("protectRoute: token received:", token ? "Token exists" : "No token");

  if (token) {
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      console.log("protectRoute: token verified, userId:", decodedToken.userId);

      const user = await User.findById(decodedToken.userId).select(
        "isAdmin email"
      );

      if (!user) {
        console.log("protectRoute: user not found in database");
        return res
          .status(401)
          .json({ status: false, message: "User not found. Please login again." });
      }

      req.user = {
        email: user.email,
        isAdmin: user.isAdmin,
        userId: decodedToken.userId,
      };

      next();
    } catch (error) {
      console.error("protectRoute token verification error:", error.message);
      return res
        .status(401)
        .json({ status: false, message: "Not authorized. Token invalid or expired." });
    }
  } else {
    console.log("protectRoute: no token found in cookies");
    return res
      .status(401)
      .json({ status: false, message: "Not authorized. Please login first." });
  }
});

const isAdminRoute = asyncHandler(async (req, res, next) => {
  console.log("isAdminRoute: req.user:", req.user);
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    console.log("isAdminRoute: user is not admin");
    res.status(401).json({
      status: false,
      message: "Not authorized as admin. Try login as admin.",
    });
  }
});

export { isAdminRoute, protectRoute };