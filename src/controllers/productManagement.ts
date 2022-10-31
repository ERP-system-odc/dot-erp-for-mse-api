import { User } from "../entity/User";
import { Firm } from "../entity/Firm";
import { Product } from "../entity/product";
import { InventoryUsed } from "../entity/inventoryUsed";
import { AppDataSource } from "../data-source";
import { Standard } from "../entity/Standard";
import { StandardSetting } from "../entity/StandardSettings";
import { InventoryType } from "../entity/InventoryType";
import { MoreThan, SimpleConsoleLogger } from "typeorm";
import { InventoryTransaction } from "../entity/InventoryTransaction";
import { Expense } from "../entity/Expense";
import { Income } from "../entity/Income";

export let addToStock=async (req,res,next)=>{
    try{
    const userRepository=AppDataSource.getRepository(User)   
    const foundUser=await userRepository.findOneBy({id:req.user.id}) 
    const firmRepository=AppDataSource.getRepository(Firm)
    const standardRepository=AppDataSource.getRepository(Standard)
    const standardSettingRepository=AppDataSource.getRepository(StandardSetting)
    const inventoryTransactionRepository=AppDataSource.getRepository(InventoryTransaction)
    const inventoryTypeRepository=AppDataSource.getRepository(InventoryType)
    const inventoryUsedRepository=AppDataSource.getRepository(InventoryUsed)
    const expenseRepository=AppDataSource.getRepository(Expense)
    const productRepository=AppDataSource.getRepository(Product)
    const foundFirm=await firmRepository.findOneBy({user:foundUser})
    
  
    if(!foundFirm)
        return res.status(404).json({
            "status":404,
            "message":"firm isn't found"
            })

    const foundStandard=await standardRepository.findOne({
        relations:{
            standard_settings:true
        },
        where:{standard_name:req.body.product_standard,firm:foundFirm}})
      
    if(!foundStandard)
    return res.status(404).json({
        status:404,
        message:"Standard isn't found"
    })
   
    let originalStandard=foundStandard.standard_settings

   



        let productInventoryCost=0
        
    
       
   for(let y=0;y<originalStandard.length;y++){    
    
    let foundInventoryType=await inventoryTypeRepository.findOneBy({inventory_name:originalStandard[y].inventory_name,firm:foundFirm})

        productInventoryCost+=foundInventoryType.inventory_price*originalStandard[y].inventory_quantity*req.body.product_quantity
    foundInventoryType.total_amount-=originalStandard[y].inventory_quantity*req.body.product_quantity
    await inventoryTypeRepository.save(foundInventoryType)
   
           
    }      
    let foundProduct=await productRepository.findOneBy({
        product_name:foundStandard.standard_name,
        firm:foundFirm
    })
    if(!foundProduct){
        let product=new Product()
        product.product_name=foundStandard.standard_name
        product.product_quantity=req.body.product_quantity
        product.product_selling_price=req.body.product_selling_price
        product.product_inventory_cost=productInventoryCost
        product.firm=foundFirm
    
        await productRepository.save(product)
    console.log(originalStandard)
        originalStandard.forEach(async element=>{
            let inventoryUsed=new InventoryUsed()
            inventoryUsed.iu_name=element.inventory_name
            inventoryUsed.iu_quantity=element.inventory_quantity*req.body.product_quantity
            inventoryUsed.product=product
            await inventoryUsedRepository.save(inventoryUsed)
        })
    }
    else{
        foundProduct.product_quantity+=req.body.product_quantity
        foundProduct.product_inventory_cost=req.body.product_selling_price
        foundProduct.product_inventory_cost+=productInventoryCost
        await productRepository.save(foundProduct)
        originalStandard.forEach(async element=>{
            let inventoryUsed=new InventoryUsed()
            inventoryUsed.iu_name=element.inventory_name
            inventoryUsed.iu_quantity=element.inventory_quantity*req.body.product_quantity
            inventoryUsed.product=foundProduct
            await inventoryUsedRepository.save(inventoryUsed)
        })
    }


    if(req.body.product_expense!=0)
    {
        const expense=new Expense()
        expense.expense_amount=req.body.product_expense
        expense.expense_name="PRODUCT_EXPENSE"
        expense.firm=foundFirm
        if(foundFirm.current_capital<expense.expense_amount)
            return(
                res.status(412).json({
                    status:412,
                    "message":"The capital is minimal to subsidize the expense"
                })
            )
        await expenseRepository.save(expense)
        foundFirm.current_capital-=expense.expense_amount
        await firmRepository.save(foundFirm)
    }
    res.status(200).json(
        {
            status:200,
            message:"Product added to stock successfully"
        }
    )

    }
    catch(err){
        next(err)
    }
        

}
export const getStock=async(req,res,next)=>{
    try{
        const userRepository=AppDataSource.getRepository(User)   
        const foundUser=await userRepository.findOneBy({id:req.user.id}) 
        const firmRepository=AppDataSource.getRepository(Firm)
        const productRepository=AppDataSource.getRepository(Product)
        const foundFirm=await firmRepository.findOneBy({user:foundUser})
        
      
        if(!foundFirm)
            return res.status(404).json({
                "status":404,
                "message":"firm isn't found"
                })
        const foundProduct=await productRepository.find({
            where:{
                firm:foundFirm,
                product_quantity:MoreThan(0)
            }
        })
        if(!foundProduct)
        res.status(404).json({
            status:404,
            "message":"Products not found"
        })
        res.status(200).json({
            status:200,
            foundProduct
        })
    }
    catch(err){
        next(err)
    }
    


}
export const updateStock=async(req,res,next)=>{
try{
    const userRepository=AppDataSource.getRepository(User)   
    const foundUser=await userRepository.findOneBy({id:req.user.id}) 
    const firmRepository=AppDataSource.getRepository(Firm)
    const productRepository=AppDataSource.getRepository(Product)
    const foundFirm=await firmRepository.findOneBy({user:foundUser})
   
    const productId=req.params.productID

    if(!foundFirm)
        return res.status(404).json({
            "status":404,
            "message":"firm isn't found"
            })
    
    let foundProduct=await productRepository.findOneBy({id:productId})
    if(!foundProduct)
    return res.status(404).json({
        "status":404,
        "message":"Product not found"
        })
    foundProduct.product_selling_price=req.body.product_selling_price
    await productRepository.save(foundProduct)
    res.status(200).json({
        status:200,
        message:"Product updated successfully"
        
    })
         
}
catch(err){
next(err)
}
}
export const sellStock=async(req,res,next)=>{
    try{
        const userRepository=AppDataSource.getRepository(User)   
        const foundUser=await userRepository.findOneBy({id:req.user.id}) 
        const firmRepository=AppDataSource.getRepository(Firm)
        const productRepository=AppDataSource.getRepository(Product)
        const foundFirm=await firmRepository.findOneBy({user:foundUser})
        const incomeRepository=await AppDataSource.getRepository(Income)
        
        const productId=req.params.productID
        if(!foundFirm)
            return res.status(404).json({
                "status":404,
                "message":"firm isn't found"
                })
        
        let foundProduct=await productRepository.findOneBy({id:productId})
        if(!foundProduct)
        return res.status(404).json({
            "status":404,
            "message":"Product not found"
            })
        foundProduct.product_quantity-=1
        await productRepository.save(foundProduct)
        let income=new Income()
        income.income_name="SOLD PRODUCT"
        income.income_amount=foundProduct.product_selling_price
        income.firm=foundFirm
        await incomeRepository.save(income)
        foundFirm.current_capital+=foundProduct.product_selling_price
        await firmRepository.save(foundFirm)
        res.status(200).json({
            status:200,
            message:"Product sold successfully"
            
        })
    }
    catch(err){
        next(err)
    }
}



