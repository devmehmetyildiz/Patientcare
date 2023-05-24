import axios from 'axios';
import cookies from 'universal-cookie';

// Next we make an 'instance' of it
const acInstanse = axios.create({
    withCredentials: true
});
// Where you would set stuff like your 'Authorization' header, etc ...
const localcookies = new cookies();
acInstanse.defaults.headers.common['Authorization'] = "Bearer  " + localcookies.get('patientcare')
// Also add/ configure interceptors && all the other cool stuff

function getRequest(service,url) {
    return new Promise((resolve, reject) => {
        acInstanse.get(service+url)
            .then(response => resolve(response))
            .catch(error => reject(error))
    })
}

function postRequest(service,url, data) {
    return new Promise((resolve, reject) => {
        acInstanse.post(service+url, data)
            .then(response => resolve(response))
            .catch(error => reject(error))
    })
}

const instance = {
    get: getRequest,
    post: postRequest
}
export default instance;




