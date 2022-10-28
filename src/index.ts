require("dotenv").config()
import express, { Request, Response,Application } from "express"
import { AppDataSource } from "./data-source"
import { authRouter } from "./routes/auth"
import { expenseRouter } from "./routes/expenseRoute"
import { firmDefinitionRouter } from "./routes/firmDefinition"
import { inventoryManagementRouter } from "./routes/inventoryManagement"
import { standardManagementRouter } from "./routes/standardManagement"
import { productRouter } from "./routes/product"

const cookieParser=require("cookie-parser")
const app:Application=express()
const cors=require('cors')
app.use(cors({
    origin:"*",
    credentials:true,
    optionSuccessStatus:200

}))


AppDataSource.initialize()
.then(async () => {

    console.log("database connected successfully")

})
.catch(error => console.log(error))

app.use(cookieParser())
app.use(express.json())
app.use("/api/auth",authRouter)
app.use("/api/firmDefinition",firmDefinitionRouter)
app.use("/api/inventory/",inventoryManagementRouter)
app.use("/api/standard/",standardManagementRouter)
<<<<<<< HEAD
app.use("/api/expense",expenseRouter)
=======
app.use("/api/product/",productRouter)

>>>>>>> ac1887fbe045993fb1664a6bef7ec9c99b35de53
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
