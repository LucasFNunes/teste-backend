import AppDataSource from "../../../ormconfig";
import { UrlShortener } from "../schemas/schema";
import UpdateUrlService from "../services/UpdateUrlService";

// Mock do repositório e da conexão com o banco de dados
jest.mock("../../../ormconfig", () => ({
  getRepository: jest.fn(),
}));

const mockRepository = {
  findOne: jest.fn(),
  save: jest.fn(),
};

(AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepository);

describe("UpdateUrlService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve atualizar uma URL com sucesso", async () => {
    const mockId = "0dd7263b-398b-49c6-9a31-5106b29f77db";
    const mockUserId = "273efe7b-3fc2-48cb-81b8-f34bf15b3a02";
    const mockUrl = "https://updated-example.com";
    const mockItem: UrlShortener = {
      id: mockId,
      userId: mockUserId,
      url: "https://example.com",
      urlShortened: "http://localhost:3000/urlshortener/abc123",
      clicks: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      isTrashed: false,
    };

    mockRepository.findOne.mockResolvedValue(mockItem);
    mockRepository.save.mockResolvedValue({ ...mockItem, url: mockUrl });

    const result = await UpdateUrlService.updateUrl(
      mockUserId,
      mockUrl,
      mockId
    );

    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { id: mockId, isTrashed: false },
    });
    expect(mockItem.url).toBe(mockUrl);
    expect(result).toBe("Url atualizada com sucesso!");
    expect(mockRepository.save).toHaveBeenCalledWith(mockItem);
  });

  it("deve retornar 'Item não encontrado' se o ID não existir", async () => {
    const mockId = "nonexistent-id";
    const mockUserId = "273efe7b-3fc2-48cb-81b8-f34bf15b3a02";
    const mockUrl = "https://updated-example.com";

    mockRepository.findOne.mockResolvedValue(null);

    const result = await UpdateUrlService.updateUrl(
      mockUserId,
      mockUrl,
      mockId
    );

    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { id: mockId, isTrashed: false },
    });
    expect(result).toBe("Item não encontrado");
    expect(mockRepository.save).not.toHaveBeenCalled();
  });

  it("deve lançar um erro se o usuário não estiver autenticado", async () => {
    const mockId = "0dd7263b-398b-49c6-9a31-5106b29f77db";
    const mockUrl = "https://updated-example.com";

    await expect(
      UpdateUrlService.updateUrl(undefined, mockUrl, mockId)
    ).rejects.toThrow("É necessario estar logado para atualizar as urls.");

    expect(mockRepository.findOne).not.toHaveBeenCalled();
    expect(mockRepository.save).not.toHaveBeenCalled();
  });

  it("deve lançar um erro ao tentar atualizar no repositório", async () => {
    const mockId = "0dd7263b-398b-49c6-9a31-5106b29f77db";
    const mockUserId = "273efe7b-3fc2-48cb-81b8-f34bf15b3a02";
    const mockUrl = "https://updated-example.com";

    mockRepository.findOne.mockRejectedValue(new Error("Database error"));

    const consoleErrorMock = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await expect(
      UpdateUrlService.updateUrl(mockUserId, mockUrl, mockId)
    ).rejects.toThrow("Erro ao buscar itens.");

    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { id: mockId, isTrashed: false },
    });
    expect(mockRepository.save).not.toHaveBeenCalled();

    consoleErrorMock.mockRestore();
  });
});
