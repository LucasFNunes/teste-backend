import { User } from "../../users/schemas/schema";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import AppDataSource from "../../../ormconfig";

export default class AuthenticateService {
  static async execute(email: string, password: string): Promise<any> {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ email });

    if (!user) {
      throw Error("Usuário ou senha não encontrado.");
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw Error("Usuário ou senha não encontrado.");
    }

    const jwtKey = process.env.JWT_KEY;

    if (!jwtKey) {
      throw new Error("JWT_KEY não está definida.");
    }

    const token = jwt.sign(
      {
        idUser: user.id,
        name: user.name,
      },
      jwtKey,
      {
        expiresIn: "1h",
      }
    );

    return { user: { name: user.name, email: user.email, id: user.id }, token };
  }
}
