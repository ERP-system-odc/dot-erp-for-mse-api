import { generalLedgerSchema } from "../validationSchema/generalLedgerSchema"
const Joi=require("joi")

export const generalLedgerDataValidation=async(req,res,next)=>{

let starting_date=req.params.starting_date.split("-")
let ending_date=req.params.ending_date.split("-")
if(!starting_date)
return res.status(400).json({
    status:400,
    message:"Starting date is required"
})
if(!ending_date)
return res.status(400).json({
    status:400,
    message:"Ending date is required"
})



    const generalLedgerData={ 
        start_date_day:parseInt(ending_date[2]),
        start_date_month:parseInt(ending_date[1]),
        start_date_year:parseInt(ending_date[0]),
        end_date_day:parseInt(ending_date[2]),
        end_date_month:parseInt(ending_date[1]),
        end_date_year:parseInt(ending_date[0])

    }
    try{
        const {error, value} =generalLedgerSchema.validate(generalLedgerData,{abortEarly:false})
      
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