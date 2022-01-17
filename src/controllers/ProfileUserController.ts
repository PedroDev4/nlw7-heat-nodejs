import { Request, Response } from "express";
import { ProfileUserService } from "../services/ProfileUserService";


class ProfileUserController {

    async handleRequest(request: Request, response: Response): Promise<Response> {
        const { user_id } = request;

        const profileUserService = new ProfileUserService();

        const profileUser = await profileUserService.getUserProfile(user_id);

        return response.status(200).json(profileUser);
    }

}

export { ProfileUserController };