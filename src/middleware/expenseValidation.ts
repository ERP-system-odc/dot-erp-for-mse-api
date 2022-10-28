import { expenseSchema } from "../validationSchema/expenseSchema"
const Joi=require("joi")

export const expenseDataValidation=async(req,res,next)=>{

    const expenseData={ 
        
        expense_name :req.body.expense_name,
        expense_amount:req.body.expense_amount,        
      
    }
    try{
        const {error, value} =expenseSchema.validate(expenseData,{abortEarly:false})
      
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
