import React, { Component } from 'react'
import Cookies from 'universal-cookie'
import Routes from '../../Routes'
import { Sidebar, LoadingPage, Navbar } from '../../Components'
import cookies from 'universal-cookie';
export default class Layout extends Component {

  componentDidMount() {
    const { GetActiveUser, GetUserRoles, GetTableMeta, GetUserMeta, Checktoken,GetUsagetypes } = this.props
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

  render() {
    const { Profile, Files, iconOnly, seticonOnly, history, logOut, isMobile, hideMobile, sethideMobile, handleViewmodal, Istokenchecking,Usagetypes } = this.props
    return (
      Istokenchecking || Profile.isLogging || Profile.isFetching ?
        <LoadingPage />
        :
        <div className='bg-white dark:bg-Contentbg overflow-hidden' >
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
          />
          <div className='flex flex-row justify-start items-start '>
            <Sidebar
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
