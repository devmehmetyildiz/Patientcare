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
    localStorage.removeItem("patientcare")
    localStorage.removeItem("patientcareRefresh")
    localStorage.removeItem("patientcarelanguage")
    if (window.location.pathname !== "/Login") {
    const params = new URLSearchParams(window.location.search);
        const redirecturl = params.get('redirecturl');
        if (redirecturl) {
            params.set('redirecturl', window.location.pathname)
        } else {
            params.append('redirecturl', window.location.pathname)
        }
        window.location = `/Login?${params.toString().replace(/%2F/g, '/')}`
    }
    if (window.location.pathname === "/Login") {
        return { type: 'Error', code: error.code, description: 'Kullanıcı Adı veya şifre Hatalı' }
    } else {
        return { type: 'Error', code: error.code, description: 'Lütfen Tekrardan Giriş Yapınız' }
    }
}