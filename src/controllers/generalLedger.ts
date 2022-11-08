import { JournalEntry } from "../entity/journalEntry";
import { User } from "../entity/User";
import { Firm } from "../entity/Firm";
import { AppDataSource } from "../data-source";
import {Between, Double, Like, Raw} from "typeorm";
import {add,format} from "date-fns"
import { generalLedger } from "../entity/reportingMechanisms";


export const generateGeneralLedger=async (req,res,next)=>{
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

let assetGeneralLedger:any=[]

for(let x=0;x<journalEntryAssets.length;x++){
    let generalLedgerRecord=new generalLedger()
    generalLedgerRecord.transaction_date=format(journalEntryAssets[x].created_at,'yyyy-MM-d')
    generalLedgerRecord.description=journalEntryAssets[x].transaction_reason
    generalLedgerRecord.debit=journalEntryAssets[x].debit
    generalLedgerRecord.credit=journalEntryAssets[x].credit
    if(x==0){

        if(journalEntryAssets[x].debit==0){
            generalLedgerRecord.balance=-1*generalLedgerRecord.credit
        }
        else{
            generalLedgerRecord.balance=generalLedgerRecord.debit
        }

    }
    else{
        if(journalEntryAssets[x].debit==0){
       
            generalLedgerRecord.balance=assetGeneralLedger[x-1].balance-generalLedgerRecord.credit
        }
        else{
        
            generalLedgerRecord.balance=assetGeneralLedger[x-1].balance+generalLedgerRecord.debit
        }
        
    }
    assetGeneralLedger.push(generalLedgerRecord)
}

for(let element of assetGeneralLedger){
    element.balance=Math.abs(element.balance)
}

const journalEntryLiabilities=await journalEntryRepository.find({
    where:{
        firm:foundFirm,
        created_at:Between(firstDay,lastDay),
        account:Like("%LIABILITY%")
    }

})

let liabilityGeneralLedger:any=[]

for(let x=0;x<journalEntryLiabilities.length;x++){
    let generalLedgerRecord=new generalLedger()
    generalLedgerRecord.transaction_date=format(journalEntryLiabilities[x].created_at,'yyyy-MM-d')
    generalLedgerRecord.description=journalEntryLiabilities[x].transaction_reason
    generalLedgerRecord.debit=journalEntryLiabilities[x].debit
    generalLedgerRecord.credit=journalEntryLiabilities[x].credit
    if(x==0){

        if(journalEntryLiabilities[x].credit==0){
            generalLedgerRecord.balance=-1*generalLedgerRecord.debit
        }
        else{
            generalLedgerRecord.balance=generalLedgerRecord.credit
        }

    }
    else{
        if(journalEntryLiabilities[x].credit==0){
     
            generalLedgerRecord.balance=liabilityGeneralLedger[x-1].balance-generalLedgerRecord.debit
        }
        else{
        
            generalLedgerRecord.balance=liabilityGeneralLedger[x-1].balance+generalLedgerRecord.credit
        }
        
    }
    liabilityGeneralLedger.push(generalLedgerRecord)
}

for(let element of liabilityGeneralLedger){
    element.balance=Math.abs(element.balance)
}

res.status(200).json({
    status:200,
    asset_general_ledger:assetGeneralLedger,
    liability_general_ledger:liabilityGeneralLedger,
    assetFinalBalance:assetGeneralLedger[assetGeneralLedger.length-1].balance,
    liabilityFinalBalance:liabilityGeneralLedger[liabilityGeneralLedger.length-1].balance,
})

}
