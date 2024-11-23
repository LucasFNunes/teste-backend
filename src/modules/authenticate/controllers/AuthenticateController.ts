import { Request, Response } from "express";
import  AuthenticateService  from "../services/AuthenticateService";

const UsersController = {
 async auth(request: Request, response: Response){
     
   try {
     const { email, password } = request.body;
 
     const { token, user } = await AuthenticateService.execute(email, password);
 
     return response.send({ token, user });
 
   } catch (error: any) {
     return response.status(400).send({ error: error.message });
   }
 }
}

export default UsersController;
