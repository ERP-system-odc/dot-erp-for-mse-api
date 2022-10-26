const Joi = require('joi');


export const usedInventorySchema=Joi.object({


    iu_name:Joi.string().required(),
    iu_quantity:Joi.number().required(),
   

})
