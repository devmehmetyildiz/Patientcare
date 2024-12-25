import axios from 'axios';
import { STORAGE_KEY_PATIENTCARE_ACCESSTOKEN, STORAGE_KEY_PATIENTCARE_LANGUAGE } from '../Utils/Constants';



function getRequest(service, url, params) {
    return new Promise((resolve, reject) => {
        const token = localStorage.getItem(STORAGE_KEY_PATIENTCARE_ACCESSTOKEN)
        const language = localStorage.getItem(STORAGE_KEY_PATIENTCARE_LANGUAGE)
        axios.get(service + url,
            {
                headers: {
                    Authorization: "Bearer " + token,
                    Language: language
                },
                params: (params && { ...params })
            })
            .then(response => resolve(response))
            .catch(error => reject(error))
    })
}

function postRequest(service, url, data) {
    return new Promise((resolve, reject) => {
        const token = localStorage.getItem(STORAGE_KEY_PATIENTCARE_ACCESSTOKEN)
        const language = localStorage.getItem(STORAGE_KEY_PATIENTCARE_LANGUAGE)
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

function putRequest(service, url, data, contentType) {
    return new Promise((resolve, reject) => {
        const token = localStorage.getItem(STORAGE_KEY_PATIENTCARE_ACCESSTOKEN)
        const language = localStorage.getItem(STORAGE_KEY_PATIENTCARE_LANGUAGE)
        axios.put(service + url, data,
            {
                headers: {
                    Authorization: "Bearer " + token,
                    Language: language,
                    contentType
                }
            })
            .then(response => resolve(response))
            .catch(error => reject(error))
    })
}

function deleteRequest(service, url, data) {
    return new Promise((resolve, reject) => {
        const token = localStorage.getItem(STORAGE_KEY_PATIENTCARE_ACCESSTOKEN)
        const language = localStorage.getItem(STORAGE_KEY_PATIENTCARE_LANGUAGE)
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




