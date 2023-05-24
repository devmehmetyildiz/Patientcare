import Cookies from "universal-cookie";

export default function AxiosErrorHelper(error) {
    if (error) {
        if (error.code === 'ERR_NETWORK') {
            return { type: 'Error', code: 'ERR_NETWORK', description: 'Server Kapalı yada Erişim Yok' }
        }
        if (error.code === 'ERR_BAD_REQUEST' && error.response) {
            console.log('error.response.status: ', error.response.status);
            switch (error.response.status) {
                case 401:
                    return handle401Error(error)
                case 404:
                    return handle404Error(error)
                case 400:
                    return handle400Error(error)
                case 500:
                    return { type: 'Error', code: error.code, description: 'SERVER HATASI' }
                case 403:
                    return { type: 'Error', code: error.response.data.status, description: error.response.data.massage }
                default:
                    return { type: 'Error', code: error.code, description: 'Tanımsız hata' }
            }
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