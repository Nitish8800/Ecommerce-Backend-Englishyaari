const { Joi, Segments } = require("celebrate");

const createProductValidation = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().trim().required(),
    category: Joi.string().trim().required(),
    price: Joi.number().min(0).required()
  })
};

const updateProductValidation = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().trim(),
    category: Joi.string().trim(),
    price: Joi.number().min(0)
  }).min(1)
};

module.exports = {
  createProductValidation,
  updateProductValidation
};