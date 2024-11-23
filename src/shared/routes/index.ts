import { Router } from "express";
import routesUser from "../../modules/users/routes/users.routes";
import routesAuth from "../../modules/authenticate/routes/authenticate.routes";
import routesUrlShortener from "../../modules/urlshortener/routes/urlshortener.routes";

const routes = Router();

routes.use("/users", routesUser);

routes.use("/authenticate", routesAuth);

routes.use("/urlshortener", routesUrlShortener);

export default routes;
