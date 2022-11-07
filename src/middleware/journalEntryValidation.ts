import { journalEntrySchema } from "../validationSchema/journalEntrySchema";
const Joi=require("joi")

export const journalEntryDataValidation=async(req,res,next)=>{

let values=req.body.journal_entry_date.split("-")
if(!values)
return res.status(400).json({
    status:400,
    message:"invalid data"
})
console.log(values)
values[0]=parseInt(values[0])
values[1]=parseInt(values[1])
values[2]=parseInt(values[2])
    const journalEntryDayData={ 
       entry_day:values[2],
       entry_month:values[1],
       entry_year:values[0]

    }
    try{
        const {error, value} =journalEntrySchema.validate(journalEntryDayData,{abortEarly:false})
      
        if(error){
            return res.status(400).json({
                "status":400,
                "message":error.message
            })
        }
    
       
        
            
        next();
    }
    catch(err){
        next(err)
    }

}