import { productSchema,productUpdateSchema} from "../validationSchema/productSchema"

const Joi=require("joi")


export const productDataValidation=async(req,res,next)=>{

    const productData={
       
        product_quantity:req.body.product_quantity,
        product_selling_price:req.body.product_selling_price,
        product_expense:req.body.product_expense,
        product_standard:req.body.product_standard
    }
    try{
        const {error, value} =productSchema.validate(productData,{abortEarly:false})
        if(error){
            return res.status(400).json({
                "status":400,
                "message":error.message
            })
        }
        req.body.product_quantity=parseInt(productData.product_quantity)
        req.body.product_selling_price=parseFloat(productData.product_selling_price)
        req.body.product_expense=parseFloat(productData.product_expense)
        if(!req.body.expense)
        req.body.expense=0
        // const items=req.body["product_items"]
        // if(items.length==0)
        // return res.status(400).json({
        //     "status":400,
        //     "message":"product quantities are required."
        // })
    //     items.forEach(element => {
    //         const productItemData={
    //            iu_name:element.iu_name,
    //            iu_quantity:element.iu_quantity
                
    //         }
    //         const {error, value} =usedInventorySchema.validate(productItemData,{abortEarly:false})
    //         if(error)
    //         return res.status(400).json({
    //             "status":400,
    //             "message":error.message
    //         })
            
    //    element.iu_quantity=parseInt(element.iu_quantity)
            
    //     });
        next();
    }
    catch(err){
        next(err)
    }
}
export const updateProductValidation=async(req,res,next)=>{
    const productData={
        product_selling_price:req.body.product_selling_price
    }
    try{
        const {error, value} =productUpdateSchema.validate(productData,{abortEarly:false})
        if(error){
            return res.status(400).json({
                "status":400,
                "message":error.message
            })
        }
        req.body.product_selling_price=parseFloat(req.body.product_selling_price)
        next()
    }
    catch(err){
        next(err)
    }
}