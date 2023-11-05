import React, { Component } from 'react';
import Layout from './Containers/Layout/Layout';
import { withRouter } from 'react-router-dom';
import { FormContext } from './Provider/FormProvider';
import Routes from './Routes';
import NotificationHandler from './Utils/NotificationHandler';

class App extends Component {

  constructor(props) {
    super(props)
    const script = document.createElement('script');
    const script1 = document.createElement('script');
    script.src = "https://unpkg.com/react/umd/react.production.min.js";
    script.async = true;
    document.body.appendChild(script);
    script1.src = "https://unpkg.com/react-collapse/build/react-collapse.min.js";
    script1.async = true;
    document.body.appendChild(script1);
    this.mediaQuery = window.matchMedia('(max-width: 768px)'); // Change the breakpoint value as per your requirements
    const isFullPageLayout = false
    const iconstate = false
    this.state = { iconstate, isFullPageLayout, isMobile: false, hideMobile: false }
  }

  setIconmode = () => {
    this.setState({ iconstate: !this.state.iconstate })
  }

  sethideMobile = () => {
    this.setState({ hideMobile: !this.state.hideMobile })
  }

  componentDidMount() {
    this.onRouteChanged();
    this.setState({ isMobile: this.mediaQuery.matches });
    this.mediaQuery.addEventListener('change', this.handleMediaQueryChange);
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged();
      this.context.setFormstates({})
    }
  }

  handleMediaQueryChange = (event) => {
    this.setState({ isMobile: event.matches });
  }

  onRouteChanged = () => {
    window.scrollTo(0, 0);
    const fullPageLayoutRoutes = ['Login', 'login', 'Register', 'register', 'Forgetpassword', 'forgetpassword', 'Passwordreset'];
    const path = this.props.location.pathname.split('/').length > 0 ? this.props.location.pathname.split('/')[1] : this.props.location.pathname.replace('/', '')
    document.title = fullPageLayoutRoutes.includes(path) ? "Star Note" : path
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

  componentWillUnmount() {
    document.body.removeChild(this.state.script);
    document.body.removeChild(this.state.script1);
  }

  render() {
    return (
      <React.Fragment>
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


}
App.contextType = FormContext
export default withRouter(App);
