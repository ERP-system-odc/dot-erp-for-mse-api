import express,{Router} from "express";
// import { DefineUsedInventory } from "../controllers/inventoryUsedManagment";
import { productDataValidation } from "../middleware/productValidation";

const productRouter:Router=express.Router()


productRouter.post('/defineUsedInventory',productDataValidation)

export {
    productRouter
}   