const express = require("express");
const { celebrate, errors } = require("celebrate");
const { auth, authorize } = require("../middleware/auth");
const productController = require("../controllers/productController");
const {
  createProductValidation,
  updateProductValidation
} = require("../validations/productValidation");

const router = express.Router();

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);

// admin create/update/delete
router.post(
  "/",
  auth,
  authorize("admin"),
  celebrate(createProductValidation),
  productController.createProduct
);

router.put(
  "/:id",
  auth,
  authorize("admin"),
  celebrate(updateProductValidation),
  productController.updateProduct
);

router.delete(
  "/:id",
  auth,
  authorize("admin"),
  productController.deleteProduct
);

router.use(errors());

module.exports = router;