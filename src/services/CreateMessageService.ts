import prismaClient from '../prisma';
import { serverIO } from '../app';


// CRIAR UM EVENTO NA CRIAÇÃO DA MENSAGEM PARA QUANDO NOVA MENSAGEM FOR CRIADA, TODOS OS USUARIOS CONECTADOS RECEBEREM ESSE EVENTO DE MENSAGEM
class CreateMessageService {

    async execute(text: string, user_id: string) {
        const message = await prismaClient.message.create({
            data: {
                text,
                user_id
            },
            include: {
                user: true // Incluindo retorno do objeto do User que faz relacionamento
            }
        });

        const eventInfo = {
            text: message.text,
            user_id: message.user_id,
            created_at: message.created_at,
            user: {
                name: message.user.name,
                avatarUrl: message.user.avatar_url
            }
        };

        serverIO.emit('new_message', eventInfo);

        return message;
    }

}

export { CreateMessageService };