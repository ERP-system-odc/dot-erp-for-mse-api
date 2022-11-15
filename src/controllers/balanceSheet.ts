import { JournalEntry } from "../entity/journalEntry";
import { User } from "../entity/User";
import { Firm } from "../entity/Firm";
import { AppDataSource } from "../data-source";
import {Between, Double, Like, Raw} from "typeorm";
import {add,format} from "date-fns"
import { BalanceSheet } from "../entity/reportingMechanisms";


export const generateBalanceSheet=async (req,res,next)=>{
    const journalEntryRepository=AppDataSource.getRepository(JournalEntry)
const userRepository=AppDataSource.getRepository(User)
const foundUser=await userRepository.findOneBy({id:req.user.id})
const firmRepository=AppDataSource.getRepository(Firm)

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


   
let journalEntryCash=await journalEntryRepository.find({
    where:{
        transaction_type:Like("%{-ASSET-}(Cash)%"),
        created_at:Between(firstDay,lastDay),
        firm:foundFirm
    }
})
if(journalEntryCash.length==0){
    res.status(404).json({
        message:"Data doesn't exist in the provided interval"
    })
}
let balanceSheetCashRecord=new BalanceSheet()
balanceSheetCashRecord.account_name="Cash"
balanceSheetCashRecord.account_balance=0

if(journalEntryCash.length!=0){

   
    let debitAssets=0;
    let creditAssets=0;
  
for(let x=0;x<journalEntryCash.length;x++){
    
    debitAssets+=journalEntryCash[x].debit
    creditAssets+=journalEntryCash[x].credit

}
balanceSheetCashRecord.account_balance=Math.abs(debitAssets-creditAssets)

}
let journalEntryInventory=await journalEntryRepository.find({
    where:{
        transaction_type:Like("%{-ASSET-}(Inventory)%"),
        created_at:Between(firstDay,lastDay),
        firm:foundFirm
    }
})
let balanceSheetInventoryRecord=new BalanceSheet()
balanceSheetInventoryRecord.account_name="Inventory"
balanceSheetInventoryRecord.account_balance=0

if(journalEntryInventory.length!=0){

   
    let debitInventory=0;
    let creditInventory=0;
  
for(let x=0;x<journalEntryInventory.length;x++){
    
    debitInventory+=journalEntryInventory[x].debit
    creditInventory+=journalEntryInventory[x].credit

}
balanceSheetInventoryRecord.account_balance=Math.abs(debitInventory-creditInventory)

}
let journalEntryExpenses=await journalEntryRepository.find({
    where:{
        transaction_type:Like("%{-EXPENSE-}%"),
        created_at:Between(firstDay,lastDay),
        firm:foundFirm
    }
})
let debitExpenses=0;
let creditExpenses=0;

for(let x=0;x<journalEntryExpenses.length;x++){

debitExpenses+=journalEntryExpenses[x].debit
creditExpenses+=journalEntryExpenses[x].credit

}
let finalExpense=Math.abs(debitExpenses-creditExpenses)
let journalEntryRevenues=await journalEntryRepository.find({
    where:{
        transaction_type:Like("%{-REVENUE-}%"),
        created_at:Between(firstDay,lastDay),
        firm:foundFirm
    }
})
let debitRevenues=0;
let creditRevenues=0;

for(let x=0;x<journalEntryRevenues.length;x++){

debitRevenues+=journalEntryRevenues[x].debit
creditRevenues+=journalEntryRevenues[x].credit

}
let finalRevenue=Math.abs(debitRevenues-creditRevenues)

let balanceSheetRetainedorAccumulatedRecord=new BalanceSheet()
if(finalExpense>finalRevenue){
  balanceSheetRetainedorAccumulatedRecord.account_name="Accumulated Losses"
}
else{
    balanceSheetRetainedorAccumulatedRecord.account_name="Retained Earnings"
}
balanceSheetRetainedorAccumulatedRecord.account_balance=Math.abs(finalExpense-finalRevenue)

let journalEntryStock=await journalEntryRepository.find({
    where:{
        transaction_type:Like("%{-EQUITY-}%"),
        created_at:Between(firstDay,lastDay),
        firm:foundFirm
    }
})
let balanceSheetStockRecord=new BalanceSheet()
balanceSheetStockRecord.account_name="Capital"
balanceSheetStockRecord.account_balance=0

if(journalEntryStock.length!=0){

   
    let debitStock=0;
    let creditStock=0;
  
for(let x=0;x<journalEntryStock.length;x++){
    
    debitStock+=journalEntryStock[x].debit
    creditStock+=journalEntryStock[x].credit

}
balanceSheetStockRecord.account_balance=Math.abs(debitStock-creditStock)














res.status(200).json({
    status:200,
    cash:balanceSheetCashRecord,
    inventory:balanceSheetInventoryRecord,
    assetSum:balanceSheetCashRecord.account_balance+balanceSheetInventoryRecord.account_balance,
    stock:balanceSheetStockRecord,
    earning_or_loss:balanceSheetRetainedorAccumulatedRecord,
    net_stock:balanceSheetStockRecord.account_balance-balanceSheetRetainedorAccumulatedRecord.account_balance
    
})

}
}