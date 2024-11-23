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

routesUrlShortener.get(
  "/findAll/url",
  UrlShortenerController.findAll as typeof requestHandler
);

routesUrlShortener.patch(
  "/update/:id",
  UrlShortenerController.update as typeof requestHandler
);

routesUrlShortener.delete(
  "/delete/:id",
  UrlShortenerController.delete as typeof requestHandler
);

export default routesUrlShortener;
