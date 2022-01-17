import { Request, Response } from "express";
import { GetLast3MessagesService } from '../services/GetLast3MessagesService';

class GetLastThreeMessagesController {

    async handleRequest(request: Request, response: Response): Promise<Response> {
        const getLast3MessagesService = new GetLast3MessagesService();

        const messages = await getLast3MessagesService.execute();

        return response.status(200).json(messages);
    }
}

export { GetLastThreeMessagesController };