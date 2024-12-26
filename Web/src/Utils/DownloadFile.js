import config from "../Config";
import { ROUTES, STORAGE_KEY_PATIENTCARE_ACCESSTOKEN, STORAGE_KEY_PATIENTCARE_LANGUAGE } from "./Constants";
import axios from 'axios'
import validator from "./Validator";

const errorMessage = {
    en: "File Download Error",
    tr: "Dosya İndirme Hatası"
}

const DownloadPngFile = ({ fileID, Profile, fillnotification, setImg }) => {
    if (validator.isUUID(fileID) && Profile && fillnotification && setImg) {
        const token = localStorage.getItem(STORAGE_KEY_PATIENTCARE_ACCESSTOKEN)
        const language = localStorage.getItem(STORAGE_KEY_PATIENTCARE_LANGUAGE)
        axios.get(`${config.services.File}${ROUTES.FILE}/Downloadfile/${fileID}`, {
            responseType: 'blob',
            headers: {
                Authorization: "Bearer " + token,
                Language: language
            }
        }).then((res) => {
            const fileType = res.headers['content-type']
            const blob = new Blob([res.data], {
                type: fileType
            });
            const url = window.URL.createObjectURL(blob);
            setImg && setImg(url)
        }).catch((err) => {
            fillnotification([{ type: 'Error', code: errorMessage[Profile.Language], description: err.message }])
            console.log(err.message)
            return null
        });
    }
}

export default DownloadPngFile