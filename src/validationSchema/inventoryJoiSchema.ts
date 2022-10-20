const Joi = require('joi');


export const inventorySchema=Joi.object({

    inventory_name:Joi.string().required(),
    inventory_price:Joi.number().required(),
    least_critical_amount:Joi.number().required(),
    inventory_quantity:Joi.number().greater(0).required(),
    inventory_expense:Joi.number().greater(0)

})


