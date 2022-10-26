const Joi = require('joi');


export const productSchema=Joi.object({


    product_name:Joi.string().required(),
    product_quantity:Joi.number().required(),
    product_selling_price:Joi.number().required(),
   

})
