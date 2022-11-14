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
import { JournalEntry } from "../entity/journalEntry";

export let addToStock=async (req,res,next)=>{
    try{
    const journalEntryRepository=AppDataSource.getRepository(JournalEntry)
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
    
    for(let x=0;x<originalStandard.length;x++){
        let invType=await inventoryTypeRepository.findOneBy({inventory_name:originalStandard[x].inventory_name,firm:foundFirm})
        if(!invType)
        return res.status(404).json({
            status:404,
            message:"Inventories not found for production"
        })
        if((originalStandard[x].inventory_quantity)*req.body.product_quantity>invType.total_amount){
            return res.status(412).json({
                status:412,
                message:"Amount of inventories required to produce isnot available"
            })
        }
    }
   
        let productInventoryCost=0
        
    
       let availableQuantity=0
   for(let y=0;y<originalStandard.length;y++){    
   availableQuantity=originalStandard[y].inventory_quantity*req.body.product_quantity
    
    
    
    let foundInventoryType=await inventoryTypeRepository.findOneBy({inventory_name:originalStandard[y].inventory_name,firm:foundFirm})
    let foundInventoryTransactions=await inventoryTransactionRepository.find({
        where:{
            inventory_type:foundInventoryType,
            current_quantity:MoreThan(0)
        }
    })
    if(!foundInventoryTransactions)
    return res.status(404).json({
        "message":"Inventories aren't enough to process this request"
    })
    for(let z=0;z<foundInventoryTransactions.length;z++){
        if(availableQuantity>0){
            if(availableQuantity>foundInventoryTransactions[z].current_quantity){
                productInventoryCost+=(availableQuantity-foundInventoryTransactions[z].current_quantity)*foundInventoryTransactions[z].unit_price
                availableQuantity-=foundInventoryTransactions[z].current_quantity
                foundInventoryTransactions[z].current_quantity=0;
                await inventoryTransactionRepository.save(foundInventoryTransactions[z])
                
            }
            else if(availableQuantity<=foundInventoryTransactions[z].current_quantity){
                productInventoryCost+=(foundInventoryTransactions[z].current_quantity-availableQuantity)*foundInventoryTransactions[z].unit_price
                foundInventoryTransactions[z].current_quantity-=availableQuantity
                availableQuantity=0;
                await inventoryTransactionRepository.save(foundInventoryTransactions[z])
            }   
        }
    }

      //  productInventoryCost+=foundInventoryType.inventory_price*originalStandard[y].inventory_quantity*req.body.product_quantity
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
    if(req.body.product_expense>0){
        const journalEntry=new JournalEntry()
        journalEntry.account="Product:"+req.body.product_standard+" Expense"
        journalEntry.debit=req.body.product_expense
        journalEntry.credit=0
        journalEntry.firm=foundFirm
        journalEntry.transaction_reason="Paid cash for creation of product:"+req.body.product_standard
        journalEntry.transaction_type="{-EXPENSE-}(Other)"
        
       await journalEntryRepository.save(journalEntry)
    
        const journalEntrySecond=new JournalEntry()
        journalEntrySecond.account="Cash"
        journalEntrySecond.debit=0
        journalEntrySecond.credit=req.body.product_expense
        journalEntrySecond.firm=foundFirm
        journalEntrySecond.transaction_reason="Expense for creation of product:"+req.body.product_standard
        journalEntrySecond.transaction_type="{-ASSET-}(Cash)"
        
        await journalEntryRepository.save(journalEntrySecond)
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
        const journalEntryRepository=AppDataSource.getRepository(JournalEntry)
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
        income.income_name="SOLD "+foundProduct.product_name
        income.income_amount=foundProduct.product_selling_price
        income.firm=foundFirm
        await incomeRepository.save(income)
        foundFirm.current_capital+=foundProduct.product_selling_price
        await firmRepository.save(foundFirm)

        const journalEntry=new JournalEntry()
        journalEntry.account="Cash"
        journalEntry.debit=foundProduct.product_selling_price
        journalEntry.credit=0
        journalEntry.firm=foundFirm
        journalEntry.transaction_reason="Received cash for the selling of 1 product:"+foundProduct.product_name
        journalEntry.transaction_type="{-ASSET-}(Cash)"
        
        await journalEntryRepository.save(journalEntry)
  
        const journalEntrySecond=new JournalEntry()
        journalEntrySecond.account="Revenue from "+foundProduct.product_name
        journalEntrySecond.debit=0
        journalEntrySecond.credit=foundProduct.product_selling_price
        journalEntrySecond.firm=foundFirm
        journalEntrySecond.transaction_reason="Got a revenue for selling 1 product:"+foundProduct.product_name
        journalEntrySecond.transaction_type="{-REVENUE-}"
        
        await journalEntryRepository.save(journalEntrySecond)
    
        res.status(200).json({
            status:200,
            message:"Product sold successfully"
            
        })
    }
    catch(err){
        next(err)
    }
}



