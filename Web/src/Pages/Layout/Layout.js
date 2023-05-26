import React, { Component } from 'react'
import AppRoutes from '../../AppRoutes'
import Navbar from '../../Common/Navbar'
import { Sidebar } from '../../Common/Sidebar'
import notification from '../../Utils/Notification'

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
    const { Profile, removenotification } = this.props
    notification(Profile.notifications, removenotification)
  }

  render() {
    const { Profile, iconOnly, seticonOnly, history, logOut } = this.props

    return (
      <div className='bg-[#f2f2f3] dark:bg-Contentbg' >
        <Navbar iconOnly={iconOnly} seticonOnly={seticonOnly} Profile={Profile} logOut={logOut} />
        <div className='flex flex-row justify-start items-start '>
          <Sidebar history={history} iconOnly={iconOnly} seticonOnly={seticonOnly} Profile={Profile} />
          <div className={`mt-[58.61px] p-4 w-full min-w-[0px] contentWrapper`}>
            <div className='w-full '>
              <AppRoutes />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
