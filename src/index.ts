import "reflect-metadata"; 
import AppDataSource from "./ormconfig";
import express from "express";
import routes from "./shared/routes";

const app = express(); 
const PORT = 3000; // Porta onde o servidor será executado

// Middleware para parsear JSON no corpo da requisição
app.use(express.json());
app.use(routes);

// Rotas de exemplo
app.get("/", (req, res) => {
  res.send("Olá, mundo! Servidor Express com TypeORM está funcionando!");
});

// Inicializa a conexão com o banco de dados e inicia o servidor
AppDataSource.initialize()
  .then(() => {
    console.log("Conexão com o banco de dados foi bem-sucedida!");

    // Inicia o servidor
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Erro ao conectar ao banco de dados:", error);
  });
