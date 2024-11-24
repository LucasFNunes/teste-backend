import crypto from "crypto";
import AppDataSource from "../../../ormconfig";
import { UrlShortener } from "../schemas/schema";
import UrlShortenerService from "../services/UrlShortenerService";

// Mock do repositório e da conexão com o banco de dados
jest.mock("../../../ormconfig", () => ({
  getRepository: jest.fn(),
}));

const mockRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

(AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepository);

describe("UrlShortenerService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve criar uma URL encurtada para um usuário novo", async () => {
    mockRepository.findOne.mockResolvedValue(null); // URL inexistente
    const mockShortId = "YWJjMT";
    jest
      .spyOn(crypto, "randomBytes")
      .mockImplementation(() => Buffer.from(mockShortId));

    const shortUrl = await UrlShortenerService.createShortUrl(
      "https://example.com",
      "user123"
    );

    expect(mockRepository.save).toHaveBeenCalled();
  });

  it("deve retornar a URL encurtada existente para o mesmo usuário", async () => {
    const existingUrl = {
      url: "https://example.com",
      urlShortened: "http://localhost:3000/urlshortener/existing123",
    };
    mockRepository.findOne.mockResolvedValue(existingUrl);

    const shortUrl = await UrlShortenerService.createShortUrl(
      "https://example.com",
      "user123"
    );

    expect(shortUrl).toBe("http://localhost:3000/urlshortener/existing123");
    expect(mockRepository.create).not.toHaveBeenCalled();
    expect(mockRepository.save).not.toHaveBeenCalled();
  });

  it("deve criar uma URL encurtada mesmo sem userId", async () => {
    const mockShortId = "def456";
    jest
      .spyOn(crypto, "randomBytes")
      .mockImplementation(() => Buffer.from(mockShortId));

    const shortUrl = await UrlShortenerService.createShortUrl(
      "https://example.com",
      undefined
    );

    expect(mockRepository.findOne).not.toHaveBeenCalled();
    expect(mockRepository.create).not.toHaveBeenCalled();
    expect(mockRepository.save).not.toHaveBeenCalled();
  });

  it("deve lançar um erro se a URL for inválida ou nula", async () => {
    await expect(
      UrlShortenerService.createShortUrl("", "user123")
    ).rejects.toThrow("Url nula ou invalida.");

    await expect(
      UrlShortenerService.createShortUrl(null as unknown as string, "user123")
    ).rejects.toThrow("Url nula ou invalida.");
  });
});
