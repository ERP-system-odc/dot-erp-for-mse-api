const Joi = require('joi');

export const signupSchema=Joi.object({
    fullname:Joi.string().required(),
    email:Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password:Joi.string().min(8).required(),
    phonenumber:Joi.string().required().max(13),
    role:Joi.string().required(),
    confirmpassword:Joi.any().equal(Joi.ref('password'))
    .required()
    .label('Confirm password')
    .options({ messages: { 'any.only': '{{#label}} does not match'} })

})
export const signinSchema=Joi.object({
    email:Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password:Joi.string().min(8).required()
}

)



