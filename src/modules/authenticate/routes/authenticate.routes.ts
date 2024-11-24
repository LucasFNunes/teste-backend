import { Router } from "express";
import { Request, Response } from "express";

import AuthenticateController from "../controllers/AuthenticateController";

const routesAuth = Router();

const requestHandler = (_req: Request, res: Response) => {};

routesAuth.post("/", AuthenticateController.auth as typeof requestHandler);

routesAuth.post(
  "/email",
  AuthenticateController.authEmail as typeof requestHandler
);

export default routesAuth;
