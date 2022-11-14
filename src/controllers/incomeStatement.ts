import { JournalEntry } from "../entity/journalEntry";
import { User } from "../entity/User";
import { Firm } from "../entity/Firm";
import { AppDataSource } from "../data-source";
import {Between, Like,MoreThan} from "typeorm";
import { incomeStatement } from "../entity/reportingMechanisms";
import { Income } from "../entity/Income";


export const generateIncomeStatement=async (req,res,next)=>{
    const journalEntryRepository=AppDataSource.getRepository(JournalEntry)
const userRepository=AppDataSource.getRepository(User)
const foundUser=await userRepository.findOneBy({id:req.user.id})
const firmRepository=AppDataSource.getRepository(Firm)
const incomeRepository=AppDataSource.getRepository(Income)

const foundFirm=await firmRepository.findOneBy({user:foundUser})
if(!foundFirm)
return res.status(404).json({
    "status":404,
    "message":"firm isn't found"
})

let starting_date=req.params.starting_date.split("-")
let ending_date=req.params.ending_date.split("-")

let  date = new Date();
    let firstDay = new Date(parseInt(starting_date[0]), parseInt(starting_date[1])-1, parseInt(starting_date[2]));
    let lastDay = new Date(parseInt(ending_date[0]), parseInt(ending_date[1])-1, parseInt(ending_date[2])+1);
   
const incomeStatementRevenue=await incomeRepository.find({
    where:{
firm:foundFirm,
created_at:Between(firstDay,lastDay),
    }

})
let incomeRevenueSum=0

let incomeStatementRevenueRecord= new incomeStatement()
incomeStatementRevenueRecord.transaction_name="Sold products"

if(incomeStatementRevenue.length==0){
   
    incomeStatementRevenueRecord.balance=0
}
else{
    for(let element of incomeStatementRevenue){
        incomeRevenueSum+=element.income_amount
        
    }
 
    incomeStatementRevenueRecord.balance=incomeRevenueSum
}

let inventoryExpense=await journalEntryRepository.find({
    where:{
        transaction_type:Like("%{-EXPENSE-}(Inventory)%"),
        created_at:Between(firstDay,lastDay),
        

    }
})

let inventoryExpenseSum=0
let incomeStatementInventoryExpenseRecord=new incomeStatement()
incomeStatementInventoryExpenseRecord.transaction_name="Inventory Expense"
if(inventoryExpense.length!=0){
    for(let element of inventoryExpense){
        inventoryExpenseSum+=element.debit
    }
   incomeStatementInventoryExpenseRecord.balance=inventoryExpenseSum

}
else{
    incomeStatementInventoryExpenseRecord.balance=0
}
let otherExpenseSum=0
let otherExpense=await journalEntryRepository.find({
    where:{
        transaction_type:Like("%{-EXPENSE-}(Other)%"),
        created_at:Between(firstDay,lastDay),

    }
})


let incomeStatementOtherExpenseRecord=new incomeStatement()
incomeStatementOtherExpenseRecord.transaction_name="Other Expense"
if(otherExpense.length!=0){
    for(let element of otherExpense){
        otherExpenseSum+=element.debit
    }
   incomeStatementOtherExpenseRecord.balance=otherExpenseSum

}
else{
    incomeStatementOtherExpenseRecord.balance=0
}
let net_value=incomeStatementRevenueRecord.balance-(incomeStatementInventoryExpenseRecord.balance+incomeStatementOtherExpenseRecord.balance)
if(net_value<0){
    res.status(200).json({
        status:200,
        revenue:incomeStatementRevenueRecord,
        inventory_expense:incomeStatementInventoryExpenseRecord,
        other_expense:incomeStatementOtherExpenseRecord,
        expense_sum:incomeStatementInventoryExpenseRecord.balance+incomeStatementOtherExpenseRecord.balance,
        net_loss:Math.abs(net_value)
    
    
    })
}
else{
    res.status(200).json({
        status:200,
        revenue:incomeStatementRevenueRecord,
        inventory_expense:incomeStatementInventoryExpenseRecord,
        other_expense:incomeStatementOtherExpenseRecord,
        expense_sum:incomeStatementInventoryExpenseRecord.balance+incomeStatementOtherExpenseRecord.balance,
        net_income:net_value
    
    
    })
    
}
}
