import AppDataSource from "../../../ormconfig";
import { UrlShortener } from "../schemas/schema";

export default class UrlRedirectService {
  // Função para obter a URL original e atualizar contador de cliques
  static async getOriginalUrlAndIncrementClicks(
    shortId: string
  ): Promise<string | null> {
    const urlShortenerRepository = AppDataSource.getRepository(UrlShortener);

    const shortUrl = `http://localhost:3000/urlshortener/${shortId}`;
    const existingUrl = await urlShortenerRepository.findOneBy({
      urlShortened: shortUrl,
    });

    if (existingUrl) {
      // Incrementa o contador de cliques
      existingUrl.clicks += 1;
      await urlShortenerRepository.save(existingUrl);
      return existingUrl.url;
    }

    return null;
  }
}
