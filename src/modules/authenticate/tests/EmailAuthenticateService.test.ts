import EmailAuthenticateService from "../services/EmailAuthenticateService";
import AppDataSource from "../../../ormconfig";
import { User } from "../../users/schemas/schema";

jest.mock("../../../ormconfig", () => ({
  getRepository: jest.fn(),
}));

describe("EmailAuthenticateService", () => {
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

  it("deve autenticar o email com sucesso", async () => {
    const userId = "validUserId";
    const code = "validCode";

    const user = {
      id: code,
      isTrashed: false,
      isAuthenticated: false,
    };

    mockRepository.findOneBy.mockResolvedValue(user);

    const result = await EmailAuthenticateService.execute(userId, code);

    expect(mockRepository.findOneBy).toHaveBeenCalledWith({
      id: code,
      isTrashed: false,
    });
    expect(user.isAuthenticated).toBe(true);
    expect(mockRepository.save).toHaveBeenCalledWith(user);
    expect(result).toBe("Email autenticado com sucesso!");
  });

  it("deve lançar erro se o usuário não estiver logado", async () => {
    await expect(
      EmailAuthenticateService.execute(undefined, "someCode")
    ).rejects.toThrow("É necessario estar logado para autenticar um email.");
    expect(mockRepository.findOneBy).not.toHaveBeenCalled();
    expect(mockRepository.save).not.toHaveBeenCalled();
  });

  it("deve lançar erro se o usuário não for encontrado", async () => {
    const userId = "validUserId";
    const code = "invalidCode";

    mockRepository.findOneBy.mockResolvedValue(null);

    await expect(
      EmailAuthenticateService.execute(userId, code)
    ).rejects.toThrow("Usuário com esse email não encontrado.");
    expect(mockRepository.findOneBy).toHaveBeenCalledWith({
      id: code,
      isTrashed: false,
    });
    expect(mockRepository.save).not.toHaveBeenCalled();
  });
});
