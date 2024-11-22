import { Router } from "express";

import routesUser from "../../modules/users/routes/UsersRoutes";

const routes = Router();

routes.use("/users", routesUser);

// routes.use("/empresas", routesEmpresas);

// routes.use("/authenticate", routesAuth);

// routes.use("/produtos", routesProdutos);

// routes.use("/servicos", routesServicos);

export default module.exports = routes;
