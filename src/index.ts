import "reflect-metadata"; // Necessário para o TypeORM
import AppDataSource from "./ormconfig";
import express from "express";

const app = express(); // Inicializa a aplicação Express
const PORT = 3000; // Porta onde o servidor será executado

// Middleware para parsear JSON no corpo da requisição
app.use(express.json());

// Rotas de exemplo
app.get("/", (req, res) => {
  res.send("Olá, mundo! Servidor Express com TypeORM está funcionando!");
});

// Inicializa a conexão com o banco de dados e inicia o servidor
AppDataSource.initialize()
  .then(() => {
    console.log("Conexão com o banco de dados foi bem-sucedida!");

    // Inicia o servidor Express
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Erro ao conectar ao banco de dados:", error);
  });
