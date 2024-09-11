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
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const formContext = useContext(FormContext);

  const [visible, setVisible] = useState(false)
  const [iconstate, setIconstate] = useState(false);
  const [isFullPageLayout, setIsFullPageLayout] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [hideMobile, setHideMobile] = useState(false);
  const [mediaQuery, setMediaQuery] = useState(window.matchMedia('(max-width: 768px)'));
  const dispatch = useDispatch()

  const handleVisibilityChange = () => {
    setVisible(!document.hidden)
  }

  useEffect(() => {
    props.setI18n({ t: t, i18n: i18n })
  }, [])

  useEffect(() => {
    prepareCss();
    onRouteChanged();
    setIsMobile(mediaQuery.matches);

    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };

    mediaQuery.addEventListener('change', handleMediaQueryChange);

    return () => {
      document.body.removeChild(document.querySelector('script[src="https://unpkg.com/react/umd/react.production.min.js"]'));
      document.body.removeChild(document.querySelector('script[src="https://unpkg.com/react-collapse/build/react-collapse.min.js"]'));
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    };
  }, [mediaQuery]);

  useEffect(() => {
    formContext.setFormstates({});
    onRouteChanged();
  }, [location]);

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  useEffect(() => {
    if (visible) {
      dispatch({
        type: 'START_MIDDLEWARES'
      })
    } else {
      dispatch({
        type: 'STOP_MIDDLEWARES'
      })
    }
  }, [visible])

  const onRouteChanged = () => {
    window.scrollTo(0, 0);
    const fullPageLayoutRoutes = ['Login', 'login', 'Register', 'register', 'Forgetpassword', 'forgetpassword', 'Passwordreset'];
    const path = location.pathname.split('/').length > 0 ? location.pathname.split('/')[1] : location.pathname.replace('/', '');

    document.title = fullPageLayoutRoutes.includes(path) ? "Elder Camp" : "Elder Camp";

    const isFullPage = fullPageLayoutRoutes.includes(path);
    setIsFullPageLayout(isFullPage);
  };

  const prepareCss = () => {
    const script = document.createElement('script');
    const script1 = document.createElement('script');
    script.src = "https://unpkg.com/react/umd/react.production.min.js";
    script.async = true;
    document.body.appendChild(script);
    script1.src = "https://unpkg.com/react-collapse/build/react-collapse.min.js";
    script1.async = true;
    document.body.appendChild(script1);
  };

  return (
    <React.Fragment>
      <ToastContainer />
      <NotificationHandler />
      {isFullPageLayout ? (
        <div className='w-full'>
          <Routes />
        </div>
      ) : (
        <Layout
          {...props}
          isMobile={isMobile}
          iconOnly={iconstate}
          seticonOnly={() => setIconstate(!iconstate)}
          hideMobile={hideMobile}
          sethideMobile={() => setHideMobile(!hideMobile)}
        />
      )}
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  Profile: state.Profile
})

const mapDispatchToProps = { setI18n }

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App))
