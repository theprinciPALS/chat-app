const Joi = require("joi");

module.exports = {
  // we have to allow ID so that the model will update successfully
  id: Joi
      .number()
      .integer(),
  name: Joi
        .string()
        .min(1)
        .max(50),
  creatorEmail: Joi
      .string()
      .min(1)
      .max(100),

  underReview: Joi
      .boolean(),

  updated_at: Joi.any(),
  created_at: Joi.any()

}
