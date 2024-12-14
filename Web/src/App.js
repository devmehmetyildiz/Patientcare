import React, { useState, useEffect, useContext } from 'react';
import Layout from './Containers/Layout/Layout';
import { useLocation, withRouter } from 'react-router-dom';
import { FormContext } from './Provider/FormProvider';
import Routes from './Routes';
import NotificationHandler from './Utils/NotificationHandler';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';
import { connect, useDispatch } from 'react-redux';
import { setI18n } from './Redux/ProfileSlice';

const App = (props) => {
  return (
    <Routes />
  );
};

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = { setI18n }

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App))
