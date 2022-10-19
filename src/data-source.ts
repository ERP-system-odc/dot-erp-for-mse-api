import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { Firm } from "./entity/Firm"
import { AvailableInventory } from "./entity/AvailableInventory"
import { Expense } from "./entity/Expense"
import { InventoryTransaction } from "./entity/InventoryTransaction"
import { InventoryType } from "./entity/InventoryType"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "mse_erp_db",
    synchronize: true,
    logging: false,
    entities: [User,Firm,AvailableInventory,Expense,InventoryTransaction,InventoryType],
    migrations: [],
    subscribers: [],
})
