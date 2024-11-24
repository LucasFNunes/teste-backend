import UrlRedirectService from "../services/UrlRedirectService";
import AppDataSource from "../../../ormconfig";
import { UrlShortener } from "../schemas/schema";

jest.mock("../../../ormconfig", () => ({
  getRepository: jest.fn(),
}));

describe("UrlRedirectService", () => {
  let mockRepository: any;

  beforeEach(() => {
    mockRepository = {
      findOneBy: jest.fn(),
      save: jest.fn(),
    };

    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar a URL original e incrementar os cliques quando a URL encurtada existe", async () => {
    const shortId = "abc123";
    const shortUrl = `http://localhost:3000/urlshortener/${shortId}`;
    const existingUrl = {
      urlShortened: shortUrl,
      url: "http://example.com",
      clicks: 5,
    };

    mockRepository.findOneBy.mockResolvedValue(existingUrl);

    const result = await UrlRedirectService.getOriginalUrlAndIncrementClicks(
      shortId
    );

    expect(mockRepository.findOneBy).toHaveBeenCalledWith({
      urlShortened: shortUrl,
    });
    expect(existingUrl.clicks).toBe(6); // Verifica se os cliques foram incrementados
    expect(mockRepository.save).toHaveBeenCalledWith(existingUrl); // Verifica se foi salvo
    expect(result).toBe("http://example.com"); // Retorno esperado
  });

  it("deve retornar null quando a URL encurtada não existe", async () => {
    const shortId = "xyz789";
    const shortUrl = `http://localhost:3000/urlshortener/${shortId}`;

    mockRepository.findOneBy.mockResolvedValue(null);

    const result = await UrlRedirectService.getOriginalUrlAndIncrementClicks(
      shortId
    );

    expect(mockRepository.findOneBy).toHaveBeenCalledWith({
      urlShortened: shortUrl,
    });
    expect(mockRepository.save).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });
});
