import axios from 'axios';
import prismaClient from '../prisma';
import { sign } from 'jsonwebtoken';

/** 
 * Receber code(string)
 * Recuperar access_token no github
 * Recuperar infos do user no github
 * Verificar se usuário existe no DB
 * ---- SIM = Gerar token
 * ---- NAO = Cria no DB, gera token
 * 
 * Retornar o token com as infos do user 
*/

interface IAccessTokenResponse {
    access_token: string;
}

interface User {
    id: number;
    avatar_url: string;
    login: string;
    name: string;
}

interface IResponse {
    token: string;
    user_id: string;
    user: User;
}

class AuthenticateUserService {

    private url: string = 'https://github.com/login/oauth/access_token';
    private userDataUrl: string = 'https://api.github.com/user';

    async authenticate(code: string): Promise<IResponse> {
        const access_token = await this.getAccessToken(code);

        const { data } = await axios.get<User>(this.userDataUrl, {
            headers: {
                authorization: `Bearer ${access_token}`
            }
        });

        const { name, id: github_id, login, avatar_url } = data;

        console.log(github_id);

        const user = await prismaClient.user.findFirst({
            where: {
                github_id
            }
        });

        if (!user) {
            await prismaClient.user.create({
                data: {
                    github_id,
                    login,
                    avatar_url,
                    name
                }
            })
        }

        const token = await this.createJwtToken(user.id, {
            id: github_id,
            avatar_url,
            login,
            name
        });

        const response: IResponse = {
            token,
            user_id: user.id,
            user: {
                id: github_id,
                avatar_url,
                login,
                name
            }
        };

        return response;
    }

    private async getAccessToken(code: string): Promise<string> {
        const { data: access_tokenResponse } = await axios.post<IAccessTokenResponse>(this.url, null, {
            params: {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code
            },
            headers: {
                Accept: "application/json"
            }
        });

        return access_tokenResponse.access_token;
    }

    private async createJwtToken(id: string, { id: github_id, avatar_url, login, name }: User): Promise<string> {
        const token = sign({
            user: {
                github_id,
                avatar_url,
                login,
                name
            }
        }, process.env.JWT_SECRET, {
            subject: id,
            expiresIn: "1d"
        });

        return token;
    }

}

export { AuthenticateUserService };