import React, { Component } from 'react'
import { FaUserAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { Button, Dropdown, Header, Icon, Modal } from 'semantic-ui-react'
import Search from '../Search'
import { Profilephoto } from '..'

export class Navbar extends Component {
  state = { open: false, searchWord: '' }


  handleOpen = () => this.setState({ open: true })

  handleClose = () => this.setState({ open: false })

  handleOpendefaultpage = () => {
    const { Profile, history } = this.props
    const { meta } = Profile
    if (meta.Defaultpage) {
      history.push(meta.Defaultpage)
    }
  }

  render() {
    const { iconOnly, seticonOnly, Profile, isMobile, sethideMobile, hideMobile, Usagetypes, history, onlyTitle, handleNotificationSidebar, fillnotification, Files } = this.props

    const t = Profile?.i18n?.t

    let usagetypePP = (Usagetypes?.list || []).find(u => u.Value === 'PP')?.Uuid || null
    let file = (Files?.list || []).filter(u => u.ParentID === Profile?.meta?.Uuid).find(u => (((u.Usagetype || '').split(',')) || []).includes(usagetypePP))

    const trigger = (
      <div className='flex flex-row justify-center items-center select-none'>
        {file ? <Profilephoto
          fileID={file?.Uuid}
          fillnotification={fillnotification}
          Profile={Profile}
          Imgheigth="30px"
        /> : <FaUserAlt className='text-white' />}
        <div className={`h-[58.61px] text-white mx-4 my-auto transition-all ease-in-out duration-500  text-center flex flex-col justify-center items-center `}>
          <p className='m-0 text-sm font-semibold tracking-wider font-Common '>{Profile?.username}</p>
          <p className='m-0 text-xs text-white dark:text-TextColor  '>
            <span className='mr-[2px]'>{Profile?.meta?.Roles?.length > 0 && Profile?.meta?.Roles[0]?.Name}</span>
          </p>
        </div>
      </div>
    )

    return (
      onlyTitle ?
        <nav className={`w-[100%] h-[58.61px] bg-[#2355a0] dark:bg-Contentfg mx-auto flex flex-row justify-between items-center fixed top-0 ${Profile.Ismobile ? 'pl-[12px]' : 'pl-[20px]'} z-50`}>
          <div className={`${!Profile.Ismobile && 'absolute inset-0'} flex flex-row justify-center items-center group cursor-pointer`}>
            <p className='select-none m-0 font-Common font-bold text-[1.84em] line-none text-white dark:text-TextColor'>ELDER</p>
            <p className='select-none m-0 font-Common font-bold text-[1.84em] line-none text-[#7eabc5] dark:text-TextColor'>CAMP</p>
          </div>
        </nav >
        : <nav className={`w-[100%] h-[58.61px] bg-[#2355a0] dark:bg-Contentfg mx-auto flex flex-row justify-between items-center fixed top-0 ${Profile.Ismobile ? 'pl-[12px]' : 'pl-[20px]'} z-50 pt-[8px]`}>
          <div className={`${Profile.Ismobile ? '' : 'hidden'}`} onClick={() => { sethideMobile(hideMobile) }}>
            <Icon size='large' className='text-white' name={hideMobile ? 'angle double right' : 'angle double left'} />
          </div>
          <div className={`group flex flex-col cursor-pointer justify-center items-center ${isMobile ? 'hidden' : 'visible'}`} onClick={() => { seticonOnly(!iconOnly) }}>
            <div className='h-[2px] group-hover:bg-[#747474] bg-white dark:bg-[#3d3d3d]  w-[20px]' />
            <div className='h-[2px] group-hover:bg-[#747474] bg-white dark:bg-[#3d3d3d] my-[3px] w-[20px]' />
            <div className='h-[2px] group-hover:bg-[#747474] bg-white dark:bg-[#3d3d3d]  w-[20px]' />
          </div>
          <div className={`absolute left-0 right-0 -z-10 flex flex-row justify-center items-center group `}   >
            <div onClick={this.handleOpendefaultpage} className='flex flex-row justify-center items-center group cursor-pointer'>
              <p className='select-none m-0 font-Common font-bold text-[1.84em] line-none text-white dark:text-TextColor'>ELDER</p>
              <p className='select-none m-0 font-Common font-bold text-[1.84em] line-none text-[#7eabc5] dark:text-TextColor'>CAMP</p>
            </div>
          </div>
          <div className=' flex flex-row justify-center items-center gap-4'>
            <Search history={history} />
            <div
              className='cursor-pointer group'
              onClick={() => {
                handleNotificationSidebar()
              }}
            >
              <Icon name='bell' className='text-white group-hover:text-gray-300 transition-all duration-500' />
            </div>
            <div className='flex flex-row justify-center items-center h-full'>
              <Dropdown icon={null} trigger={trigger} basic className="h-full block">
                <Dropdown.Menu className='!right-[1%] !left-auto '>
                  <Dropdown.Item>
                    <Link to={`/Users/${Profile?.meta?.Uuid}`} className='text-[#3d3d3d] hover:text-[#3d3d3d]'><Icon className='id card ' />{t('Navbar.Label.Profile')}</Link>
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <Link to='/profile/change-password' className='text-[#3d3d3d] hover:text-[#3d3d3d]'> <Icon className='lock' />{t('Navbar.Label.Changepassword')}</Link>
                  </Dropdown.Item>
                  <Dropdown.Item className='layout-menu-item logout' >
                    <Modal
                      open={this.state.open}
                      trigger={<Button>{t('Navbar.Label.Exit')}</Button>}
                      onClose={() => this.handleClose()}
                      onOpen={() => this.handleOpen()}
                    >
                      <Header icon='archive' content='Uygulamadan Çıkmak Üzeresiniz!' />
                      <Modal.Content>
                        <p>
                          {t('Navbar.Label.ExitWarning')}
                        </p>
                      </Modal.Content>
                      <Modal.Actions>
                        <Button color='red' onClick={() => this.handleClose()} >
                          <Icon name='remove' /> {t('Common.No')}
                        </Button>
                        <Button color='green' onClick={() => { this.LogoutHandler() }}>
                          <Icon name='checkmark' /> {t('Common.Yes')}
                        </Button>
                      </Modal.Actions>
                    </Modal>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </nav>
    )
  }

  LogoutHandler = () => {
    const { logOut } = this.props
    this.setState({ open: false })
    logOut()
  }

}
export default Navbar