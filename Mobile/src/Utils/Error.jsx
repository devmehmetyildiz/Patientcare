import { Services } from '../Utils/Constants'


export default function Handleerror(request, navigate) {
    const { status, data } = request
    console.log('status: ', status);
    console.log('data: ', data);

    switch (status) {
        case 401:
            console.log("auth hatası alındı")
            navigate.GoTo('Login')
            break;

        default:
            break;
    }
}



function handle401Error(error, navigate) {
    /* if (window.location.pathname !== "/Login") {
        window.location = `/Login?redirecturl=${window.location.pathname}`
    }
    if (window.location.pathname === "/Login") {
        return { type: 'Error', code: error.code, description: 'Kullanıcı Adı veya şifre Hatalı' }
    } else {
        return { type: 'Error', code: error.code, description: 'Lütfen Tekrardan Giriş Yapınız' }
    } */
    navigate.GoTo("Login")
}
