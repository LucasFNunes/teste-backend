import AppDataSource from "../../../ormconfig";
import { UrlShortener } from "../schemas/schema";

export default class FindAllUrlService {
  static async findAllUrl(
    userId: string | undefined
  ): Promise<UrlShortener[] | null> {
    const urlShortenerRepository = AppDataSource.getRepository(UrlShortener);
    if (!userId) {
      throw new Error("É necessario estar logado para realizar a listagem.");
    }

    try {
      const items = await urlShortenerRepository.find({
        where: { userId, isTrashed: false }, // Filtro pelo userId
      });

      return items;
    } catch (error) {
      console.error("Erro ao buscar itens por userId:", error);
      throw new Error("Erro ao buscar itens.");
    }
  }
}
