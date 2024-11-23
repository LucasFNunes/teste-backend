import { Router } from "express";
import { Request, Response } from "express";

import UrlShortenerController from "../controllers/UrlShortenerController";

const routesUrlShortener = Router();

const requestHandler = (_req: Request, res: Response) => {};

routesUrlShortener.post(
  "/",
  UrlShortenerController.create as typeof requestHandler
);

routesUrlShortener.get(
  "/:shortId",
  UrlShortenerController.redirectUrl as typeof requestHandler
);

export default routesUrlShortener;
