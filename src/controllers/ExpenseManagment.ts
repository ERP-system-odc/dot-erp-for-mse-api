import { User } from "../entity/User";
import { Firm } from "../entity/Firm";
import { Expense } from "../entity/Expense";
import { AppDataSource } from "../data-source";

export const getAllExpenses=async(req,res,next)=>{
    
    const userRepository=AppDataSource.getRepository(User)
    const foundUser=await userRepository.findOneBy({id:req.user.id})
    const firmRepository=AppDataSource.getRepository(Firm)
    const expenseRepository=AppDataSource.getRepository(Expense)

    const foundFirm=await firmRepository.findOneBy({user:foundUser})

    if(!foundFirm)
return res.status(404).json({
    "status":404,
    "message":"firm isn't found"
})
const foundExpense=await expenseRepository.find({
    where:{
     firm:foundFirm
    }
 })
    } 
 
export const createExpense=async(req,res,next)=>{
    try{
const userRepository=AppDataSource.getRepository(User)
const foundUser=await userRepository.findOneBy({id:req.user.id})
const firmRepository=AppDataSource.getRepository(Firm)
const expenseRepository=AppDataSource.getRepository(Expense)
if(req.body.expense==null)
req.body.expense=0
const foundFirm=await firmRepository.findOneBy({user:foundUser})
if(!foundFirm)
return res.status(404).json({
    "status":404,
    "message":"firm isn't found"
})
if(req.body.expense_amount > foundFirm.current_capital)
return res.status(412).json({
    "status":412,
    "message":"Current capital isn't enough to process the request."
})
let expense=new Expense()
const foundExpense=await expenseRepository.findOneBy({firm:foundFirm,expense_name:req.body.expense_name})
if(!foundExpense){
expense.expense_name=req.body.expense_name
expense.expense_amount=req.body.expense_amount
expense.firm=foundFirm
console.log(expense)
await expenseRepository.save(expense)

if(req.body.expense!=0){
const expense=new Expense()
expense.expense_name="INVENTORY EXPENSE"
expense.expense_amount=req.body.inventory_expense
expense.firm=foundFirm
await expenseRepository.save(expense)}
foundFirm.current_capital=foundFirm.current_capital-(req.body.expense)
await firmRepository.save(foundFirm)
return res.status(200).json({
    status:200,
    message:"Expense saved successfully"
})
}
foundExpense.expense_name=req.body.expense_name
foundExpense.firm=foundFirm
foundExpense.expense_amount=req.body.expense_amount

if(req.body.expense!=0){
const expense=new Expense()
expense.expense_name="EXPENSE FOR BUSINESS"
expense.expense_amount=req.body.inventory_expense
expense.firm=foundFirm
await expenseRepository.save(expense)
}
foundFirm.current_capital=foundFirm.current_capital-(req.body.expense_amount)
await firmRepository.save(foundFirm)
res.status(200).json({
    status:200,
    message:"Expense saved successfully"
})
    }
    catch(err){
        next(err)
    }
}
  
