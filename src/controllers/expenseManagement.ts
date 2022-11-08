import { User } from "../entity/User";
import { Firm } from "../entity/Firm";
import { Expense } from "../entity/Expense";
import { AppDataSource } from "../data-source";
import { JournalEntry } from "../entity/journalEntry";

export const getAllExpenses=async(req,res,next)=>{
    try{
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
     if(!foundExpense)
     return res.status(404).json({
        status:404,
        message:"Expense data not found"
     })
     res.status(200).json({
        status:200,
        foundExpense
     })
    }
    catch(err){
        next(err)
    }

    } 
 
export const createExpense=async(req,res,next)=>{
    try{
const journalEntryRepository=AppDataSource.getRepository(JournalEntry)
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
if(req.body.expense_amount > foundFirm.current_capital)
return res.status(412).json({
    "status":412,
    "message":"Current capital isn't enough to process the request."
})
let expense=new Expense()

expense.expense_name=req.body.expense_name
expense.expense_amount=req.body.expense_amount
expense.firm=foundFirm

await expenseRepository.save(expense)


foundFirm.current_capital-=req.body.expense_amount
await firmRepository.save(foundFirm)

const journalEntry=new JournalEntry()
journalEntry.account="ASSET(Cash)"
journalEntry.debit=0
journalEntry.credit=req.body.expense_amount
journalEntry.firm=foundFirm
journalEntry.transaction_reason="Paying cash for"+req.body.expense_name

await journalEntryRepository.save(journalEntry)

const journalEntrySecond=new JournalEntry()
journalEntrySecond.account="LIABILITY("+req.body.expense_name+")"
journalEntrySecond.debit=req.body.expense_amount
journalEntrySecond.credit=0
journalEntrySecond.firm=foundFirm
journalEntrySecond.transaction_reason="Expense of "+req.body.expense_name

await journalEntryRepository.save(journalEntrySecond)
return res.status(200).json({
    status:200,
    message:"Expense saved successfully"
})


    }
    catch(err){
        next(err)
    }
}
  
