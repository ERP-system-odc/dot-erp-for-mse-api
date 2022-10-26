// import { usedInventorySchema } from "../validationSchema/usedInventorySchema"

// const Joi=require("joi")

// export const usedDataValidation=async(req,res,next)=>{

//     const usedInventoryData={ 
//         iu_name:req.body.ui_name,
//         iu_quantity:req.body.iu_quantity,        
        

//     }
//     try{
//         const {error, value} = usedInventorySchema.validate(usedInventoryData,{abortEarly:false})
      
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

import { usedInventorySchema } from "../validationSchema/usedInventorySchema"

const Joi=require("joi")
export const inventoryUsedDataValidation=async(req,res,next)=>{
    const usedInventoryData={
        iu_name:req.body.iu_name,
    }
    try{
        const {error, value} = usedInventorySchema.validate(usedInventoryData,{abortEarly:false})
        if(error){
            return res.status(400).json({
                "status":400,
                "message":error.message
            })
        }
        const items=req.body["product_items"]
        if(items.length==0)
        return res.status(400).json({
            "status":400,
            "message":"product quantities are required."
        })
        items.forEach(element => {
            const usedInventoryItemData={
                iu_name:element.product_name,
                iu_quantity:element.product_quantity,
                
            }
            const {error, value} =usedInventorySchema.validate(usedInventoryItemData,{abortEarly:false})
            if(error)
            return res.status(400).json({
                "status":400,
                "message":error.message
            })
            
            req.body.iu_quantity=parseInt(element.iu_quantity)
           
        });
        next();
    }
    catch(err){
        next(err)
    }
}
