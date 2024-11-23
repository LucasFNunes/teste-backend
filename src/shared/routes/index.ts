import { Router } from "express";
import routesUser from "../../modules/users/routes/users.routes";
import routesAuth from "../../modules/authenticate/routes/authenticate.routes";

const routes = Router();

routes.use("/users", routesUser);

routes.use("/authenticate", routesAuth);

export default routes;
