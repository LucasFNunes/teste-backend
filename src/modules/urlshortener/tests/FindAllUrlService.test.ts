import AppDataSource from "../../../ormconfig";
import { UrlShortener } from "../schemas/schema";
import FindAllUrlService from "../services/FindAllUrlService";

// Mock do repositório e da conexão com o banco de dados
jest.mock("../../../ormconfig", () => ({
  getRepository: jest.fn(),
}));

const mockRepository = {
  find: jest.fn(),
};

(AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepository);

describe("FindAllUrlService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar todas as URLs de um usuário válido", async () => {
    const mockUserId = "273efe7b-3fc2-48cb-81b8-f34bf15b3a02";
    const mockUrls: UrlShortener[] = [
      // Dados de mock conforme fornecidos
    ];

    mockRepository.find.mockResolvedValue(mockUrls);

    const urls = await FindAllUrlService.findAllUrl(mockUserId);

    expect(mockRepository.find).toHaveBeenCalledWith({
      where: { userId: mockUserId, isTrashed: false },
    });
    expect(urls).toEqual(mockUrls);
  });

  it("deve lançar um erro se o usuário não estiver logado (userId não fornecido)", async () => {
    await expect(FindAllUrlService.findAllUrl(undefined)).rejects.toThrow(
      "É necessario estar logado para realizar a listagem."
    );

    expect(mockRepository.find).not.toHaveBeenCalled();
  });

  it("deve lançar um erro caso ocorra um problema na busca", async () => {
    const mockUserId = "273efe7b-3fc2-48cb-81b8-f34bf15b3a02";

    mockRepository.find.mockRejectedValue(new Error("Database error"));

    const consoleErrorMock = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await expect(FindAllUrlService.findAllUrl(mockUserId)).rejects.toThrow(
      "Erro ao buscar itens."
    );

    expect(mockRepository.find).toHaveBeenCalledWith({
      where: { userId: mockUserId, isTrashed: false },
    });

    consoleErrorMock.mockRestore();
  });
});
