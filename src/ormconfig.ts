
import { DataSource } from "typeorm";

const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost", 
  port: 5432, 
  username: "usuario", 
  password: "teste_back", 
  database: "banco",   
  synchronize: true,
  logging: true,
  entities: ["src/entity/*.ts"],
});

export default AppDataSource;
