const Joi = require('joi');


export const workInProgressSchema=Joi.object({


    inventory_name:Joi.string().required(),
    inventory_quantity:Joi.string().required(),
    inventory_price:Joi.number().required(),


})
