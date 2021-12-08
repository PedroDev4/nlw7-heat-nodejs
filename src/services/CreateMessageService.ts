import prismaClient from '../prisma';

class CreateMessageService {

    async execute(text: string, user_id: string) {
        const message = prismaClient.message.create({
            data: {
                text,
                user_id
            },
            include: {
                user: true // Incluindo retorno de objetos que fazem relacionamento com "Message"
            }
        });

        return message;
    }

}

export { CreateMessageService };