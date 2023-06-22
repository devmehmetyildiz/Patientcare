import { TokenModel, LoginModel } from '../Models';
import { Navigationservice } from '../Utils/Navigationservice';
import { Webservice } from '../Utils/Webservice';

class ProfileService {
    private static _instance: ProfileService = null;
    private _usermeta: any = null;
    private _username: string = null;
    private _roles: any = null;
    private _notifications: any = null;
    private _user: null = null;
    private _isloading: Boolean = false;


    public static getInstance() {
        if (this._instance == null) {
            this._instance = new ProfileService();
        }
        return this._instance;
    }

    public async Login(username: string, password: string, redirectPage?: string) {

        let path: string = 'Oauth/Login';
        let loginModel = new LoginModel();
        loginModel.grant_type = 'password';
        loginModel.Username = username;
        loginModel.Password = password;
        try {
            const response: any = await Webservice.doPost(Webservice._config.authUrl, path, loginModel);
            let tokenResponse = new TokenModel();
            tokenResponse.token_type = response.token_type;
            tokenResponse.accessToken = response.accessToken;
            tokenResponse.refreshToken = response.refreshToken;
            tokenResponse.ExpiresAt = response.ExpiresAt;
            Webservice.ConfigureToken(tokenResponse);
            Navigationservice.GoTo(redirectPage ? redirectPage : 'Home');
        } catch (error) {
            console.log('error: ', error);
        }
    }

    public async GetActiveUser() {
        let path: string = 'Users/GetActiveUserMeta';
        try {
            const response: any = await Webservice.doGet(Webservice._config.userroleUrl, path);
            this._usermeta = response
        } catch (error) {
            console.log('error: ', error);
        }
    }


}
export { ProfileService };
