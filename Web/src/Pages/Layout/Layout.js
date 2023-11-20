import React, { Component } from 'react'
import Navbar from '../../Common/Navbar'
import { Sidebar } from '../../Common/Sidebar'
import notification from '../../Utils/Notification'
import Cookies from 'universal-cookie'
import LoadingPage from '../../Utils/LoadingPage'
import Routes from '../../Routes'

export default class Layout extends Component {

  componentDidMount() {
    const { GetActiveUser, GetUserRoles, GetTableMeta, GetUserMeta } = this.props
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
      GetActiveUser()
      GetUserRoles()
      GetTableMeta()
      GetUserMeta()
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
    const { Profile, Files, iconOnly, seticonOnly, history, logOut, isMobile, hideMobile, sethideMobile } = this.props
    return (
      Profile.isLogging || Profile.isFetching ?
        <LoadingPage />
        :
        <div className='bg-white dark:bg-Contentbg overflow-hidden' >
          <Navbar iconOnly={isMobile ? true : iconOnly} seticonOnly={seticonOnly} Profile={Profile} logOut={logOut} isMobile={isMobile} Files={Files} sethideMobile={sethideMobile} hideMobile={hideMobile} />
          <div className='flex flex-row justify-start items-start '>
            <Sidebar history={history} iconOnly={isMobile ? true : iconOnly} seticonOnly={seticonOnly} Profile={Profile} isMobile={isMobile} hideMobile={hideMobile} />
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
