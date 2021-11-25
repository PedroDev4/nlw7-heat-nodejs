import { Request, Response } from "express";
import { AuthenticateUserService } from "../services/AuthenticateUserService";


class AuthenticateUserController {

    async handleRequest(request: Request, response: Response): Promise<Response> {
        const authUserService = new AuthenticateUserService();

        const { code } = request.body;

        try {

            const result = await authUserService.authenticate(code);
            return response.json(result);

        } catch (err) {
            return response.status(400).json({ error: err.message });
        }
    }

}

export { AuthenticateUserController };