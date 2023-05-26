import axios from 'axios';
import cookies from 'universal-cookie';

const acInstanse = axios.create({
    withCredentials: true
});
const localcookies = new cookies();
acInstanse.defaults.headers.common['Authorization'] = "Bearer " + localcookies.get('patientcare')

function getRequest(service, url) {
    return new Promise((resolve, reject) => {
        acInstanse.get(service + url)
            .then(response => resolve(response))
            .catch(error => reject(error))
    })
}

function postRequest(service, url, data) {
    return new Promise((resolve, reject) => {
        acInstanse.post(service + url, data)
            .then(response => resolve(response))
            .catch(error => reject(error))
    })
}

function putRequest(service, url, data) {
    return new Promise((resolve, reject) => {
        acInstanse.put(service + url, data)
            .then(response => resolve(response))
            .catch(error => reject(error))
    })
}

function deleteRequest(service, url, data) {
    return new Promise((resolve, reject) => {
        acInstanse.delete(service + url, data)
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




