import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import prismaClient from '../prisma';

interface IPaylaod {
    sub: string;
}

export async function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {

    const authToken = request.headers.authorization;

    if (!authToken) {
        return response.status(401).json({
            errorCode: "token.invalid"
        });
    }

    // Estrutura do token no headers => "Bearer ajo3oi3131olal31"

    const [, token] = authToken.split(" ");

    try {
        const { sub: userId } = verify(token, process.env.JWT_SECRET) as IPaylaod;

        request.user_id = userId;

        const userExists = await prismaClient.user.findUnique({
            where: {
                id: userId
            }
        });

        if (!userExists) {
            throw new Error('User does not exits on database');
        }

        next();
    } catch (err) {
        return response.status(401).json({
            errorCode: err.message
        });
    }

}