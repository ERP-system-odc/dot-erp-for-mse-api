import { firmSchema } from "../validationSchema/firmJoiSchema";
const Joi=require("joi")

export const firmDataValidation=async(req,res,next)=>{

    const firmData={ 
        business_name:req.body.business_name,
        business_sub_type:req.body.business_sub_type,        
        business_capital:req.body.business_capital,
        tin_number:req.body.tin_number

    }
    try{
        const {error, value} =firmSchema.validate(firmData,{abortEarly:false})
      
        if(error){
            return res.status(400).json({
                "message":error.message
            })
        }
       
            
             
        next();
    }
    catch(err){
        next(err)
    }

}