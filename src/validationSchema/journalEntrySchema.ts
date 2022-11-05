const Joi = require('joi');


export const journalEntrySchema=Joi.object({

    entry_day:Joi.number().required(),
    entry_month:Joi.number().required(),
    entry_year:Joi.number().required()
    

})


