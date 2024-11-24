import AppDataSource from "../../../ormconfig";
import { User } from "../../users/schemas/schema";
import AuthenticateService from "../services/LoginAuthenticateService";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Mock do repositório e dependências
jest.mock("../../../ormconfig", () => ({
  getRepository: jest.fn(),
}));
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));
jest.mock("bcrypt", () => ({
  compare: jest.fn(),
}));

const mockRepository = {
  findOneBy: jest.fn(),
};

(AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepository);

describe("AuthenticateService", () => {
  const mockUser: User = {
    id: "user-id-123",
    name: "Test User",
    email: "test@example.com",
    password: "hashed-password",
    isTrashed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    isAuthenticated: false,
    hashPassword: function (): Promise<void> {
      throw new Error("Function not implemented.");
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_KEY = "mock-jwt-key"; // Define a chave JWT para os testes
  });

  afterEach(() => {
    delete process.env.JWT_KEY; // Remove a variável de ambiente após os testes
  });

  it("deve autenticar um usuário com sucesso", async () => {
    const mockToken = "mocked-jwt-token";
    const email = "test@example.com";
    const password = "correct-password";

    mockRepository.findOneBy.mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue(mockToken);

    const result = await AuthenticateService.execute(email, password);

    expect(mockRepository.findOneBy).toHaveBeenCalledWith({
      email,
      isTrashed: false,
    });
    expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);
    expect(jwt.sign).toHaveBeenCalledWith(
      {
        userid: mockUser.id,
        name: mockUser.name,
      },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
    expect(result).toEqual({
      user: { name: mockUser.name, email: mockUser.email, id: mockUser.id },
      token: mockToken,
    });
  });

  it("deve lançar um erro se o usuário não for encontrado", async () => {
    mockRepository.findOneBy.mockResolvedValue(null);

    await expect(
      AuthenticateService.execute("invalid@example.com", "password")
    ).rejects.toThrow("Usuário ou senha não encontrado.");

    expect(mockRepository.findOneBy).toHaveBeenCalledWith({
      email: "invalid@example.com",
      isTrashed: false,
    });
    expect(bcrypt.compare).not.toHaveBeenCalled();
    expect(jwt.sign).not.toHaveBeenCalled();
  });

  it("deve lançar um erro se a senha estiver incorreta", async () => {
    mockRepository.findOneBy.mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      AuthenticateService.execute("test@example.com", "wrong-password")
    ).rejects.toThrow("Usuário ou senha não encontrado.");

    expect(mockRepository.findOneBy).toHaveBeenCalledWith({
      email: "test@example.com",
      isTrashed: false,
    });
    expect(bcrypt.compare).toHaveBeenCalledWith(
      "wrong-password",
      mockUser.password
    );
    expect(jwt.sign).not.toHaveBeenCalled();
  });

  it("deve lançar um erro se JWT_KEY não estiver definido", async () => {
    delete process.env.JWT_KEY; // Remove a chave JWT

    mockRepository.findOneBy.mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    await expect(
      AuthenticateService.execute("test@example.com", "correct-password")
    ).rejects.toThrow("JWT_KEY não está definida.");

    expect(mockRepository.findOneBy).toHaveBeenCalledWith({
      email: "test@example.com",
      isTrashed: false,
    });
    expect(bcrypt.compare).toHaveBeenCalledWith(
      "correct-password",
      mockUser.password
    );
    expect(jwt.sign).not.toHaveBeenCalled();
  });

  it("deve lançar um erro genérico se o repositório falhar", async () => {
    mockRepository.findOneBy.mockRejectedValue(new Error("Database error"));

    await expect(
      AuthenticateService.execute("test@example.com", "correct-password")
    ).rejects.toThrow("Database error");

    expect(mockRepository.findOneBy).toHaveBeenCalledWith({
      email: "test@example.com",
      isTrashed: false,
    });
    expect(bcrypt.compare).not.toHaveBeenCalled();
    expect(jwt.sign).not.toHaveBeenCalled();
  });
});
