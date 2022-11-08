const Joi = require('joi');


export const generalLedgerSchema=Joi.object({

    start_date_day:Joi.number().required(),
    start_date_month:Joi.number().required(),
    start_date_year:Joi.number().required(),
    end_date_day:Joi.number().required(),
    end_date_month:Joi.number().required(),
    end_date_year:Joi.number().required()
    

})


