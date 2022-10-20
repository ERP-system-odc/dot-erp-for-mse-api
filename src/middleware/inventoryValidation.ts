import { inventorySchema } from "../validationSchema/inventoryJoiSchema";
const Joi=require("joi")

export const inventoryDataValidation=async(req,res,next)=>{

    const inventoryData={ 
        inventory_name:req.body.inventory_name,
       inventory_price:req.body.inventory_price,        
       least_critical_amount:req.body.least_critical_amount,
        inventory_quantity:req.body.inventory_quantity,
        inventory_expense:req.body.inventory_expense

    }
    try{
        const {error, value} =inventorySchema.validate(inventoryData,{abortEarly:false})
      
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
