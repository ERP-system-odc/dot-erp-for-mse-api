// import { employeeSchema } from "../validationSchema/employeeSchema"
// const Joi=require("joi")

// export const employeeDataValidation=async(req,res,next)=>{

//     const employeeData={ 
        
//         employee_name:req.body.employee_name,
//         salary_amount:req.body.salary_amount,
//         payment_schedule:req.body.payment_schedule        
      
//     }
//     try{
//         const {error, value} =employeeSchema.validate(employeeData,{abortEarly:false})
      
//         if(error){
//             return res.status(400).json({
//                 "status":400,
//                 "message":error.message
//             })
//         }
    
       
            
             
//         next();
//     }
//     catch(err){
//         next(err)
//     }

// }
