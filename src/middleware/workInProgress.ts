import { workInProgressSchema } from "../validationSchema/workInProgressSchema";
const Joi=require("joi")

export const workInProgressDataValidation=async(req,res,next)=>{

    const workInProgressData ={ 
        business_name:req.body.business_name,
        business_sub_type:req.body.business_sub_type,        
        business_capital:req.body.business_capital,
        tin_number:req.body.tin_number

    }
    try{
        const {error, value} = workInProgressSchema.validate(workInProgressData,{abortEarly:false})
      
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