import React from "react";
import { createRoot } from "react-dom/client";
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux'
import rootSlice from './Redux'
import thunk from 'redux-thunk'

import AuthProvider from "./Provider/AuthProvider";
import FormProvider from "./Provider/FormProvider";
import DataProvider from "./Provider/DataProvider";

import { handleauth } from "./Redux/ProfileSlice";
import { tokenMiddleware, notificationMiddleware } from './Utils/Middlewares'
import { configureStore } from "@reduxjs/toolkit";

import config from "./Config";

import './index.css';
import 'semantic-ui-css/semantic.min.css'
import './i18n';

const store = configureStore({
  reducer: rootSlice,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(
      thunk,
      tokenMiddleware,
      notificationMiddleware
    ),
  devTools: config.env !== 'production',
});

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
  <DataProvider>
    <FormProvider>
      <Provider store={store}>
        <BrowserRouter >
          <App />
        </BrowserRouter>
      </Provider>
    </FormProvider>
  </DataProvider>
</AuthProvider>);

export default store
