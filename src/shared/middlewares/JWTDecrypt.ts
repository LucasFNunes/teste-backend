import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export default async function JWTDecrypt(
  request: Request,
  response: Response
): Promise<string | undefined> {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return;
  }

  // Extrair o token do formato "Bearer <token>"
  const [, token] = authHeader.split(" ");

  if (!token) {
    return;
  }

  // Decodificar o token JWT
  const secretKey = process.env.JWT_KEY; // Substitua pela chave secreta usada para assinar o token

  if (!secretKey) {
    throw new Error("Chave JWT não configurada no ambiente.");
  }

  const decoded = jwt.verify(token, secretKey) as jwt.JwtPayload;
  // Obtenha o userId do payload do token
  const userId = decoded.userid;

  return userId;
}
