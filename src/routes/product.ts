import express,{Router} from "express";
import { productDataValidation,updateProductValidation} from "../middleware/productValidation";
import { addToStock,sellStock,updateStock,getStock } from "../controllers/productManagement";
import { verifyToken,verifyUser } from "../middleware/tokenValidation";

const productRouter:Router=express.Router()

productRouter.get('/manage',verifyToken,verifyUser,getStock)
productRouter.post('/manage',verifyToken,verifyUser,productDataValidation,addToStock)
productRouter.post("/manage/:productID",verifyToken,verifyUser,sellStock)
productRouter.put('/manage/:productID',verifyToken,verifyUser,updateProductValidation,updateStock)


export {
    productRouter
}   