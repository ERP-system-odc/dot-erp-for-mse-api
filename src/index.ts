require("dotenv").config()
import express, { Request, Response } from "express"
import { AppDataSource } from "./data-source"
import { User } from "./entity/User"
const authRouter=require("./routes/auth")

const app=express()

AppDataSource.initialize()
.then(async () => {

    console.log("database connected successfully")

})
.catch(error => console.log(error))

app.use(express.json())
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