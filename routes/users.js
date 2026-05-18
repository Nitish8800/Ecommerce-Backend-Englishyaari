const express = require("express");
const { celebrate, errors } = require("celebrate");
const { auth, authorize } = require("../middleware/auth");
const userController = require("../controllers/userController");
const {
  createUserSchema,
  updateUserSchema
} = require("../validations/userValidation");

const router = express.Router();

router.get(
  "/",
  auth,
  authorize("admin"),
  userController.getAllUsers
);

router.get(
  "/:id",
  auth,
  userController.getUserById
);

router.put(
  "/:id",
  auth,
  celebrate(updateUserSchema),
  userController.updateUser
);

router.delete(
  "/:id",
  auth,
  authorize("admin"),
  userController.deleteUser
);

router.get(
  "/role/:role",
  auth,
  authorize("admin"),
  userController.getUsersByRole
);

router.use(errors());

module.exports = router;