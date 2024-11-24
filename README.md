# teste-backend

Este projeto é uma API para encurtar URLs, acompanhar cliques e gerenciar URLs de forma eficiente. Ele utiliza Node.js, TypeScript, TypeORM, e um banco de dados PostgreSQL rodando em um contêiner Docker.

🚀 Como rodar o projeto localmente

Siga estas instruções para configurar e executar o projeto no seu ambiente local.
Pré-requisitos:

Certifique-se de ter instalado no seu sistema:

    Node.js (recomendado: versão LTS)
    Docker e Docker Compose
    Git (para clonar o repositório)

1. Clone o repositório

Clone o repositório para sua máquina local e navegue até a pasta do projeto:

git clone https://github.com/LucasFNunes/teste-backend.git
cd teste-backend

2. Configure o ambiente

Crie um arquivo .env na raiz do projeto com as seguintes variáveis:

# Configurações do banco de dados e JWT
```
DB_USER=admin
DB_PASSWORD=admin1
DB_DATABASE=urlshortener
JWT_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOiIiLCJuYW1lIjoiIn0.W6aPleOqaCCDKWEVPLjB92elM5NIIXZD5GItScSdqww
SENDGRID=APIKEY
```
⚠️O GIT ME IMPEDE DE SUBIR A API KEY DO SENDGRID NECESSARIA PARA QUE O ENVIO DE EMAIL SEJA REALIZADO, TENTAREI MANDAR EM UM JSON COM O PROJETO EM UM READ.ME MAS A NÃO AUTENTICAÇÃO POR EMAIL NÃO DEVE IMPACTAR NO FLUXO DO PROJETO, APENAS A NÃO AUTENTICAÇÃO POR LOGIN IMPACTA

# Porta em que o servidor rodará
PORT=3000

3. Instale as dependências

Use o gerenciador de pacotes npm ou yarn para instalar as dependências do projeto:

npm install

4. Suba o banco de dados no Docker

Inicie o banco de dados PostgreSQL usando Docker Compose:

docker-compose up -d

Isso criará um contêiner com o banco de dados PostgreSQL configurado para uso com o projeto.
5. Execute as migrações

Com o banco de dados em execução, aplique as migrações para criar as tabelas necessárias:

npm run typeorm migration:run

6. Inicie o servidor

Inicie o servidor localmente:

npm run dev

O servidor estará rodando em http://localhost:3000.

🛠️ Endpoints Disponíveis

🛠️ user

1. Criando um Usuario

    POST /urlshortener/shorten
    Body:

```{
	  "name":"Lucas",
	"email": "ferreiranuneslucas13@gmail.com",
	"password": "abc123"
}

```

    
Resposta:

    {
      "message": "Conta criada com sucesso!"
    }

    
🛠️  auth/login

GET /authenticate
    Body:
```
{
	"name":"Lucas",
	"email": "lucas@gmail.com",
	"password": "abc123"
}
```
Resposta:
```
{
	"token": "JWT",
	"user": {
		"name": "Lucas",
		"email": "lucas@gmail.com",
		"id": "273efe7b-3fc2-48cb-81b8-f34bf15b3a02"
	}
}
```
⚠️Caso o usuario desejar realizar qualquer requisição logado, deverá copiar o JWT que será gerado aqui e colocar como Bearer Token na requisição que deseja realizar logado. Este JWT expira depois de 1 hora!!

GET /authenticate/email
    Body:
```
{
	"code": "45edefc8-a4c2fca6"
}
```
Resposta:
```
{
	"message": "Email autenticado com sucesso!"
}
```
🛠️ urlshortener

1. Encurtar uma URL

    POST /urlshortener/shorten
    Body:
```
{
  "url": "https://exemplo.com"
}
```
Resposta:

    {
      "shortUrl": "http://localhost:3000/urlshortener/aZbKq7"
    }

2. Redirecionar usando o link encurtado

    GET /urlshortener/:shortId

    Abrir o link encurtado pelo endpoint acima no seu navegador com o servidor rodando irá te direcionar automaticamente para esta rota e consequentemente para o link original que foi encurtado.

3. Atualizar um link encurtado

    PATCH /urlshortener/:id
   Body:
   ```
    {
	   "url" : "https://www.google.com/"
    }
   ```
    Resposta:
```
    {
      "message": "Url atualizada com sucesso!"
    }
   ```
5. Deletar um link encurtado

    DELETE /urlshortener/:id
    Resposta:
```
    {
      "message": "Registro deletado com sucesso."
    }
```
🐳 Rodando o projeto com Docker

Se preferir, você pode rodar toda a aplicação (servidor + banco de dados) usando Docker Compose:

    Suba os serviços:

    docker-compose up --build

    Acesse a aplicação em http://localhost:3000.

🧪 Rodando os Testes

Execute os testes com o comando:

npx jest ou npx jest --coverage

🧪 Documentação com swagger

Execute a documentação com o servidor ativo pelo link:
```
http://localhost:3000/api-docs
```
📝 Incrementação

A Aplicação pode ser incrementada de diversar formas, dentre elas posso citar:

- Funcionalidades: Uma forma de editar, listar e até deletar os usuarios cadastrados, uma listagem especifica para os links mais clickados no geral, usuarios com o maior numero de links clickados, usuarios com a maior quantidade de links encurtados cadastrados

- Escalabilidade: Podemos passar toda a função de servidor/banco para gerenciadores mais complexos como AWS e assim trabalhando com serverless, sem precisar de infraestrutura dedicada, e banco mais complexos como Dynamo que escala automaticamente com base na demanda, backups automaticos, latencia reduzida, segurança aprimorada, entre outros.

- Segurança e Conformidade: Varias formas de segurança extra podem ser implemetadas como proteção contra bots e uso indevido, como CAPTCHAs e limites de requisições por IP. Além de formas de criptografia poderiam ser implementadas para garantir que os dados sensíveis estejam criptografados em trânsito (HTTPS).

📝 Contribuição

Sinta-se à vontade para abrir issues e pull requests. Toda contribuição é bem-vinda!
