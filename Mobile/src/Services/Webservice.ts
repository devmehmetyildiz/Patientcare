import { TokenModel, WebserviceconfigModel } from '../Models';
import axios from 'axios';
import Errorhandler from '../Utils/Errorhandler';

export class Webservice {
    static _config: WebserviceconfigModel;
    static _token: TokenModel;

    public static Configure(configuration: WebserviceconfigModel) {
        this._config = configuration;
    }

    public static ConfigureToken(configuration: TokenModel) {
        this._token = configuration;
    }

    public static async doGet(baseurl: string, path: string) {
        try {
            const response = await this.getRequest(baseurl, '1' + path);
            return response;
        } catch (error) {
            throw Errorhandler(error)
        }
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

    private static getRequest(service: string, url: string) {
        const config = {
            headers: {
                "Content-Type": 'application/json',
                'Authorization': `Bearer ${this._token?.accessToken}`
            }
        }
        return new Promise((resolve, reject) => {
            axios.get(service + url, config)
                .then(response => resolve(response.data))
                .catch(function (error) {
                    reject(error)
                })
        })
    }
    private static postRequest(service: string, url: string, data: any) {
        const config = {
            headers: {
                "Content-Type": 'application/json',
                'Authorization': `Bearer ${this._token?.accessToken}`
            }
        }
        return new Promise((resolve, reject) => {
            axios.post(service + url, data, config)
                .then(response => resolve(response))
                .catch(function (error) {
                    reject(error)
                })
        })
    }
    private static putRequest(service: string, url: string, data: any) {
        const config = {
            headers: {
                "Content-Type": 'application/json',
                'Authorization': `Bearer ${this._token?.accessToken}`
            }
        }
        return new Promise((resolve, reject) => {
            axios.put(service + url, data, config)
                .then(response => resolve(response))
                .catch(function (error) {
                    reject(error)
                })
        })
    }
    private static deleteRequest(service: string, url: string) {
        const config = {
            headers: {
                "Content-Type": 'application/json',
                'Authorization': `Bearer ${this._token?.accessToken}`
            }
        }
        return new Promise((resolve, reject) => {
            axios.delete(service + url, config)
                .then(response => resolve(response))
                .catch(function (error) {
                    reject(error)
                })
        })
    }
}