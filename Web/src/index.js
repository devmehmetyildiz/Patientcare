import React from "react";
import { createRoot } from "react-dom/client";
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux'
import rootSlice from './Redux'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import TimerMiddleware from './Utils/TimerMiddleware';
import 'semantic-ui-css/semantic.min.css'
import AuthProvider from "./Provider/AuthProvider";
import FormProvider from "./Provider/FormProvider";
import Cookies from "universal-cookie";
import { handleauth } from "./Redux/ProfileSlice";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootSlice, composeEnhancers(applyMiddleware(thunk, TimerMiddleware)))

store.dispatch({
  type: 'START_TIMER'
})
const localcookies = new Cookies();
let token = localcookies.get('patientcare')
if (token) {
  store.dispatch(handleauth())
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<AuthProvider>
  <FormProvider>
    <Provider store={store}>
      <BrowserRouter >
        <App />
      </BrowserRouter>
    </Provider>
  </FormProvider>
</AuthProvider>);

export default store
