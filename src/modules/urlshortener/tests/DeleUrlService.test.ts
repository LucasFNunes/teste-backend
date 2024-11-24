import AppDataSource from "../../../ormconfig";
import { UrlShortener } from "../schemas/schema";
import DeleteUrlService from "../services/DeleteUrlService";

// Mock do repositório e da conexão com o banco de dados
jest.mock("../../../ormconfig", () => ({
  getRepository: jest.fn(),
}));

const mockRepository = {
  findOne: jest.fn(),
  save: jest.fn(),
};

(AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepository);

describe("DeleteUrlService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve marcar um item como deletado com sucesso", async () => {
    const mockId = "0dd7263b-398b-49c6-9a31-5106b29f77db";
    const mockUserId = "273efe7b-3fc2-48cb-81b8-f34bf15b3a02";
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
    mockRepository.save.mockResolvedValue({ ...mockItem, isTrashed: true });

    const result = await DeleteUrlService.deleteUrl(mockId, mockUserId);

    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { id: mockId, isTrashed: false },
    });
    expect(mockItem.isTrashed).toBe(true);
    expect(result).toBe("Registro deletado com sucesso.");
    expect(mockRepository.save).toHaveBeenCalledWith(mockItem);
  });

  it("deve retornar 'Item não encontrado' se o ID não existir", async () => {
    const mockId = "nonexistent-id";
    const mockUserId = "273efe7b-3fc2-48cb-81b8-f34bf15b3a02";

    mockRepository.findOne.mockResolvedValue(null);

    const result = await DeleteUrlService.deleteUrl(mockId, mockUserId);

    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { id: mockId, isTrashed: false },
    });
    expect(result).toBe("Item não encontrado");
    expect(mockRepository.save).not.toHaveBeenCalled();
  });

  it("deve lançar um erro se o usuário não estiver autenticado", async () => {
    const mockId = "0dd7263b-398b-49c6-9a31-5106b29f77db";

    await expect(DeleteUrlService.deleteUrl(mockId, undefined)).rejects.toThrow(
      "É necessario estar logado para deleter uma url."
    );

    expect(mockRepository.findOne).not.toHaveBeenCalled();
    expect(mockRepository.save).not.toHaveBeenCalled();
  });

  it("deve lançar um erro ao tentar deletar no repositório", async () => {
    const mockId = "0dd7263b-398b-49c6-9a31-5106b29f77db";
    const mockUserId = "273efe7b-3fc2-48cb-81b8-f34bf15b3a02";

    mockRepository.findOne.mockRejectedValue(new Error("Database error"));

    const consoleErrorMock = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await expect(
      DeleteUrlService.deleteUrl(mockId, mockUserId)
    ).rejects.toThrow("Erro ao deletar item.");

    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { id: mockId, isTrashed: false },
    });
    expect(mockRepository.save).not.toHaveBeenCalled();

    consoleErrorMock.mockRestore();
  });
});
