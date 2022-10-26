const Joi = require('joi');


export const standardSchema=Joi.object({


    standard_name:Joi.string().required()

})
export const standardItemsSchema=Joi.object({
    inventory_name:Joi.string().required(),
    inventory_quantity:Joi.number().required()
})
