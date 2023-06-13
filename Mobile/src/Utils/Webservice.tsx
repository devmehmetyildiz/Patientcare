class Webservice {
    static _config: Webserviceconfig;
    static username: string;
    static password: string;
    static accessToken: string;
    static expTime: Date;

    public static Configure(configuration: Webserviceconfig) {
        this._config = configuration;
    }

    public static async doGet(path: string,data:any){
        
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