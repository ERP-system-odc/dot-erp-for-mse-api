const Joi = require('joi');


export const firmSchema=Joi.object({


    business_name:Joi.string().required(),
    business_sub_type:Joi.string().required(),
    business_capital:Joi.number().required(),
    tin_number:Joi.string().min(10).max(10).required()

})


