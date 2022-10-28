const Joi = require('joi');


export const expenseSchema=Joi.object({

    expense_name:Joi.string().required(),
    expense_amount:Joi.number().required(),
    

})