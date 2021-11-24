import { Request, Response } from "express";
import { AuthenticateUserService } from "../services/AuthenticateUserService";


class AuthenticateUserController {

    async handleRequest(request: Request, response: Response): Promise<Response> {
        const { code } = request.body;

        const authUserService = new AuthenticateUserService();
        const result = await authUserService.authenticate(code);

        return response.json(result);
    }

}

export { AuthenticateUserController };