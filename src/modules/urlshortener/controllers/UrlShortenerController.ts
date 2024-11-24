import { Request, Response } from "express";
import UrlShortenerService from "../services/UrlShortenerService";
import JWTDecrypt from "../../../shared/middlewares/JWTDecrypt";
import UrlRedirectService from "../services/UrlRedirectService";
import FindAllUrlService from "../services/FindAllUrlService";
import DeleteUrlService from "../services/DeleteUrlService";
import UpdateUrlService from "../services/UpdateUrlService";

const UrlShortenerController = {
  async create(request: Request, response: Response) {
    try {
      const { url } = request.body;
      const userId = await JWTDecrypt(request, response);

      const tinyUrl = await UrlShortenerService.createShortUrl(url, userId);

      return response.status(200).json({ "shortUrl:": tinyUrl });
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
  async findAll(request: Request, response: Response) {
    try {
      const userId = await JWTDecrypt(request, response);

      const allUrl = await FindAllUrlService.findAllUrl(userId);

      return response.status(200).json(allUrl);
    } catch (error: any) {
      return response.status(500).send({ error: error.message });
    }
  },
  async update(request: Request, response: Response) {
    try {
      const { url } = request.body;
      const { id } = request.params;

      const userId = await JWTDecrypt(request, response);

      const returned = await UpdateUrlService.updateUrl(userId, url, id);

      return response.status(200).json({ message: returned });
    } catch (error: any) {
      return response.status(500).send({ error: error.message });
    }
  },
  async delete(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const userId = await JWTDecrypt(request, response);

      const returned = await DeleteUrlService.deleteUrl(id, userId);

      return response.status(200).json({ message: returned });
    } catch (error: any) {
      return response.status(500).send({ error: error.message });
    }
  },
};

export default UrlShortenerController;
