import { Firm } from "../entity/Firm";
import { User } from "../entity/User";
import { InventoryType } from "../entity/InventoryType";
import { Expense } from "../entity/Expense";
import { Income } from "../entity/Income";
import { Product } from "../entity/product";
import { AppDataSource } from "../data-source";
import { Like, MoreThan,Between, Raw} from "typeorm";
import { JournalEntry } from "../entity/journalEntry";
import {add,format, setDate} from "date-fns"

function subtractDays(numOfDays, date = new Date()) {
    date.setDate(date.getDate() - numOfDays);
  
    return date;
  }


export const provideChartInfo= async (req,res,next)=>{
try{
    const userRepository=AppDataSource.getRepository(User)
    const foundUser=await userRepository.findOneBy({id:req.user.id,is_starter:false})
    if(!foundUser)
    return res.status(404).json({
        "status":404,
        "message":"user isnot found"
    })
    const firmRepository=AppDataSource.getRepository(Firm)
    const expenseRepository=AppDataSource.getRepository(Expense)
    const incomeRepository=AppDataSource.getRepository(Income)
    const inventoryTypeRepository=AppDataSource.getRepository(InventoryType)
    const productRepository=AppDataSource.getRepository(Product)

    const foundFirm=await firmRepository.findOneBy({user:foundUser})
    const journalEntryRepository=await AppDataSource.getRepository(JournalEntry)

    if(!foundFirm)
return res.status(404).json({
    "status":404,
    "message":"firm isn't found"
})
    let foundProduct=await productRepository.find({
        where:{
            firm:foundFirm,
            product_quantity:MoreThan(0)
        }
    })
    let productSum:number=0
    let productPercentages=[]
    await foundProduct.forEach(element=>{
        productSum+=element.product_quantity
    })

    if(productSum==0){
        productPercentages=[]
    }
    else{
        await foundProduct.forEach(element=>{
            productPercentages.push({
                product_name:element.product_name,
                percentage:(element.product_quantity/productSum)*100
            })
        })
    }
    let  date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    let foundExpenses=await journalEntryRepository.findBy({ 
        created_at: Between(firstDay, lastDay),
        firm:foundFirm,
        transaction_type:Like("%{-EXPENSE-}%")  
    })
    let amountOfExpense=0;
    await foundExpenses.forEach(element=>{
        amountOfExpense+=element.debit
        amountOfExpense-=element.credit
    })
    let foundIncomes=await incomeRepository.findBy({ 
        created_at: Between(firstDay, lastDay),
        firm:foundFirm         
    })
    let amountOfIncome=0;
    await foundIncomes.forEach(element=>{
        amountOfIncome+=element.income_amount
    })
    let candidateAPI=[]

    let theDate=new Date()
    let newDate=new Date()
    let customizedDate=format(newDate, 'yyyy-MM-d').split("-")
    let datePlus=add(new Date(parseInt(customizedDate[0]), parseInt(customizedDate[1]), parseInt(customizedDate[2])), {
        years: 0,
        months: -1,
         days: 1
       })
    theDate.setHours(0,0,0,0)
    datePlus.setHours(0,0,0,0)
    let theDateArray=[]
    let datePlusArray=[]
    for(let x=0;x<5;x++){
        theDateArray.unshift(add(theDate,{
            years:0,
            days:x!=0? -x:0
        }))
        datePlusArray.unshift(add(datePlus,{
            years:0,
            days:x!=0? -x:0
        }))
      
    }


     
   
    let incomeArray=[]
    let expenseArray=[]
    let finalDateArray=[]
    
    
    for(let x=0;x<5;x++){

        let expenseData=await journalEntryRepository.findBy({
            created_at: Between(theDateArray[x],datePlusArray[x]),
                firm:foundFirm,
                transaction_type:Like("%{-EXPENSE-}%")  
        })
    
        let myFinalExpense=0
        if(expenseData.length!=0){
            
            for(let element of expenseData){
                myFinalExpense+=element.debit
                myFinalExpense-=element.credit
            }
            

        }
        let incomeData=await incomeRepository.findBy({
            created_at: Between(theDateArray[x],datePlusArray[x]),
                firm:foundFirm,
        })
        let myFinalIncome=0
        if(incomeData.length!=0){
            for(let element of incomeData){
                myFinalIncome+=element.income_amount
            }
        }
        expenseArray.push(myFinalExpense)
        incomeArray.push(myFinalIncome)
        finalDateArray.push(format(theDateArray[x],'yyyy-MM-d'))
     
        
    }


    for(let x=0;x<foundProduct.length;x++){
        let incomeRepositoryArray=await incomeRepository.find({
               where:{
                   income_name: Like(`%${foundProduct[x].product_name}%`)
               }
           })
        let incomeLength=incomeRepositoryArray.length;
           
           candidateAPI.push({
               count:incomeLength,
               name:foundProduct[x].product_name
           })
        
   }

    let maxProduct=""
    let maxCount=0;
    for(let x=0;x<candidateAPI.length;x++){
        if(candidateAPI[x].count>maxCount){
        
            maxCount=candidateAPI[x].count
            maxProduct=candidateAPI[x].name
        }
    }



  
    
 res.status(200).json({
        status:200,
        capital:foundFirm.current_capital,
        product_percentages:productPercentages,
        expense:amountOfExpense,
        income:amountOfIncome,
        max_sold_product:{
            name:maxProduct,
            count:maxCount

        },
        expenseArray:expenseArray,
        incomeArray:incomeArray,
        finalDateArray:finalDateArray
    })


    

}
catch(err){
    next(err)
}    

}