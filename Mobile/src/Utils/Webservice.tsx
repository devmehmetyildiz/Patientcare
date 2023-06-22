import { TokenModel, Webserviceconfig } from '../Models';
import axios from 'axios';

export class Webservice {
    static _config: Webserviceconfig;
    static _token: TokenModel;

    public static Configure(configuration: Webserviceconfig) {
        this._config = configuration;
    }

    public static ConfigureToken(configuration: TokenModel) {
        this._token = configuration;
    }

    public static async doGet(baseurl: string, path: string) {
        try {
            const config = {
                headers: {
                    "Content-Type": 'application/json',
                    'Authorization': `Bearer ${this._token?.accessToken}`
                }
            }
            const response = await this.getRequest(baseurl, path, config);
            console.log('response111: ', response);
            //    const result = await response.json();
            //  return result;
        } catch (error) {
            let err: any = error
            console.log('errcode', err.code);
            console.log('errresponse', err.response);
        }
    }

    private static getRequest(service: string, url: string, config: any) {
        return new Promise((resolve, reject) => {
            axios.get(service + url, config)
                .then(response => resolve(response))
                .catch(function (error) {
                    reject(error)
                })
        })
    }


    public static async doPost(baseurl: string, path: string, data: any) {
        try {
            console.log('this._token: ', this._token);
            var requestHeader = new Headers();
            requestHeader.append('Content-Type', 'application/json');
            this._token && requestHeader.append('Authorization', `Bearer ${this._token.accessToken}`);
            const requestOptions = {
                method: 'POST',
                body: JSON.stringify(data),
                headers: requestHeader
            };
            const response = await fetch(baseurl + path, requestOptions);
            const result = await response.json();
            return result;
        } catch (error) {
            console.log('errorpost', error);
        }
    }

    public static async doPut(baseurl: string, path: string, data: any) {
        try {
            var requestHeader = new Headers();
            requestHeader.append('Content-Type', 'application/json');
            this._token && requestHeader.append('Authorization', `Bearer ${this._token.accessToken}`);
            const requestOptions = {
                method: 'PUT',
                headers: requestHeader,
                body: JSON.stringify(data)
            };
            const response = await fetch(baseurl + path, requestOptions);
            const result = await response.json();
            return result;
        } catch (error) {
            console.log('errorput', error);
        }
    }

    public static async doDelete(baseurl: string, path: string) {
        try {
            var requestHeader = new Headers();
            requestHeader.append('Content-Type', 'application/json');
            this._token && requestHeader.append('Authorization', `Bearer ${this._token.accessToken}`);
            const requestOptions = {
                method: 'DELETE',
                headers: requestHeader
            };
            const response = await fetch(baseurl + path, requestOptions);
            const result = await response.json();
            return result;
        } catch (error) {
            console.log('errordelete', error);
        }
    }
}