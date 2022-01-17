import { Router } from 'express';
import { AuthenticateUserController } from './controllers/AuthenticateUserController';
import { CreateMessageController } from './controllers/CreateMessageController';
import { ensureAuthenticated } from './middlewares/ensureAuthenticated';
import { GetLastThreeMessagesController } from './controllers/GetLast3MessagesController'
import { ProfileUserController } from './controllers/ProfileUserController';

const router = Router();

router.post('/authenticate', new AuthenticateUserController().handleRequest);

router.post('/messages', ensureAuthenticated, new CreateMessageController().handleRequest);

router.get('/user/profile', ensureAuthenticated, new ProfileUserController().handleRequest);
router.get('/messages/last-three', new GetLastThreeMessagesController().handleRequest);

export { router };