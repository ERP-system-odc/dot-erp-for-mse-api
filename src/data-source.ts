import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { Firm } from "./entity/Firm"
import { Expense } from "./entity/Expense"
import { InventoryTransaction } from "./entity/InventoryTransaction"
import { InventoryType } from "./entity/InventoryType"
import { Standard } from "./entity/Standard"
import { StandardSetting } from "./entity/StandardSettings"

import { InventoryUsed } from "./entity/inventoryUsed"
import { Product } from "./entity/product"
// import { WorkInProgress } from "./entity/workInProgress"
export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "mse_erp_db",
    synchronize: true,
    logging: false,
    entities: [User,Firm,Expense,InventoryTransaction,InventoryType,InventoryUsed,Product,Standard,StandardSetting],
    migrations: [],
    subscribers: [],
})
