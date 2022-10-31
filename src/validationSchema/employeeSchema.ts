const Joi = require('joi');


export const expenseSchema=Joi.object({

    employee_name:Joi.string().required(),
    salary_amount:Joi.number().required(),
    payment_schedule:Joi.number().required()
    

})