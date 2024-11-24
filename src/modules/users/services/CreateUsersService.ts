import AppDataSource from "../../../ormconfig";
import { User } from "../schemas/schema";
import { sendAuthEmail } from "../services/MailerService";

export default class CreateUserService {
  static async createUser(
    name: string,
    email: string,
    password: string
  ): Promise<String> {
    const userRepository = AppDataSource.getRepository(User);

    // Valida os campos
    if (!name || !email || !password) {
      throw Error("Todos os campos são obrigatórios.");
    }

    // Verifica se o email já está cadastrado
    const existingUser = await userRepository.findOneBy({ email });
    if (existingUser) {
      throw new Error("Email já cadastrado.");
    }

    // Cria um novo usuário
    const newUser = userRepository.create({ name, email, password });

    const token = "UUID";

    // Enviar e-mail de autenticação
    sendAuthEmail(email, token);
    // Salva no banco de dados
    await userRepository.save(newUser);

    return "Conta criada com sucesso!";
  }
}
