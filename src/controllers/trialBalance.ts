import { JournalEntry } from "../entity/journalEntry";
import { User } from "../entity/User";
import { Firm } from "../entity/Firm";
import { AppDataSource } from "../data-source";
import {Between, Double, Like, Raw} from "typeorm";
import {add,format} from "date-fns"
import { trialBalance } from "../entity/reportingMechanisms";


export const generateTrialBalance=async (req,res,next)=>{
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
   
const journalEntryAssets=await journalEntryRepository.find({
    where:{
        firm:foundFirm,
        created_at:Between(firstDay,lastDay),
        transaction_type:Like("%ASSET%")
    }

})
console.log(journalEntryAssets)

if(journalEntryAssets.length==0){
    return res.status(404).json({
        "message":"Trial Balance cannot be generated within this date interval"
    })
}
let trialBalanceAssetRecord=new trialBalance()
trialBalanceAssetRecord.account="Asset"
trialBalanceAssetRecord.debit=0
trialBalanceAssetRecord.credit=0
if(journalEntryAssets.length!=0){

   
    let debitAssets=0;
    let creditAssets=0;
  
for(let x=0;x<journalEntryAssets.length;x++){
    
    debitAssets+=journalEntryAssets[x].debit
    creditAssets+=journalEntryAssets[x].credit

}
if(debitAssets>creditAssets){
    trialBalanceAssetRecord.debit=debitAssets-creditAssets
    trialBalanceAssetRecord.credit=0
}
else{
    trialBalanceAssetRecord.debit=0
    trialBalanceAssetRecord.credit=creditAssets-debitAssets
}
}

const journalEntryLiabilities=await journalEntryRepository.find({
    where:{
        firm:foundFirm,
        created_at:Between(firstDay,lastDay),
       transaction_type:Like("%LIABILITY%")
    }

})

let trialBalanceLiabilityRecord=new trialBalance()
trialBalanceLiabilityRecord.account="Liability"
let debitLiabilities=0;
let creditLiabilities=0;
trialBalanceLiabilityRecord.debit=0
trialBalanceLiabilityRecord.credit=0

if(journalEntryLiabilities.length!=0){
  

for(let x=0;x<journalEntryLiabilities.length;x++){
    
    debitLiabilities+=journalEntryLiabilities[x].debit
    creditLiabilities+=journalEntryLiabilities[x].credit

}
if(debitLiabilities>creditLiabilities){
    trialBalanceLiabilityRecord.debit=debitLiabilities-creditLiabilities
    trialBalanceLiabilityRecord.credit=0
}
else{
    trialBalanceLiabilityRecord.debit=0
    trialBalanceLiabilityRecord.credit=creditLiabilities-debitLiabilities
}
}
   

const journalEntryCapitals=await journalEntryRepository.find({
    where:{
        firm:foundFirm,
       transaction_type:Like("%EQUITY%")
    }

})


let trialBalanceCapitalRecord=new trialBalance()
trialBalanceCapitalRecord.account="Capital"
let debitCapital=0;
let creditCapital=0;
trialBalanceCapitalRecord.debit=0
trialBalanceCapitalRecord.credit=0

if(journalEntryCapitals.length!=0){
  

for(let x=0;x<journalEntryCapitals.length;x++){
    
    debitCapital+=journalEntryCapitals[x].debit
    creditCapital+=journalEntryCapitals[x].credit

}
if(debitCapital>creditCapital){
    trialBalanceCapitalRecord.debit=debitCapital-creditCapital
    trialBalanceCapitalRecord.credit=0
}
else{
    trialBalanceCapitalRecord.debit=0
    trialBalanceCapitalRecord.credit=creditCapital-debitCapital
}
}

const journalEntryExpenses=await journalEntryRepository.find({
    where:{
        firm:foundFirm,
        account:Like("%EXPENSE%"),
        
    }

})


let trialBalanceExpenseRecord=new trialBalance()
trialBalanceExpenseRecord.account="Expense"
trialBalanceExpenseRecord.debit=0
trialBalanceExpenseRecord.credit=0
let debitExpenses=0;
    let creditExpenses=0;

if(journalEntryExpenses.length!=0){

   
for(let x=0;x<journalEntryExpenses.length;x++){
    
    debitExpenses+=journalEntryExpenses[x].debit
    creditExpenses+=journalEntryExpenses[x].credit

}
if(debitExpenses>creditExpenses){
    trialBalanceExpenseRecord.debit=debitExpenses-creditExpenses
    trialBalanceExpenseRecord.credit=0
}
else{
    trialBalanceExpenseRecord.debit=0
    trialBalanceExpenseRecord.credit=creditExpenses-debitExpenses
}
}
const journalEntryRevenues=await journalEntryRepository.find({
    where:{
        firm:foundFirm,
        transaction_type:Like("%REVENUE%"),
        created_at:Between(firstDay,lastDay),

        
    }

})


let trialBalanceRevenueRecord=new trialBalance()
trialBalanceRevenueRecord.account="Revenue"
trialBalanceRevenueRecord.debit=0
trialBalanceRevenueRecord.credit=0


if(journalEntryRevenues.length!=0){

    let debitRevenues=0;
    let creditRevenues=0;
for(let x=0;x<journalEntryRevenues.length;x++){
    
    debitRevenues+=journalEntryRevenues[x].debit
    creditRevenues+=journalEntryRevenues[x].credit

}
if(debitRevenues>creditRevenues){
    trialBalanceRevenueRecord.debit=debitRevenues-creditRevenues
    trialBalanceRevenueRecord.credit=0
}
else{
    trialBalanceRevenueRecord.debit=0
    trialBalanceRevenueRecord.credit=creditRevenues-debitRevenues
}
}











res.status(200).json({
    status:200,
    asset:trialBalanceAssetRecord,
    liability:trialBalanceLiabilityRecord,
    capital:trialBalanceCapitalRecord,
    expense:trialBalanceExpenseRecord,
    revenue:trialBalanceRevenueRecord,
    debit_sum:trialBalanceAssetRecord.debit+trialBalanceLiabilityRecord.debit+trialBalanceCapitalRecord.debit+trialBalanceExpenseRecord.debit+trialBalanceRevenueRecord.debit,
    credit_sum:trialBalanceAssetRecord.credit+trialBalanceLiabilityRecord.credit+trialBalanceCapitalRecord.credit+trialBalanceExpenseRecord.credit+trialBalanceRevenueRecord.credit
})

}
