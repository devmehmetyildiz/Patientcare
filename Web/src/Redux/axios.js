import axios from 'axios';
import cookies from 'universal-cookie';

function getRequest(service, url) {
    return new Promise((resolve, reject) => {
        const localcookies = new cookies();
        axios.get(service + url,
            {
                headers: {
                    Authorization: "Bearer " + localcookies.get('patientcare'),
                    Language: localcookies.get('Language')
                }
            })
            .then(response => resolve(response))
            .catch(error => reject(error))
    })
}

function postRequest(service, url, data) {
    return new Promise((resolve, reject) => {
        const localcookies = new cookies();
        axios.post(service + url, data,
            {
                headers: {
                    Authorization: "Bearer " + localcookies.get('patientcare'),
                    Language: localcookies.get('Language')
                }
            })
            .then(response => resolve(response))
            .catch(error => reject(error))
    })
}

function putRequest(service, url, data) {
    return new Promise((resolve, reject) => {
        const localcookies = new cookies();
        axios.put(service + url, data,
            {
                headers: {
                    Authorization: "Bearer " + localcookies.get('patientcare'),
                    Language: localcookies.get('Language')
                }
            })
            .then(response => resolve(response))
            .catch(error => reject(error))
    })
}

function deleteRequest(service, url, data) {
    return new Promise((resolve, reject) => {
        const localcookies = new cookies();
        axios.delete(service + url,
            {
                headers: {
                    Authorization: "Bearer " + localcookies.get('patientcare'),
                    Language: localcookies.get('Language')
                }
            })
            .then(response => resolve(response))
            .catch(error => reject(error))
    })
}

const instance = {
    get: getRequest,
    post: postRequest,
    put: putRequest,
    delete: deleteRequest
}
export default instance;




