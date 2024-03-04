import React, { Component } from 'react'
import Cookies from 'universal-cookie'
import Routes from '../../Routes'
import { Sidebar as Sidebarcomponent, LoadingPage, Navbar } from '../../Components'
import cookies from 'universal-cookie';
import { Icon, Menu, Segment, SidebarPushable, SidebarPusher, Sidebar, Label } from 'semantic-ui-react';
import Usernotifications from '../../Containers/Usernotifications/Usernotifications';
export default class Layout extends Component {

  constructor(props) {
    super(props)
    this.state = {
      visible: false
    }
  }

  componentDidMount() {
    window.addEventListener("focus", this.onFocus)
    window.addEventListener("blur", this.onBlur);
    const { GetActiveUser, GetUserRoles, GetTableMeta, GetUserMeta, Checktoken, GetUsagetypes } = this.props
    const routes = [
      "/Login",
      "/login",
      "/Register",
      "/register",
      "/Forget-password",
      "/Forgetpassword",
      "/forgetpassword",
      "/Passwordreset",
    ]

    const currentPath = window.location.pathname;

    if (!routes.some(route => currentPath.toLowerCase().startsWith(route.toLowerCase()))) {
      const localcookies = new cookies();
      GetActiveUser()
      GetUserRoles()
      GetTableMeta()
      GetUsagetypes()
      GetUserMeta()
      Checktoken({
        token: localcookies.get('patientcare')
      })
    }
  }

  componentDidUpdate() {
    const { Profile, isMobile, handlemobile } = this.props
    this.handleLanguage()

    if (isMobile !== Profile.Ismobile) {
      handlemobile(isMobile)
    }
  }

  onFocus = () => {
    const { handleFocus } = this.props
    handleFocus(true)
  }

  onBlur = () => {
    const { handleFocus } = this.props
    handleFocus(false)
  }

  render() {
    const { Profile, Files, iconOnly, seticonOnly, history, logOut, isMobile, hideMobile, sethideMobile, handleViewmodal, Istokenchecking, Usagetypes, handleOpen } = this.props
    return (
      Istokenchecking || Profile.isLogging || Profile.isFetching ?
        <LoadingPage />
        :
        <SidebarPushable className='!-m-2' as={Segment}>
          <SidebarPusher >
            <div className=' dark:bg-Contentbg overflow-hidden bg-white' >
              <Navbar
                iconOnly={isMobile ? true : iconOnly}
                seticonOnly={seticonOnly}
                Profile={Profile}
                logOut={logOut}
                isMobile={isMobile}
                Files={Files}
                Usagetypes={Usagetypes}
                sethideMobile={sethideMobile}
                hideMobile={hideMobile}
                handleViewmodal={handleViewmodal}
                history={history}
                handleNotification={handleOpen}
                setVisible={() => { this.setState({ visible: !this.state.visible }) }}
              />
              <div className='flex flex-row justify-start items-start '>
                <Sidebarcomponent
                  history={history}
                  iconOnly={isMobile ? true : iconOnly}
                  seticonOnly={seticonOnly}
                  Profile={Profile}
                  isMobile={isMobile}
                  hideMobile={hideMobile}
                />
                <div className={`mt-[58.61px] p-4 w-full min-w-[0px] contentWrapper`}>
                  <div className='w-full '>
                    <Routes Profile={Profile} />
                  </div>
                </div>
              </div>
            </div>
          </SidebarPusher>
          <Usernotifications />
        </SidebarPushable >
    )
  }

  handleLanguage = () => {
    const { Profile } = this.props
    if (Profile && Profile.meta && Profile.meta.Language) {
      const localcookies = new Cookies();
      localcookies.set('Language', Profile.meta.Language, { path: '/' })
    }
  }
}
