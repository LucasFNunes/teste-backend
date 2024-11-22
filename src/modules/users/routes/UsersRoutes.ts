import { Router } from "express";
import { Request, Response } from "express";
//import ensureAuth from "../../../shared/middlewares/EnsureAuthenticate";

import UsersController from "../controllers/UsersControllers";

const routesUser = Router();

const requestHandler  = (_req: Request, res: Response) => {}

routesUser.post('/create', UsersController.create as typeof requestHandler);

// routesUser.get("/findall", ensureAuth, UsersController.findAll);

// routesUser.get("/findfilter", ensureAuth, UsersController.findFilter);

// routesUser.patch("/update", ensureAuth, UsersController.update);

//routesUser.delete("/delete/:id", ensureAuth, UsersController.deleteUser);

// routesUser.post("/forgotPassword", UsersController.forgotPassword);

// routesUser.post("/resetPassword", UsersController.resetPassword);

export default routesUser;
