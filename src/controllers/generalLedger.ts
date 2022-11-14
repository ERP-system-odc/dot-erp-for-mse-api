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
        transaction_type:Like("%{-ASSET-}%")
        
    }

})

 

let assetGeneralLedger:any=[]
if(journalEntryAssets.length!=0){
    for(let x=0;x<journalEntryAssets.length;x++){
        let generalLedgerRecord=new generalLedger()
        generalLedgerRecord.transaction_date=format(journalEntryAssets[x].created_at,'yyyy-MM-d')
        generalLedgerRecord.description=journalEntryAssets[x].transaction_reason
        generalLedgerRecord.debit=journalEntryAssets[x].debit
        generalLedgerRecord.credit=journalEntryAssets[x].credit
        if(x==0){
    
            if(journalEntryAssets[x].debit==0){
                generalLedgerRecord.balance_debit=0
                generalLedgerRecord.balance_credit=generalLedgerRecord.credit
            }
            else{
                generalLedgerRecord.balance_debit=generalLedgerRecord.debit
                generalLedgerRecord.balance_credit=0
            }
    
        }
    
        else{
            if(journalEntryAssets[x].debit==0){
                if(assetGeneralLedger[x-1].balance_credit>0){
                    generalLedgerRecord.balance_credit=assetGeneralLedger[x-1].balance_credit+generalLedgerRecord.credit
                    generalLedgerRecord.balance_debit=0
                }
                else if(assetGeneralLedger[x-1].balance_credit==0 && assetGeneralLedger[x-1].balance_debit>0){
                    if(assetGeneralLedger[x-1].balance_debit>journalEntryAssets[x].credit){
                        generalLedgerRecord.balance_debit=assetGeneralLedger[x-1].balance_debit-journalEntryAssets[x].credit
                        generalLedgerRecord.balance_credit=0
                    }
                    else{
                        generalLedgerRecord.balance_credit=journalEntryAssets[x].credit-assetGeneralLedger[x-1].balance_debit
                        generalLedgerRecord.balance_debit=0
                    }
                }
                else if(assetGeneralLedger[x-1].balance_credit==0 && assetGeneralLedger[x-1].balance_debit==0){
                    generalLedgerRecord.balance_credit=journalEntryAssets[x].credit
                    generalLedgerRecord.balance_debit=0
                }
           
               
            }
            else{
                if(assetGeneralLedger[x-1].balance_debit>0){
                    generalLedgerRecord.balance_debit=assetGeneralLedger[x-1].balance_debit+generalLedgerRecord.debit
                    generalLedgerRecord.balance_credit=0
                }
                else if(assetGeneralLedger[x-1].balance_debit==0 && assetGeneralLedger[x-1].balance_credit>0){
                    if(assetGeneralLedger[x-1].balance_credit>journalEntryAssets[x].debit){
                        generalLedgerRecord.balance_credit=assetGeneralLedger[x-1].balance_credit-journalEntryAssets[x].debit
                        generalLedgerRecord.balance_debit=0
                    }
                    else{
                        generalLedgerRecord.balance_debit=journalEntryAssets[x].debit-assetGeneralLedger[x-1].balance_credit
                        generalLedgerRecord.balance_credit=0
                    }
                }
                else if(assetGeneralLedger[x-1].balance_credit==0 && assetGeneralLedger[x-1].balance_debit==0){
                    generalLedgerRecord.balance_debit=journalEntryAssets[x].debit
                    generalLedgerRecord.balance_credit=0
                }
           
                
            }
            
        }
        assetGeneralLedger.push(generalLedgerRecord)
    }

}




const journalEntryLiabilities=await journalEntryRepository.find({
    where:{
        firm:foundFirm,
        created_at:Between(firstDay,lastDay),
        transaction_type:Like("%{-LIABILITY-}%")
    }

})


let liabilityGeneralLedger:any=[]
if(journalEntryLiabilities.length!=0){
    for(let x=0;x<journalEntryLiabilities.length;x++){
        let generalLedgerRecord=new generalLedger()
        generalLedgerRecord.transaction_date=format(journalEntryLiabilities[x].created_at,'yyyy-MM-d')
        generalLedgerRecord.description=journalEntryLiabilities[x].transaction_reason
        generalLedgerRecord.debit=journalEntryLiabilities[x].debit
        generalLedgerRecord.credit=journalEntryLiabilities[x].credit
        if(x==0){
    
            if(journalEntryLiabilities[x].credit==0){
                generalLedgerRecord.balance_debit=generalLedgerRecord.debit
                generalLedgerRecord.balance_credit=0
            }
            else{
                generalLedgerRecord.balance_credit=generalLedgerRecord.credit
                generalLedgerRecord.balance_debit=0
            }
    
        }
        else{
            if(journalEntryLiabilities[x].credit==0){
                if(liabilityGeneralLedger[x-1].balance_debit>0){
                    generalLedgerRecord.balance_debit=liabilityGeneralLedger[x-1].balance_debit+generalLedgerRecord.debit
                    generalLedgerRecord.balance_credit=0
                }
                else if(liabilityGeneralLedger[x-1].balance_debit==0 && liabilityGeneralLedger[x-1].balance_debit>0){
                    if(journalEntryLiabilities[x].debit>liabilityGeneralLedger[x-1].balance_credit){
                        generalLedgerRecord.balance_debit=journalEntryLiabilities[x].debit-liabilityGeneralLedger[x-1].balance_credit
                        generalLedgerRecord.balance_credit=0
                    }
                    else{
                        generalLedgerRecord.balance_debit=0
                        generalLedgerRecord.balance_credit=liabilityGeneralLedger[x-1].balance_credit-journalEntryLiabilities[x].debit
    
                    }
                        
                }
                else if(liabilityGeneralLedger[x-1].balance_debit==0 && liabilityGeneralLedger[x-1].balance_credit==0){
                    generalLedgerRecord.balance_debit=journalEntryLiabilities[x].debit
                    generalLedgerRecord.balance_credit=0
                }
               
            }
            else{
                
                if(liabilityGeneralLedger[x-1].balance_credit>0){
                    generalLedgerRecord.balance_credit=liabilityGeneralLedger[x-1].balance_credit+generalLedgerRecord.credit
                    generalLedgerRecord.balance_debit=0
                }
                else if(liabilityGeneralLedger[x-1].balance_credit==0 && liabilityGeneralLedger[x-1].balance_debit>0  ){
                    if(journalEntryLiabilities[x].credit>liabilityGeneralLedger[x-1].balance_debit){
                        generalLedgerRecord.balance_credit=journalEntryLiabilities[x].credit-liabilityGeneralLedger[x-1].balance_debit
                        generalLedgerRecord.balance_debit=0
                    }
                    else{
                        generalLedgerRecord.balance_credit=0
                        generalLedgerRecord.balance_debit=liabilityGeneralLedger[x-1].balance_debit-journalEntryLiabilities[x].credit
    
                    }
                        
                }
                else if(liabilityGeneralLedger[x-1].balance_debit==0 && liabilityGeneralLedger[x-1].balance_credit==0){
                    generalLedgerRecord.balance_debit=0
                    generalLedgerRecord.balance_credit=journalEntryLiabilities[x].credit
                }
    
            }
            
        }
        liabilityGeneralLedger.push(generalLedgerRecord)
    }
}




const journalEntryExpenses=await journalEntryRepository.find({
    where:{
        firm:foundFirm,
        created_at:Between(firstDay,lastDay),
        transaction_type:Like("%{-EXPENSE-}%")
        
    }

})



let expenseGeneralLedger:any=[]
if(journalEntryExpenses.length!=0){
    for(let x=0;x<journalEntryExpenses.length;x++){
        let generalLedgerRecord=new generalLedger()
        generalLedgerRecord.transaction_date=format(journalEntryExpenses[x].created_at,'yyyy-MM-d')
        generalLedgerRecord.description=journalEntryExpenses[x].transaction_reason
        generalLedgerRecord.debit=journalEntryExpenses[x].debit
        generalLedgerRecord.credit=journalEntryExpenses[x].credit
        if(x==0){
    
            if(journalEntryExpenses[x].debit==0){
                generalLedgerRecord.balance_debit=0
                generalLedgerRecord.balance_credit=generalLedgerRecord.credit
            }
            else{
                generalLedgerRecord.balance_debit=generalLedgerRecord.debit
                generalLedgerRecord.balance_credit=0
            }
    
        }
    
        else{
            if(journalEntryExpenses[x].debit==0){
                if(expenseGeneralLedger[x-1].balance_credit>0){
                    generalLedgerRecord.balance_credit=expenseGeneralLedger[x-1].balance_credit+generalLedgerRecord.credit
                    generalLedgerRecord.balance_debit=0
                }
                else if(expenseGeneralLedger[x-1].balance_credit==0 && expenseGeneralLedger[x-1].balance_debit>0){
                    if(expenseGeneralLedger[x-1].balance_debit>journalEntryExpenses[x].credit){
                        generalLedgerRecord.balance_debit=expenseGeneralLedger[x-1].balance_debit-journalEntryExpenses[x].credit
                        generalLedgerRecord.balance_credit=0
                    }
                    else{
                        generalLedgerRecord.balance_credit=journalEntryExpenses[x].credit-expenseGeneralLedger[x-1].balance_debit
                        generalLedgerRecord.balance_debit=0
                    }
                }
                else if(expenseGeneralLedger[x-1].balance_credit==0 && expenseGeneralLedger[x-1].balance_debit==0){
                    generalLedgerRecord.balance_credit=journalEntryExpenses[x].credit
                    generalLedgerRecord.balance_debit=0
                }
           
               
            }
            else{
                if(expenseGeneralLedger[x-1].balance_debit>0){
                    generalLedgerRecord.balance_debit=expenseGeneralLedger[x-1].balance_debit+generalLedgerRecord.debit
                    generalLedgerRecord.balance_credit=0
                }
                else if(expenseGeneralLedger[x-1].balance_debit==0 && expenseGeneralLedger[x-1].balance_credit>0){
                    if(expenseGeneralLedger[x-1].balance_credit>journalEntryExpenses[x].debit){
                        generalLedgerRecord.balance_credit=expenseGeneralLedger[x-1].balance_credit-journalEntryExpenses[x].debit
                        generalLedgerRecord.balance_debit=0
                    }
                    else{
                        generalLedgerRecord.balance_debit=journalEntryExpenses[x].debit-expenseGeneralLedger[x-1].balance_credit
                        generalLedgerRecord.balance_credit=0
                    }
                }
                else if(expenseGeneralLedger[x-1].balance_credit==0 && expenseGeneralLedger[x-1].balance_debit==0){
                    generalLedgerRecord.balance_debit=journalEntryExpenses[x].debit
                    generalLedgerRecord.balance_credit=0
                }
           
                
            }
            
        }
        expenseGeneralLedger.push(generalLedgerRecord)
    }
    
    
}


const journalEntryRevenues=await journalEntryRepository.find({
    where:{
        firm:foundFirm,
        created_at:Between(firstDay,lastDay),
        account:Like("%REVENUE%")
    }

})


let revenueGeneralLedger:any=[]
if(journalEntryRevenues.length!=0){
    for(let x=0;x<journalEntryRevenues.length;x++){
        let generalLedgerRecord=new generalLedger()
        generalLedgerRecord.transaction_date=format(journalEntryRevenues[x].created_at,'yyyy-MM-d')
        generalLedgerRecord.description=journalEntryRevenues[x].transaction_reason
        generalLedgerRecord.debit=journalEntryRevenues[x].debit
        generalLedgerRecord.credit=journalEntryRevenues[x].credit
        if(x==0){
    
            if(journalEntryRevenues[x].credit==0){
                generalLedgerRecord.balance_debit=generalLedgerRecord.debit
                generalLedgerRecord.balance_credit=0
            }
            else{
                generalLedgerRecord.balance_credit=generalLedgerRecord.credit
                generalLedgerRecord.balance_debit=0
            }
    
        }
        else{
            if(journalEntryRevenues[x].credit==0){
                if(revenueGeneralLedger[x-1].balance_debit>0){
                    generalLedgerRecord.balance_debit=revenueGeneralLedger[x-1].balance_debit+generalLedgerRecord.debit
                    generalLedgerRecord.balance_credit=0
                }
                else if(revenueGeneralLedger[x-1].balance_debit==0 && revenueGeneralLedger[x-1].balance_credit>0){
                    if(journalEntryRevenues[x].debit>revenueGeneralLedger[x-1].balance_credit){
                        generalLedgerRecord.balance_debit=journalEntryRevenues[x].debit-revenueGeneralLedger[x-1].balance_credit
                        generalLedgerRecord.balance_credit=0
                    }
                    else{
                        generalLedgerRecord.balance_debit=0
                        generalLedgerRecord.balance_credit=revenueGeneralLedger[x-1].balance_credit-journalEntryRevenues[x].debit
    
                    }
                        
                }
                else if(revenueGeneralLedger[x-1].balance_debit==0 && revenueGeneralLedger[x-1].balance_credit==0){
                    generalLedgerRecord.balance_debit=journalEntryRevenues[x].debit
                    generalLedgerRecord.balance_credit=0
                }
               
            }
            else{
                
                if(revenueGeneralLedger[x-1].balance_credit>0){
                    generalLedgerRecord.balance_credit=revenueGeneralLedger[x-1].balance_credit+generalLedgerRecord.credit
                    generalLedgerRecord.balance_debit=0
                }
                else if(revenueGeneralLedger[x-1].balance_credit==0 && revenueGeneralLedger[x-1].balance_debit>0){
                    if(journalEntryRevenues[x].credit>revenueGeneralLedger[x-1].balance_debit){
                        generalLedgerRecord.balance_credit=journalEntryRevenues[x].credit-revenueGeneralLedger[x-1].balance_debit
                        generalLedgerRecord.balance_debit=0
                    }
                    else{
                        generalLedgerRecord.balance_credit=0
                        generalLedgerRecord.balance_debit=revenueGeneralLedger[x-1].balance_debit-journalEntryRevenues[x].credit
    
                    }
                        
                }
                else if(revenueGeneralLedger[x-1].balance_debit==0 && revenueGeneralLedger[x-1].balance_credit==0){
                    generalLedgerRecord.balance_debit=0
                    generalLedgerRecord.balance_credit=journalEntryRevenues[x].credit
                }
    
            }
            
        }
        revenueGeneralLedger.push(generalLedgerRecord)
    }
    

}

const journalEntryCapital=await journalEntryRepository.find({
    where:{
        firm:foundFirm,
        created_at:Between(firstDay,lastDay),
        transaction_type:Like("%{-EQUITY-}%")
    }

})


let capitalGeneralLedger:any=[]
if(journalEntryCapital.length!=0){
    for(let x=0;x<journalEntryCapital.length;x++){
        let generalLedgerRecord=new generalLedger()
        generalLedgerRecord.transaction_date=format(journalEntryCapital[x].created_at,'yyyy-MM-d')
        generalLedgerRecord.description=journalEntryCapital[x].transaction_reason
        generalLedgerRecord.debit=journalEntryCapital[x].debit
        generalLedgerRecord.credit=journalEntryCapital[x].credit
        if(x==0){
    
            if(journalEntryCapital[x].credit==0){
                generalLedgerRecord.balance_debit=generalLedgerRecord.debit
                generalLedgerRecord.balance_credit=0
            }
            else{
                generalLedgerRecord.balance_credit=generalLedgerRecord.credit
                generalLedgerRecord.balance_debit=0
            }
    
        }
        else{
            if(journalEntryCapital[x].credit==0){
                if(capitalGeneralLedger[x-1].balance_debit>0){
                    generalLedgerRecord.balance_debit=capitalGeneralLedger[x-1].balance_debit+generalLedgerRecord.debit
                    generalLedgerRecord.balance_credit=0
                }
                else if(capitalGeneralLedger[x-1].balance_debit==0 && capitalGeneralLedger[x-1].balance_debit>0){
                    if(journalEntryCapital[x].debit>capitalGeneralLedger[x-1].balance_credit){
                        generalLedgerRecord.balance_debit=journalEntryCapital[x].debit-capitalGeneralLedger[x-1].balance_credit
                        generalLedgerRecord.balance_credit=0
                    }
                    else{
                        generalLedgerRecord.balance_debit=0
                        generalLedgerRecord.balance_credit=capitalGeneralLedger[x-1].balance_credit-journalEntryCapital[x].debit
    
                    }
                        
                }
                else if(capitalGeneralLedger[x-1].balance_debit==0 && capitalGeneralLedger[x-1].balance_credit==0){
                    generalLedgerRecord.balance_debit=journalEntryCapital[x].debit
                    generalLedgerRecord.balance_credit=0
                }
               
            }
            else{
                
                if(capitalGeneralLedger[x-1].balance_credit>0){
                    generalLedgerRecord.balance_credit=capitalGeneralLedger[x-1].balance_credit+generalLedgerRecord.credit
                    generalLedgerRecord.balance_debit=0
                }
                else if(capitalGeneralLedger[x-1].balance_credit==0 && capitalGeneralLedger[x-1].balance_debit>0  ){
                    if(journalEntryCapital[x].credit>capitalGeneralLedger[x-1].balance_debit){
                        generalLedgerRecord.balance_credit=journalEntryCapital[x].credit-capitalGeneralLedger[x-1].balance_debit
                        generalLedgerRecord.balance_debit=0
                    }
                    else{
                        generalLedgerRecord.balance_credit=0
                        generalLedgerRecord.balance_debit=capitalGeneralLedger[x-1].balance_debit-journalEntryCapital[x].credit
    
                    }
                        
                }
                else if(capitalGeneralLedger[x-1].balance_debit==0 && capitalGeneralLedger[x-1].balance_credit==0){
                    generalLedgerRecord.balance_debit=0
                    generalLedgerRecord.balance_credit=journalEntryCapital[x].credit
                }
    
            }
            
        }
        capitalGeneralLedger.push(generalLedgerRecord)
    }
}








res.status(200).json({
    status:200,
    asset_general_ledger:assetGeneralLedger,
    expense_general_ledger:expenseGeneralLedger,
    revenue_general_ledger:revenueGeneralLedger,
    liabilityGeneralLedger:liabilityGeneralLedger,
    capitalGeneralLedger:capitalGeneralLedger
    // liability_general_ledger:liabilityGeneralLedger,
    // assetFinalBalance:assetGeneralLedger[assetGeneralLedger.length-1].balance,
    // liabilityFinalBalance:liabilityGeneralLedger[liabilityGeneralLedger.length-1].balance,
})

}
