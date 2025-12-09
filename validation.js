const Joi = require('joi');

// Registration validation schema
const registerValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(2).max(30).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        mobile: Joi.string().required(),
        role_id: Joi.string().required()
    });
    return schema.validate(data);
};

// Login validation schema
const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    });
    return schema.validate(data);
};


const membershipValidation = (data) => {
    const schema = Joi.object({
        fullName: Joi.string().min(3).required(),
        address: Joi.string().required(),
        dateOfBirth: Joi.date().iso().required(),
        gender: Joi.string().valid("Male", "Female", "Other").required(),
        phone: Joi.string().pattern(/^\d{10,15}$/).required(), 
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
        membershipType: Joi.string().required(),
        additionalInfo: Joi.string().allow(""),
        isDisabled: Joi.boolean().optional()
    });

    return schema.validate(data, { abortEarly: false });
};
// const membershipValidation = (data) => {
//     const schema = Joi.object({
//         fullName: Joi.string().required(),
//         address: Joi.string().required(),
//         dateOfBirth: Joi.date().iso().required(),
//         gender: Joi.string().required(),
//         phone: Joi.string().required(),
//         email: Joi.string().email().required(),
//         password: Joi.string().min(6).optional(),
//         confirmPassword: Joi.string().valid(Joi.ref('password')).optional().messages({
//             'any.only': 'Passwords do not match',  // Custom error message
//         }),
//         membershipType: Joi.string().required(),
//         additionalInfo: Joi.string().optional(),
//         isDisabled: Joi.boolean().optional()
//     });

//     return schema.validate(data);
// };
// Login validation schema
const memberLoginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    });
    return schema.validate(data);
};


module.exports = {
    registerValidation,
    loginValidation,
    membershipValidation,
    memberLoginValidation  
};