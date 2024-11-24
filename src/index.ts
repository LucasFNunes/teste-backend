import "reflect-metadata";
import AppDataSource from "./ormconfig";
import express from "express";
import routes from "./shared/routes";
import swaggerUi from "swagger-ui-express";
import * as fs from "fs";
import * as yaml from "js-yaml";

// Carregar o arquivo Swagger YAML
const swaggerDocument = yaml.load(
  fs.readFileSync("./swagger.yaml", "utf8")
) as object;

const app = express();
const PORT = 3000; // Porta onde o servidor será executado

// Middleware para parsear JSON no corpo da requisição
app.use(express.json());
app.use(routes);

// Rota principal para verificar o funcionamento do servidor
app.get("/", (req, res) => {
  res.send("Olá, mundo! Servidor Express com TypeORM está funcionando!");
});

// Documentação Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Inicializa a conexão com o banco de dados e inicia o servidor
AppDataSource.initialize()
  .then(() => {
    console.log("Conexão com o banco de dados foi bem-sucedida!");

    // Inicia o servidor
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
      console.log(
        `Documentação disponível em http://localhost:${PORT}/api-docs`
      );
    });
  })
  .catch((error) => {
    console.error("Erro ao conectar ao banco de dados:", error);
  });
