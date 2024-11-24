import { User } from "../../users/schemas/schema";
import AppDataSource from "../../../ormconfig";

export default class EmailAuthenticateService {
  static async execute(
    userId: string | undefined,
    code: string
  ): Promise<String> {
    if (!userId) {
      throw new Error("É necessario estar logado para autenticar um email.");
    }
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOneBy({
      id: code,
      isTrashed: false,
    });

    if (!user) {
      throw Error("Usuário com esse email não encontrado.");
    } else {
      user.isAuthenticated = true;

      await userRepository.save(user);
    }

    return "Email autenticado com sucesso!";
  }
}
