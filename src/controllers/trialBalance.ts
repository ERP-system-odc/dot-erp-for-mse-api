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
        account:Like("%ASSET%")
    }

})

    if(journalEntryAssets.length==0){
        return res.status(404).json({           
            status:404,
            message:"No records are found within this period of time"
        })
    }


let trialBalanceAssetRecord=new trialBalance()
    trialBalanceAssetRecord.account="Asset"
    let debitAssets=0;
    let creditAssets=0;
for(let x=0;x<journalEntryAssets.length;x++){
    
    debitAssets+=journalEntryAssets[x].debit
    creditAssets+=journalEntryAssets[x].credit

}
    trialBalanceAssetRecord.balance=debitAssets-creditAssets



const journalEntryLiabilities=await journalEntryRepository.find({
    where:{
        firm:foundFirm,
        created_at:Between(firstDay,lastDay),
        account:Like("%LIABILITY%")
    }

})



let trialBalanceLiabilityRecord=new trialBalance()
    trialBalanceLiabilityRecord.account="Liability"
    let debitLiabilities=0;
    let creditLiabilities=0;
for(let x=0;x<journalEntryAssets.length;x++){
    
    debitLiabilities+=journalEntryLiabilities[x].debit
    creditLiabilities+=journalEntryLiabilities[x].credit

}
    trialBalanceLiabilityRecord.balance=creditLiabilities-debitLiabilities

let trialBalanceCapitalRecord=new trialBalance()
trialBalanceCapitalRecord.account="Capital"
trialBalanceCapitalRecord.balance=trialBalanceAssetRecord.balance-trialBalanceLiabilityRecord.balance







res.status(200).json({
    status:200,
    asset:trialBalanceAssetRecord,
    liability:trialBalanceLiabilityRecord,
    capital:trialBalanceCapitalRecord
})

}
