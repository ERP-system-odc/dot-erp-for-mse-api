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
        req.body.expense_amount=parseFloat(req.body.expense_amount)
    
       if(req.body.expense_amount<=0){
        return res.status(400).json({
            "status":400,
            "message":"Please enter expense greater than zero"
        })
       }
            
             
        next();
    }
    catch(err){
        next(err)
    }

}
