const { Joi } = require("celebrate");

const registerSchema = {
  body: Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
      "string.min": "Name must be at least 2 characters long",
      "string.max": "Name cannot exceed 50 characters",
      "any.required": "Name is required",
      "string.empty": "Name cannot be empty"
    }),
    email: Joi.string().email().required().messages({
      "string.email": "Please enter a valid email address",
      "any.required": "Email is required",
      "string.empty": "Email cannot be empty"
    }),
    password: Joi.string().min(6).required().messages({
      "string.min": "Password must be at least 6 characters long",
      "any.required": "Password is required",
      "string.empty": "Password cannot be empty"
    }),
    role: Joi.string()
      .valid("admin", "user")
      .required()
      .messages({
        "any.only": "Role must be one of: admin, user",
        "any.required": "Role is required",
        "string.empty": "Role cannot be empty"
      })
  })
};

const loginSchema = {
  body: Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Please enter a valid email address",
      "any.required": "Email is required",
      "string.empty": "Email cannot be empty"
    }),
    password: Joi.string().required().messages({
      "any.required": "Password is required",
      "string.empty": "Password cannot be empty"
    })
  })
};

module.exports = {
  registerSchema,
  loginSchema
};