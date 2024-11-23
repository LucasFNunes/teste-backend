import crypto from "crypto";
import AppDataSource from "../../../ormconfig";
import { UrlShortener } from "../schemas/schema";

export default class UrlShortenerService {
  // Função para criar URL encurtada
  static async createShortUrl(
    url: string,
    userId: string | undefined
  ): Promise<string> {
    const originalUrl = url;
    if (!originalUrl) {
      throw Error("Url nula ou invalida.");
    }

    const shortId = crypto.randomBytes(4).toString("base64url").slice(0, 6);
    const shortUrl = `http://localhost:3000/urlshortener/${shortId}`;

    if (userId) {
      const urlShortenerRepository = AppDataSource.getRepository(UrlShortener);

      // Verifica se a URL já existe para o mesmo usuário
      const existingUrl = await urlShortenerRepository.findOne({
        where: {
          url: originalUrl,
          userId: userId,
        },
      });

      if (existingUrl) {
        return existingUrl.urlShortened;
      }

      const newUrl = urlShortenerRepository.create({
        userId,
        urlShortened: shortUrl,
        url: originalUrl,
      });

      await urlShortenerRepository.save(newUrl);
    }

    return shortUrl;
  }
}
