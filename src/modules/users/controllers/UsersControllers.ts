import { Request, Response } from "express";
import CreateUserService from "../services/CreateUsersService";

const UsersController = {
  async create(request: Request, response: Response) {
    try {
      const { name, email, password } = request.body;

      const returned = await CreateUserService.createUser(
        name,
        email,
        password
      );

      return response.status(200).json({ message: returned });
    } catch (error: any) {
      return response.status(500).send({ error: error.message });
    }
  },
};

export default UsersController;
