import AppDataSource from "../../../ormconfig";
import { UrlShortener } from "../schemas/schema";

export default class UpdateUrlService {
  static async updateUrl(
    userId: string | undefined,
    url: string,
    id: string
  ): Promise<String> {
    const urlShortenerRepository = AppDataSource.getRepository(UrlShortener);

    if (!userId) {
      throw new Error("É necessario estar logado para atualizar as urls.");
    }

    try {
      const item = await urlShortenerRepository.findOne({
        where: { id, isTrashed: false }, // Filtro pelo userId
      });

      if (item) {
        item.url = url;
        item.updatedAt = new Date();
        // Salvar as alterações no banco de dados
        await urlShortenerRepository.save(item);

        return "Url atualizada com sucesso!";
      } else {
        return "Item não encontrado";
      }
    } catch (error) {
      console.error("Erro ao buscar itens por userId:", error);
      throw new Error("Erro ao buscar itens.");
    }
  }
}
