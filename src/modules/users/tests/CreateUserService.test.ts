import CreateUserService from "../services/CreateUsersService";
import AppDataSource from "../../../ormconfig";
import { User } from "../schemas/schema";
import sendAuthEmail from "../services/MailerService";

// Mock das dependências
jest.mock("../../../ormconfig", () => ({
  getRepository: jest.fn(),
}));

// Mockando a exportação padrão do `MailerService` corretamente
jest.mock("../services/MailerService", () => ({
  // Isso mocka a função `sendAuthEmail` como uma função jest.fn()
  __esModule: true, // Garantir que o Jest trate o módulo como ESModule
  default: jest.fn(), // Mockando a função sendAuthEmail
}));

describe("CreateUserService", () => {
  let userRepositoryMock: any;
  let mockSave: jest.Mock;

  beforeEach(() => {
    // Resetando os mocks antes de cada teste
    userRepositoryMock = {
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    // Definindo o mock do `getRepository`
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(
      userRepositoryMock
    );

    // Limpar o mock do envio de e-mail
    (sendAuthEmail as jest.Mock).mockClear();
  });

  test("deve lançar um erro se algum campo estiver faltando", async () => {
    // Testando quando o nome está faltando
    await expect(
      CreateUserService.createUser("", "test@example.com", "password")
    ).rejects.toThrow("Todos os campos são obrigatórios.");

    // Testando quando o email está faltando
    await expect(
      CreateUserService.createUser("John", "", "password")
    ).rejects.toThrow("Todos os campos são obrigatórios.");

    // Testando quando a senha está faltando
    await expect(
      CreateUserService.createUser("John", "test@example.com", "")
    ).rejects.toThrow("Todos os campos são obrigatórios.");
  });

  test("deve lançar um erro se o email já estiver cadastrado", async () => {
    // Mockando a resposta do banco para simular um usuário existente
    userRepositoryMock.findOneBy.mockResolvedValueOnce({
      email: "test@example.com",
    });

    await expect(
      CreateUserService.createUser("John", "test@example.com", "password")
    ).rejects.toThrow("Email já cadastrado.");
  });

  test("deve criar um usuário e enviar um e-mail de autenticação", async () => {
    // Mockando o retorno do `save` do repositório
    const mockUser = {
      id: "123",
      name: "John",
      email: "john@example.com",
      password: "password",
    };
    userRepositoryMock.findOneBy.mockResolvedValueOnce(null); // Nenhum usuário encontrado
    userRepositoryMock.save.mockResolvedValueOnce(mockUser);

    // Chamar o método de criação de usuário
    const response = await CreateUserService.createUser(
      "John",
      "john@example.com",
      "password"
    );
    // Verificar a resposta
    expect(response).toBe("Conta criada com sucesso!");
  });
});
