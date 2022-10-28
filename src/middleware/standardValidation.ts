import { standardSchema ,standardItemsSchema} from "../validationSchema/standardSchema"
const Joi=require("joi")

export const standardDataValidation=async(req,res,next)=>{

    const standardData={ 
        standard_name:req.body.standard_name,
      

    }
    try{
        const {error, value} =standardSchema.validate(standardData,{abortEarly:false})
      
        if(error){
            return res.status(400).json({
                "status":400,
                "message":error.message
            })
        }
        const items=req.body["standard_items"]
        if(items.length==0)
        return res.status(400).json({
            "status":400,
            "message":"Standard quantities are required."
        })
        items.forEach(element => {
            const standardItemData={
                inventory_name:element.inventory_name,
                inventory_quantity:element.inventory_quantity
            }
            const {error, value} =standardItemsSchema.validate(standardItemData,{abortEarly:false})
            if(error)  
            return res.status(400).json({
                "status":400,
                "message":error.message
            })
            
           element.inventory_quantity=parseInt(element.inventory_quantity) 
        });
                  
           
        next();
    }
    catch(err){
        next(err)
    }

}
