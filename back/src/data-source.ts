import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { Purchase } from "./entity/Purchase"
import { Income } from "./entity/Income"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "user",
    password: "password",
    database: "restdatabase",
    synchronize: true,
    logging: false,
    entities: [User, Purchase, Income],
    migrations: [],
    subscribers: [],
})
