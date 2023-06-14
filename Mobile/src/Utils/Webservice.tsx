export class Webservice {
    static _config: Webserviceconfig;
    static username: string;
    static password: string;
    static accessToken: string;
    static expTime: Date;

    public static Configure(configuration: Webserviceconfig) {
        this._config = configuration;
    }

    public static async doGet(baseurl: string, path: string, accessToken: string) {
        try {
            const requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };

            const response = await fetch(baseurl + path, requestOptions);
            const result = await response.text();
            return result;
        } catch (error) {
            console.log('error', error);
        }
    }

    public static async doPost(baseurl: string, path: string, data: any) {
        try {
            const requestOptions = {
                method: 'POST',
                redirect: 'follow'
            };

            const response = await fetch(baseurl + path, requestOptions);
            const result = await response.text();
            return result;
        } catch (error) {
            console.log('error', error);
        }
    }
}

class Webserviceconfig {
    authUrl: string;
    userroleUrl: string;
    settingUrl: string;
    systemUrl: string;
    warehouseUrl: string;
    fileUrl: string;
    businessUrl: string;
}