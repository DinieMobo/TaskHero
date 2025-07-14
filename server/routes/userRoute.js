import express from "express";
import {
  activateUserProfile,
  changeUserPassword,
  deleteUserProfile,
  forgotPassword,
  getNotificationsList,
  getTeamList,
  getUserTaskStatus,
  getUserStats,
  loginUser,
  logoutUser,
  markNotificationRead,
  registerUser,
  resetPassword,
  updateUserProfile,
  verifyOTP,
} from "../controllers/userController.js";
import { isAdminRoute, protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

// Auth routes
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/register", registerUser); // Public route for signup
router.post("/admin/register", protectRoute, isAdminRoute, registerUser); // Admin-only route for signup
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);
router.put("/profile", protectRoute, updateUserProfile);
router.put("/change-password", protectRoute, changeUserPassword);
router.put("/:id", protectRoute, isAdminRoute, activateUserProfile);
router.delete("/:id", protectRoute, isAdminRoute, deleteUserProfile);
router.get("/team", protectRoute, getTeamList);
router.get("/notifications", protectRoute, getNotificationsList);
router.get("/get-status", protectRoute, getUserTaskStatus);
router.put("/read-noti", protectRoute, markNotificationRead);
router.post("/read-noti", protectRoute, markNotificationRead);
router.get("/stats", protectRoute, isAdminRoute, getUserStats);

router.use(protectRoute);

export default router;