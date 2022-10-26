require("dotenv").config()
import express, { Request, Response,Application } from "express"
import { AppDataSource } from "./data-source"
import { authRouter } from "./routes/auth"
import { firmDefinitionRouter } from "./routes/firmDefinition"
import { inventoryManagementRouter } from "./routes/inventoryManagement"
import { standardManagementRouter } from "./routes/standardManagement"
import { usedInventoryRouter } from "./routes/usedInventory"
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
app.use("/api/usedInventory",usedInventoryRouter)
app.use("/api/standard/",standardManagementRouter)

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

