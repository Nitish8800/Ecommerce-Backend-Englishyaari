const express = require("express");
const { celebrate, errors } = require("celebrate");
const authController = require("../controllers/authController");
const { auth } = require("../middleware/auth");
const {
  registerSchema,
  loginSchema,
} = require("../validations/authValidation");

const router = express.Router();

router.post("/register", celebrate(registerSchema), authController.register);

router.post("/login", celebrate(loginSchema), authController.login);

router.get("/me", auth, authController.getCurrentUser);

router.use(errors());

module.exports = router;
