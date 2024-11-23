import AppDataSource from "../../../ormconfig";
import { UrlShortener } from "../schemas/schema";

export default class DeleteUrlService {
  static async deleteUrl(
    id: string,
    userId: string | undefined
  ): Promise<String> {
    const urlShortenerRepository = AppDataSource.getRepository(UrlShortener);

    if (!userId) {
      throw new Error("É necessario estar logado para deleter uma url.");
    }

    try {
      const item = await urlShortenerRepository.findOne({
        where: { id, isTrashed: false }, // Filtro pelo userId
      });

      if (item) {
        // Alterar o valor da chave istrashed para true
        item.isTrashed = true;
        item.updatedAt = new Date();

        // Salvar as alterações no banco de dados
        await urlShortenerRepository.save(item);
      } else {
        // Caso não encontre o item, você pode tratar o erro ou retornar algo
        return "Item não encontrado";
      }
      return "Registro deletado com sucesso.";
    } catch (error) {
      console.error("Erro ao tentar deletar item:", error);
      throw new Error("Erro ao deletar item.");
    }
  }
}
