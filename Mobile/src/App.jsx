import { Provider } from 'react-redux'
import { store } from './Redux/store'
import Routes from './Routes'
import Toast from 'react-native-toast-message'

export default function App() {

  return (
    <Provider store={store}>
        <Routes />
        <Toast />
    </Provider>

  )
}
