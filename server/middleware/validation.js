const Joi = require('@hapi/joi');

//Register Validation
const registerValidation = (data) => {
    const schema = {
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string().min(6).required()
    };
    return Joi.validate(data, schema);
}
//Login Validation
const loginValidation = (data) => {
    const schema = {
        email: Joi.string().required().email(),
        password: Joi.string().min(6).required()
    };
    return Joi.validate(data, schema);
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;