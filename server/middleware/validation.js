const Joi = require("@hapi/joi");

//Register Validation
const registerValidation = data => {
  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().min(6).required(),
    firstName: Joi.string().allow("-", " ").required(),
    lastName: Joi.string().allow("-", " ").required(),
  });
  return schema.validate(data);
};
//Login Validation
const loginValidation = data => {
  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
