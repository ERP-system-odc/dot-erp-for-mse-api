// import { productSchema } from "../validationSchema/productSchema"
// const Joi=require("joi")

// export const productDataValidation=async(req,res,next)=>{

//     const productData={ 
//         produc_name:req.body.product_name,
//         prodduct_quantity:req.body.product_quantity,        
//         product_selling_price:req.body.product_selling_price,
       

//     }
//     try{
//         const {error, value} =productSchema.validate(productData,{abortEarly:false})
      
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
import { productSchema } from "../validationSchema/productSchema"
import { usedInventorySchema } from "../validationSchema/usedInventorySchema"
const Joi=require("joi")
export const productDataValidation=async(req,res,next)=>{
    const productData={
        standard_name:req.body.standard_name,
    }
    try{
        const {error, value} =productSchema.validate(productData,{abortEarly:false})
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
            const productItemData={
                product_name:element.product_name,
                product_quantity:element.product_quantity,
                product_selling_price:element.product_selling_price
            }
            const {error, value} =productSchema.validate(productItemData,{abortEarly:false})
            if(error)
            return res.status(400).json({
                "status":400,
                "message":error.message
            })
            
            req.body.product_quantity=parseInt(element.product_quantity)
            req.body.product_selling_price=parseFloat(element.product_selling_price)
        });
        next();
    }
    catch(err){
        next(err)
    }
}