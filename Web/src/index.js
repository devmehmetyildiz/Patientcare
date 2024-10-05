import React from "react";
import { createRoot } from "react-dom/client";
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux'
import rootSlice from './Redux'
import thunk from 'redux-thunk'
import 'semantic-ui-css/semantic.min.css'
import AuthProvider from "./Provider/AuthProvider";
import FormProvider from "./Provider/FormProvider";
import { handleauth } from "./Redux/ProfileSlice";
import { tokenMiddleware, notificationMiddleware } from './Utils/Middlewares'
import './i18n';
import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./Api/api";
import config from "./Config";

const store = configureStore({
  reducer: rootSlice,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }).concat(
      thunk,
      baseApi.middleware,
      tokenMiddleware,
      notificationMiddleware
    ),
  devTools: config.env !== 'production'
});

console.log('store: ', store.getState());
store.dispatch({
  type: 'START_MIDDLEWARES'
})

let token = localStorage.getItem('patientcare')
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
