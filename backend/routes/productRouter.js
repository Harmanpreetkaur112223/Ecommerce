import {
  createProduct,
  getIndividualProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  showAllreviews,
  deleteReview
} from "../controllers/productController.js";
import { Router } from "express";
import { veriffyJWT, authorizeRole } from "../middleware/authMiddleware.js";
const router = Router();

// get the product --user route
router.route("/getProduct").get( getProduct);

// create the product --admin route
router
  .route("/admin/createProduct")
  .post(veriffyJWT, authorizeRole("admin"), createProduct);

// update the product
router
  .route("/admin/updateProduct/:id")
  .put(veriffyJWT, authorizeRole("admin"), updateProduct);

// individual product search
router.route("/getProduct/:id").get(getIndividualProduct);

// delete the product
router
  .route("/admin/deleteProduct/:id")
  .delete(veriffyJWT, authorizeRole("admin"), deleteProduct);

  
router.route("/review").put(veriffyJWT,createProductReview);
router.route("/reviews").get(showAllreviews).put(veriffyJWT,deleteReview);
export default router;
