
import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { Firm } from "./entity/Firm"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "mse_erp_db",
    synchronize: true,
    logging: false,
    entities: [User,Firm],
    migrations: [],
    subscribers: [],
})
