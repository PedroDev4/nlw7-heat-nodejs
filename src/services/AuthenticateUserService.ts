import axios from 'axios';

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

interface IUserDataResponse {
    avatar_url: string;
    id: number;
    login: string;
    name: string;
}

class AuthenticateUserService {

    private url: string = 'https://github.com/login/oauth/access_token';

    async authenticate(code: string): Promise<IUserDataResponse> {
        const access_token = await this.getAccessToken(code);

        const { data } = await axios.get<IUserDataResponse>('https://api.github.com/user', {
            headers: {
                authorization: `Bearer ${access_token}`
            }
        });

        const userData: IUserDataResponse = {
            avatar_url: data.avatar_url,
            id: data.id,
            login: data.login,
            name: data.name
        }

        return userData;
    }

    async getAccessToken(code: string): Promise<string> {
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

}

export { AuthenticateUserService };