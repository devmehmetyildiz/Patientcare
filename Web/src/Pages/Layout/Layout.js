import React, { Component } from 'react'
import AppRoutes from '../../Routes'
import Navbar from '../../Common/Navbar'
import { Sidebar } from '../../Common/Sidebar'
import notification from '../../Utils/Notification'
import Cookies from 'universal-cookie'
import LoadingPage from '../../Utils/LoadingPage'

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
    ]
    if (!routes.includes(window.location.pathname)) {
      GetActiveUser()
      GetUserRoles()
      GetTableMeta()
      GetUserMeta()
    }
  }

  componentDidUpdate() {
    const { Profile, removenotification,
      Users, removeUsernotification } = this.props
    notification(Profile.notifications, removenotification)
    notification(Users.notifications, removeUsernotification)
    this.handleLanguage()
  }

  render() {
    const { Profile, iconOnly, seticonOnly, history, logOut, isMobile } = this.props
    return (
      Profile.isLogging ?
        <LoadingPage />
        :
        <div className='bg-white dark:bg-Contentbg ' >
          <Navbar iconOnly={isMobile ? true : iconOnly} seticonOnly={seticonOnly} Profile={Profile} logOut={logOut} isMobile={isMobile} />
          <div className='flex flex-row justify-start items-start '>
            <Sidebar history={history} iconOnly={isMobile ? true : iconOnly} seticonOnly={seticonOnly} Profile={Profile} isMobile={isMobile} />
            <div className={`mt-[58.61px] p-4 w-full min-w-[0px] contentWrapper`}>
              <div className='w-full '>
                <AppRoutes />
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
