import { Router } from "express";
import { Request, Response } from "express";

import UsersController from "../controllers/UsersControllers";

const routesUser = Router();

const requestHandler = (_req: Request, res: Response) => {};

routesUser.post("/create", UsersController.create as typeof requestHandler);

export default routesUser;
