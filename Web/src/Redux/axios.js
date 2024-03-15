import axios from 'axios';



function getRequest(service, url) {
    return new Promise((resolve, reject) => {
        const token = localStorage.getItem('patientcare')
        const language = localStorage.getItem('Language')
        axios.get(service + url,
            {
                headers: {
                    Authorization: "Bearer " + token,
                    Language: language
                }
            })
            .then(response => resolve(response))
            .catch(error => reject(error))
    })
}

function postRequest(service, url, data) {
    return new Promise((resolve, reject) => {
        const token = localStorage.getItem('patientcare')
        const language = localStorage.getItem('Language')
        axios.post(service + url, data,
            {
                headers: {
                    Authorization: "Bearer " + token,
                    Language: language
                }
            })
            .then(response => resolve(response))
            .catch(error => reject(error))
    })
}

function putRequest(service, url, data) {
    return new Promise((resolve, reject) => {
        const token = localStorage.getItem('patientcare')
        const language = localStorage.getItem('Language')
        axios.put(service + url, data,
            {
                headers: {
                    Authorization: "Bearer " + token,
                    Language: language
                }
            })
            .then(response => resolve(response))
            .catch(error => reject(error))
    })
}

function deleteRequest(service, url, data) {
    return new Promise((resolve, reject) => {
        const token = localStorage.getItem('patientcare')
        const language = localStorage.getItem('Language')
        axios.delete(service + url,
            {
                headers: {
                    Authorization: "Bearer " + token,
                    Language: language
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




