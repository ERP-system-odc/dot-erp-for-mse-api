const Joi = require('joi');


export const productSchema=Joi.object({


    product_quantity:Joi.number().min(1).required(),
    product_selling_price:Joi.number().required(),
    product_expense:Joi.number(),
    product_standard:Joi.string().required()
   

})

export const usedInventorySchema=Joi.object({


    iu_name:Joi.string().required(),
    iu_quantity:Joi.number().required(),
   

})

export const productUpdateSchema=Joi.object({
    product_selling_price:Joi.number().required()
})