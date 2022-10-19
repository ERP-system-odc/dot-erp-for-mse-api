require("dotenv").config()
import express, { Request, Response } from "express"
import { AppDataSource } from "./data-source"
import {createConnection} from "typeorm";
import { User } from "./entity/User"
import { Inventory } from "./entity/inventory"
import * as BodyParser from 'body-parser'
import router from "./routes/inventoryRoute"

//const inv = new Inventory();


const authRouter=require("./routes/auth")
//const apiInventory=require("./routes/inventoryRoute")
const cookieParser=require("cookie-parser")
const app=express()
const cors=require('cors')
app.use(cors({
    origin:"*",
    credentials:true,
    optionScuccessStatus:200

}))




AppDataSource.initialize()
.then(async () => {

    console.log("database connected successfully")

})
.catch(error => console.log(error))

app.use(cookieParser())
app.use(express.json())
app.use(BodyParser.json())
//app.use('/api/inventory',inventoryRoute)
app.use("/api/auth",authRouter)

app.use((err,req:Request,res:Response,next)=>{
    const errorStatus=err.status || 500;
    const errorMessage=err.message || "Something went wrong!";
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack,
      });  


})

app.listen(process.env.PORT_NUMBER,()=>{
    console.log("Server connected successfully!")
})