import { Firm } from "../entity/Firm";
import { User } from "../entity/User";
import { InventoryType } from "../entity/InventoryType";
import { Expense } from "../entity/Expense";
import { Income } from "../entity/Income";
import { Product } from "../entity/product";
import { AppDataSource } from "../data-source";
import { Like, MoreThan,Between} from "typeorm";
import moment from "moment";
import { count } from "console";
import { JournalEntry } from "../entity/journalEntry";
import {add,format} from "date-fns"


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
    let lastFiveExpenses=[]

    if(foundExpenses.length>5){
        lastFiveExpenses=await journalEntryRepository.find({
            where:{
                created_at: Between(firstDay, lastDay),
                firm:foundFirm,
                transaction_type:Like("%{-EXPENSE-}%")  
            },
            skip:foundExpenses.length-5,
            take:5
        })
    }
    else{
        lastFiveExpenses=await journalEntryRepository.find({
            where:{
                created_at: Between(firstDay, lastDay),
                firm:foundFirm,
                transaction_type:Like("%{-EXPENSE-}%")  
            }
        })
    }

     
    let capitalExpenseGraph:any=[]
    if(lastFiveExpenses.length!=0){
        for(let element of lastFiveExpenses){
            let theDate=format(element.created_at, 'yyyy-MM-d')
            let fDay = new Date(parseInt(theDate[0]), parseInt(theDate[1])-1, parseInt(theDate[2]));
            let nextDay=new Date(parseInt(theDate[0]),parseInt(theDate[1])-1,parseInt(theDate[2])+1)
        let theIncome=await incomeRepository.find({
            where:{
                created_at:Between(fDay,nextDay),
                firm:foundFirm
            }
        })
        let incomeSum:number=0
        if(theIncome.length!=0){
            for(let element2 of theIncome){
                incomeSum+=element2.income_amount
            }
        }
        capitalExpenseGraph.push({
            expense:Math.abs(element.debit-element.credit),
            date:theDate,
            income:incomeSum
        })
        }
    }
    console.log(lastFiveExpenses)

    // foundProduct.forEach(async element=>{
      
    //     let incomeRepositoryArray=await incomeRepository.find({
    //         where:{
    //             income_name: Like(`%${element.product_name}%`)
    //         }
    //     })
     
    //     let incomeLength=incomeRepositoryArray.length;
        
    //     candidateAPI.push({
    //         count:incomeLength,
    //         name:element.product_name
    //     })
              
        
    // })
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
        income_expense_graph:capitalExpenseGraph
    })


    

}
catch(err){
    next(err)
}    

}