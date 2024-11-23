import { DataSource } from "typeorm";
import { User } from "./modules/users/schemas/schema";
import dotenv from "dotenv";
import { UrlShortener } from "./modules/urlshortener/schemas/schema";
dotenv.config();

const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  logging: true,
  entities: [User, UrlShortener],
});

export default AppDataSource;
