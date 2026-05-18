const { Joi, Segments } = require("celebrate");

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/);

const baseUserBody = {
  name: Joi.string().trim().min(2).max(50),
  email: Joi.string().email().trim().lowercase(),
  role: Joi.string().valid("admin", "user"),
  password: Joi.string().min(6)
};

const createUserSchema = {
  [Segments.BODY]: Joi.object({
    ...baseUserBody,
    name: baseUserBody.name.required(),
    email: baseUserBody.email.required(),
    password: baseUserBody.password.required(),
    role: baseUserBody.role.required()
  })
};

const updateUserSchema = {
  [Segments.BODY]: Joi.object({
    ...baseUserBody
  }).min(1)
};

module.exports = {
  createUserSchema,
  updateUserSchema
};