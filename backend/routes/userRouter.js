import express from "express";
const router = express.Router();
import {
  registerUser,
  loginUser,
  logOutUser,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  getAllUserdetails,
  getUser,
  deleteUser,
  updateUserRole
} from "../controllers/userController.js";
import { check } from "express-validator";
import { authorizeRole, veriffyJWT } from "../middleware/authMiddleware.js";
// import { verify } from 'jsonwebtoken';
const validations = [check("email", "Please enter valid email").isEmail()];
router.route("/register").post(validations, registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(veriffyJWT, logOutUser);
// --request for link on the gmail
router.route("/password/forgot").post(veriffyJWT , forgotPassword);
router.route("/me").get(veriffyJWT, getUserDetails);

// request for providing passwords and changing it
router.route("/password/reset/:token").put(veriffyJWT,resetPassword);

// ===============================================================user routes=======================================================
router
  .route("/admin/users")
  .get(veriffyJWT, authorizeRole("admin"), getAllUserdetails);
router.route("/password/update").put(veriffyJWT, updatePassword);
router.route("/me/update/:id").put(veriffyJWT, updateProfile);
router
  .route("/admin/:id")
  .get(veriffyJWT, authorizeRole("admin"), getUser)
  .delete(veriffyJWT, authorizeRole("admin"), deleteUser)
   .put(veriffyJWT,authorizeRole('admin'),updateUserRole);
export default router;
