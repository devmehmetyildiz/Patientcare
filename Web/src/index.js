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
import { STORAGE_KEY_PATIENTCARE_ACCESSTOKEN } from "./Utils/Constants";
import PreviousUrlProvider from "./Provider/PreviousUrlProvider";

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

let token = localStorage.getItem(STORAGE_KEY_PATIENTCARE_ACCESSTOKEN)
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
          <PreviousUrlProvider>
            <App />
          </PreviousUrlProvider>
        </BrowserRouter>
      </Provider>
    </FormProvider>
  </DataProvider>
</AuthProvider>);

export default store
