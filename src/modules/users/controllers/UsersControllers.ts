import { Request, Response } from "express";
//import { AppDataSource } from "../ormconfig";
import  CreateUserService  from "../services/CreateUsersService";

const UsersController = {
  async create(request: Request, response: Response){
    const { name, email, password } = request.body;

    await CreateUserService.createUser(name, email, password);

    return response.status(200).json( 'Conta criada com sucesso!' );

  }
}

export default UsersController;
