const Joi = require('joi');
const myCustomJoi = Joi.extend(require('joi-phone-number'));

export const signupSchema=Joi.object({
    fullname:Joi.string().required(),
    email:Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password:Joi.string().min(8).required(),
    phonenumber:myCustomJoi.string().required().phoneNumber(),
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



