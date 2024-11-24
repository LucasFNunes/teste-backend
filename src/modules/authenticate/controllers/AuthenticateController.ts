import { Request, Response } from "express";
import AuthenticateService from "../services/LoginAuthenticateService";
import JWTDecrypt from "../../../shared/middlewares/JWTDecrypt";
import EmailAuthenticateService from "../services/EmailAuthenticateService";

const UsersController = {
  async auth(request: Request, response: Response) {
    try {
      const { email, password } = request.body;

      const { token, user } = await AuthenticateService.execute(
        email,
        password
      );

      return response.send({ token, user });
    } catch (error: any) {
      return response.status(400).send({ error: error.message });
    }
  },
  async authEmail(request: Request, response: Response) {
    try {
      const { code } = request.body;
      const userId = await JWTDecrypt(request, response);

      const returned = await EmailAuthenticateService.execute(userId, code);

      return response.send({ message: returned });
    } catch (error: any) {
      return response.status(400).send({ error: error.message });
    }
  },
};

export default UsersController;
