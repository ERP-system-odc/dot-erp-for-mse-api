import { User } from "../entity/User";
import { Firm } from "../entity/Firm";
import { InventoryType } from "../entity/InventoryType";
import { InventoryTransaction } from "../entity/InventoryTransaction";
import { AvailableInventory } from "../entity/AvailableInventory";
import { Expense } from "../entity/Expense";
import { AppDataSource } from "../data-source";


export const getInventoryTypes=async (req,res,next)=>{
try{
    const userRepository=AppDataSource.getRepository(User)   
    const foundUser=await userRepository.findOneBy({id:req.user.id}) 
    const firmRepository=AppDataSource.getRepository(Firm)
    const inventoryTypeRepository=AppDataSource.getRepository(InventoryType)
    const foundFirm=await firmRepository.findOneBy({user:foundUser})
    if(!foundFirm)
return res.status(404).json({
    "status":404,
    "message":"firm isn't found"
})
    const foundInventoryTypes=await inventoryTypeRepository.findOneBy({firm:foundFirm})
if(!foundInventoryTypes)
return res.status(404).json({
    "status":404,
    "message":"Inventory types not found"
})
res.status(200).json({
    "status":200,
    "inventory_types":foundInventoryTypes
})
}
catch(err){
next(err)
}
}
export const createInventory=async(req,res,next)=>{
    try{
       

const userRepository=AppDataSource.getRepository(User)
const foundUser=await userRepository.findOneBy({id:req.user.id}) 
const firmRepository=AppDataSource.getRepository(Firm)
const inventoryTypeRepository=AppDataSource.getRepository(InventoryType)
const availableInventoryRepository=AppDataSource.getRepository(AvailableInventory)
const inventoryTransactionRepository=AppDataSource.getRepository(InventoryTransaction)
const expenseRepository=AppDataSource.getRepository(Expense)
if(req.body.inventory_expense==null)
req.body.inventory_expense=0

const foundFirm=await firmRepository.findOneBy({user:foundUser})

if(!foundFirm)
return res.status(404).json({
    "status":404,
    "message":"firm isn't found"
})

if(req.body.inventory_quantity*req.body.inventory_price+req.body.inventory_expense>foundFirm.current_capital)
return res.status(412).json({
    "status":412,
    "message":"Current capital isn't enough to process the request."
})

let inventoryType=new InventoryType()
const foundInventoryType=await inventoryTypeRepository.findOneBy({firm:foundFirm,inventory_name:req.body.inventory_name})
if(!foundInventoryType){
inventoryType.inventory_name=req.body.inventory_name
inventoryType.inventory_price=req.body.inventory_price
inventoryType.firm=foundFirm
inventoryType.least_critical_amount=req.body.least_critical_amount
await inventoryTypeRepository.save(inventoryType)

const availableInventory=new AvailableInventory()
availableInventory.initial_quantity=req.body.inventory_quantity
availableInventory.current_quantity=req.body.inventory_quantity
availableInventory.inventory_type=inventoryType

await availableInventoryRepository.save(availableInventory)

const inventoryTransaction=new InventoryTransaction()
inventoryTransaction.transaction_name="INVENTORY ADDITION"
inventoryTransaction.transaction_type="add"
inventoryTransaction.price=await availableInventory.initial_quantity*availableInventory.inventory_type.inventory_price
inventoryTransaction.available_inventory=availableInventory

await inventoryTransactionRepository.save(inventoryTransaction)
if(req.body.inventory_expense!=0){

const expense=new Expense()
expense.expense_name="INVENTORY EXPENSE"
expense.expense_amount=req.body.inventory_expense

expense.firm=foundFirm

await expenseRepository.save(expense)}

foundFirm.current_capital=foundFirm.current_capital-(req.body.inventory_quantity*req.body.inventory_price+req.body.inventory_expense)
await firmRepository.save(foundFirm)

return res.status(200).json({
    status:200,
    message:"Inventory saved successfully"
})

}


foundInventoryType.inventory_price=req.body.inventory_price
foundInventoryType.firm=foundFirm
foundInventoryType.least_critical_amount=req.body.least_critical_amount

await inventoryTypeRepository.save(foundInventoryType)

const availableInventory=new AvailableInventory()
availableInventory.initial_quantity=req.body.inventory_quantity
availableInventory.current_quantity=req.body.inventory_quantity
availableInventory.inventory_type=foundInventoryType

await availableInventoryRepository.save(availableInventory)

const inventoryTransaction=new InventoryTransaction()
inventoryTransaction.transaction_name="INVENTORY ADDITION"
inventoryTransaction.transaction_type="add"
inventoryTransaction.price=await availableInventory.initial_quantity*availableInventory.inventory_type.inventory_price
inventoryTransaction.available_inventory=availableInventory

await inventoryTransactionRepository.save(inventoryTransaction)
if(req.body.inventory_expense!=0){
const expense=new Expense()
expense.expense_name="INVENTORY EXPENSE"
expense.expense_amount=req.body.inventory_expense
expense.firm=foundFirm

await expenseRepository.save(expense)
}

foundFirm.current_capital=foundFirm.current_capital-(req.body.inventory_quantity*req.body.inventory_price+req.body.inventory_expense)
await firmRepository.save(foundFirm)

res.status(200).json({
    status:200,
    message:"Inventory saved successfully"
})
    }
    catch(err){
        next(err)
    }
}