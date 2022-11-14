import { JournalEntry } from "../entity/journalEntry";
import { User } from "../entity/User";
import { Firm } from "../entity/Firm";
import { AppDataSource } from "../data-source";
import {Between, Double, Like, Raw} from "typeorm";
import {add,format} from "date-fns"
import { trialBalance } from "../entity/reportingMechanisms";


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
let balanceSheetCashRecord=new trialBalance()
balanceSheetCashRecord.account="Asset"
balanceSheetCashRecord.debit=0
balanceSheetCashRecord.credit=0
if(journalEntryCash.length!=0){

   
    let debitAssets=0;
    let creditAssets=0;
  
for(let x=0;x<journalEntryCash.length;x++){
    
    debitAssets+=journalEntryCash[x].debit
    creditAssets+=journalEntryCash[x].credit

}
if(debitAssets>creditAssets){
    balanceSheetCashRecord.debit=debitAssets-creditAssets
    balanceSheetCashRecord.credit=0
}
else{
    balanceSheetCashRecord.debit=0
    balanceSheetCashRecord.credit=creditAssets-debitAssets
}
}




res.status(200).json({
    status:200,
    
})

}
