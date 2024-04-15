import React, { Component } from 'react';
import Layout from './Containers/Layout/Layout';
import { withRouter } from 'react-router-dom';
import { FormContext } from './Provider/FormProvider';
import Routes from './Routes';
import NotificationHandler from './Utils/NotificationHandler';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
class App extends Component {

  constructor(props) {
    super(props)

    this.prepareCss()

    this.state = {
      iconstate: false,
      isFullPageLayout: true,
      isMobile: false,
      hideMobile: false
    }
  }

  componentDidMount() {
    this.onRouteChanged();
    this.setState({ isMobile: this.mediaQuery.matches });
    this.mediaQuery.addEventListener('change', this.handleMediaQueryChange);
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.context.setFormstates({})
      this.onRouteChanged();
    }
  }

  componentWillUnmount() {
    document.body.removeChild(this.state.script);
    document.body.removeChild(this.state.script1);
  }

  render() {
    return (
      <React.Fragment>
        <ToastContainer />
        <NotificationHandler />
        {this.state.isFullPageLayout ?
          <div className='w-full' >
            <Routes />
          </div>
          :
          <Layout {...this.props}
            isMobile={this.state.isMobile}
            iconOnly={this.state.iconstate}
            seticonOnly={this.setIconmode}
            hideMobile={this.state.hideMobile}
            sethideMobile={this.sethideMobile} />
        }
      </React.Fragment>
    );
  }

  onRouteChanged = () => {
    window.scrollTo(0, 0);
    const fullPageLayoutRoutes = ['Login', 'login', 'Register', 'register', 'Forgetpassword', 'forgetpassword', 'Passwordreset'];
    const path = this.props.location.pathname.split('/').length > 0 ? this.props.location.pathname.split('/')[1] : this.props.location.pathname.replace('/', '')
    document.title = fullPageLayoutRoutes.includes(path) ? "Elder Camp" : "Elder Camp"//path
    for (let i = 0; i < fullPageLayoutRoutes.length; i++) {
      if (path === fullPageLayoutRoutes[i]) {
        this.setState({
          isFullPageLayout: true
        })
        break;
      } else {
        this.setState({
          isFullPageLayout: false
        })
      }
    }
  }

  handleMediaQueryChange = (event) => {
    this.setState({ isMobile: event.matches });
  }

  setIconmode = () => {
    this.setState({ iconstate: !this.state.iconstate })
  }

  sethideMobile = () => {
    this.setState({ hideMobile: !this.state.hideMobile })
  }

  prepareCss = () => {
    const script = document.createElement('script');
    const script1 = document.createElement('script');
    script.src = "https://unpkg.com/react/umd/react.production.min.js";
    script.async = true;
    document.body.appendChild(script);
    script1.src = "https://unpkg.com/react-collapse/build/react-collapse.min.js";
    script1.async = true;
    document.body.appendChild(script1);
    this.mediaQuery = window.matchMedia('(max-width: 768px)');
  }
}
export default withRouter(App);
App.contextType = FormContext
