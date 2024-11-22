import  AppDataSource  from "../../../ormconfig";
import { User } from "../schemas/schema";

export default class CreateUserService {
  static async createUser(name: string, email: string, password: string): Promise<void> {
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

    // Salva no banco de dados
    await userRepository.save(newUser);
  }
}
