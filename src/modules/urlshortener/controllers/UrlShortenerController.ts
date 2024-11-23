import { Request, Response } from "express";
import UrlShortenerService from "../services/UrlShortenerService";
import JWTDecrypt from "../../../shared/middlewares/JWTDecrypt";
import UrlRedirectService from "../services/UrlRedirectService";

const UrlShortenerController = {
  async create(request: Request, response: Response) {
    try {
      const { url } = request.body;
      const userId = await JWTDecrypt(request, response);

      const tinyUrl = await UrlShortenerService.createShortUrl(url, userId);

      return response.status(200).json(tinyUrl);
    } catch (error: any) {
      return response.status(400).send({ error: error.message });
    }
  },

  async redirectUrl(request: Request, response: Response) {
    const { shortId } = request.params;

    try {
      const originalUrl =
        await UrlRedirectService.getOriginalUrlAndIncrementClicks(shortId);
      if (originalUrl) {
        // Redireciona o cliente para a URL original
        response.redirect(originalUrl);
      } else {
        // Retorna erro 404 se o link encurtado não for encontrado
        response.status(404).json({ error: "URL não encontrada." });
      }
    } catch (error) {
      response.status(500).json({ error: "Erro ao redirecionar a URL." });
    }
  },
};

export default UrlShortenerController;
