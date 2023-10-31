import Cookies from "universal-cookie";
import config from "../Config";

export default function AxiosErrorHelper(error) {
    if (error) {
        if (error.code === 'ERR_NETWORK') {
            let domain = (error && error.config && error.config.url) ? error.config.url : 'undefined'
            if (domain !== 'undefined') {
                let parsedurl = new URL(domain)
                domain = Object.keys(config.services).find(key => config.services[key] === `${parsedurl.origin}/`)
            }
            return domain !== 'undefind' ?
                { type: 'Error', code: `Network Error`, description: `${domain} service unavaliable` }
                : { type: 'Error', code: 'Network Error', description: 'Undefined service unavaliable' }
        }
        if (error.code === 'ERR_BAD_REQUEST') {
            switch (error.response.status) {
                case 401:
                    return handle401Error(error)
                default:
                    let title = (error.response && error.response.data && error.response.data.description) ? error.response.data.description : 'Undefined Error From Server'
                    let notifications = []
                    if (error.response && error.response.data) {
                        if (error.response.data.list) {
                            let listoferror = error.response.data.list
                            listoferror.forEach(err => {
                                notifications.push({ type: 'Error', code: err.code ? err.code : 'Server hatası', description: err.description ? err.description : 'Tanımlanamayan hata' })
                            });
                        } else {
                            notifications.push({ type: 'Error', code: error.response.data.code, description: error.response.data.description })
                        }
                    } else {
                        notifications.push({ type: 'Error', code: title, description: 'Undefines Error From Server' })
                    }
                    return notifications
            }
        }
        if (error.code === 'ERR_BAD_RESPONSE') {
            let title = (error.response && error.response.data && error.response.data.type) ? error.response.data.type : (error.name ? error.name : 'Undefined Error From Server')
            let notifications = []
            if (error.response && error.response.data) {
                if (error.response.data.list) {
                    let listoferror = error.response.data.list
                    listoferror.forEach(err => {
                        notifications.push({ type: 'Error', code: err.code ? err.code : 'Server hatası', description: err.description ? err.description : 'Tanımlanamayan hata' })
                    });
                } else {
                    notifications.push({ type: 'Error', code: error.response.data.type, description: error.response.data.description })
                }
            } else {
                notifications.push({ type: 'Error', code: title, description: 'Undefines Error From Server' })
            }
            return notifications
        }
    }

    return null
}



function handle401Error(error) {
    const localcookies = new Cookies();
    localcookies.remove("patientcare")
    if (window.location.pathname !== "/Login") {
        window.location = `/Login?redirecturl=${window.location.pathname}`
    }
    if (window.location.pathname === "/Login") {
        return { type: 'Error', code: error.code, description: 'Kullanıcı Adı veya şifre Hatalı' }
    } else {
        return { type: 'Error', code: error.code, description: 'Lütfen Tekrardan Giriş Yapınız' }
    }
}


function handle404Error(error) {
    let reponse = null
    if (error.response && error.response.data) {
        let data = error.response.data
        if (Array.isArray(data)) {
            data.forEach(err => {
                if (err.status && err.massage) {
                    reponse = { type: 'Error', code: err.status, description: err.massage }
                }
                if (err.Msg && error.request.responseURL) {
                    reponse = { type: 'Error', code: err.Msg, description: error.request.responseURL }
                }
            });
        } else {
            if (data.status && data.massage) {
                reponse = { type: 'Error', code: data.status, description: data.massage }
            }
            if (data.Msg && error.request.responseURL) {
                reponse = { type: 'Error', code: data.Msg, description: error.request.responseURL }
            }
        }
    } else {
        reponse = { type: 'Error', code: error.code, description: 'URL BULUNAMADI' }
    }
    return reponse

}

function handle400Error(error) {
    if (error.response && error.response.data) {
        let data = error.response.data
        if (Array.isArray(Object.keys(data?.errors))) {
            if (Array.isArray(Object.values(data?.errors))) {
                return { type: 'Error', code: data.title, description: Object.values(data?.errors)[0] }
            } else {
                data?.errors.forEach(err => {
                    if (err.status && err.massage) {
                        return { type: 'Error', code: err.status, description: err.massage }
                    }
                    if (err.Msg && error.request.responseURL) {
                        return { type: 'Error', code: err.Msg, description: error.request.responseURL }
                    }

                });
            }
        } else {
            if (data.status && data.massage) {
                return { type: 'Error', code: data.status, description: data.massage }
            }
            if (data.Msg && error.request.responseURL) {
                return { type: 'Error', code: data.Msg, description: error.request.responseURL }
            }
        }
        return { type: 'Error', code: error.code, description: 'URL BULUNAMADI' }
    }

}