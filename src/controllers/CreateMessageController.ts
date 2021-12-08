import { Request, Response } from "express";
import { CreateMessageService } from '../services/CreateMessageService';

class CreateMessageController {

    async handleRequest(request: Request, response: Response): Promise<Response> {
        const createMessageService = new CreateMessageService();

        const { text } = request.body;

        let message: any;

        try {
            message = await createMessageService.execute(text, request.user_id);
        } catch (err) {
            return response.status(500).json({ error: err.message })
        }

        return response.status(201).json(message);
    }
}

export { CreateMessageController };