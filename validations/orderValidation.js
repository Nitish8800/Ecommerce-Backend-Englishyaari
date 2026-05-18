const { Joi, Segments } = require("celebrate");

const createOrderValidation = {
  [Segments.BODY]: Joi.object({
    products: Joi.array()
      .items(
        Joi.object({
          productId: Joi.string().required(),
          quantity: Joi.number().integer().min(1).required()
        })
      )
      .min(1)
      .required(),
    status: Joi.string()
      .valid("pending", "completed", "cancelled")
      .optional()
  })
};

module.exports = {
  createOrderValidation
};