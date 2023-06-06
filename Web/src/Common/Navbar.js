import React, { Component } from 'react'
import { FaUserAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { Button, Dropdown, Header, Icon, Modal } from 'semantic-ui-react'
import { ROUTES } from '../Utils/Constants'
import config from '../Config'
export class Navbar extends Component {
  state = { open: false }

  handleOpen = () => this.setState({ open: true })

  handleClose = () => this.setState({ open: false })

  render() {
    const { iconOnly, seticonOnly, Profile } = this.props
    const ishavePP = (Profile?.meta?.Files || []).find(u => u.Usagetype === 'PP')


    const trigger = (
      <div className='flex flex-row justify-center items-center select-none'>
        {ishavePP ? <img alt='pp' src={`${config.services.File}${ROUTES.FILE}/Downloadfile/${ishavePP.Uuid}`} className="rounded-full" style={{ width: '30px', height: '30px' }} /> : <FaUserAlt className='text-white' />}
        <div className={`h-[58.61px] text-white mx-4 my-auto transition-all ease-in-out duration-500  text-center flex flex-col justify-center items-center `}>
          <p className='m-0 text-sm font-semibold tracking-wider font-Common '>{Profile.username}</p>
          <p className='m-0 text-xs text-white dark:text-TextColor  '>
            {Profile.roles.map((role, index) => {
              return <span key={index + role} className='mr-[2px]'>{role}</span>
            })}
          </p>
        </div>
      </div>
    )

    return (
      <nav
        className=" w-[100%] h-[58.61px] bg-[#2b7694] dark:bg-Contentfg mx-auto flex flex-row justify-between items-center fixed top-0 pl-[20px] z-50">
        <div className='group flex flex-col cursor-pointer justify-center items-center' onClick={() => { seticonOnly(!iconOnly) }}>
          <div className='h-[2px] group-hover:bg-[#747474] bg-white dark:bg-[#3d3d3d]  w-[20px]' />
          <div className='h-[2px] group-hover:bg-[#747474] bg-white dark:bg-[#3d3d3d] my-[3px] w-[20px]' />
          <div className='h-[2px] group-hover:bg-[#747474] bg-white dark:bg-[#3d3d3d]  w-[20px]' />
        </div>
        < div className='p-2 w-[250px] flex justify-center items-center' >
          <p className='select-none m-0 font-Common font-bold text-[1.84em] line-none text-white dark:text-TextColor'>
            ELDER
            <span className='text-[#c5a47e]'>CAMP</span>
          </p>
        </div >
        <div className='flex flex-row justify-center items-center h-full'>
          <Dropdown icon={null} trigger={trigger} basic className="h-full block">
            <Dropdown.Menu className='!right-[1%] !left-auto '>
              <Dropdown.Item>
                <Link to='/Profile/Edit' className='text-[#3d3d3d] hover:text-[#3d3d3d]'><Icon className='id card ' />Profili Düzenle</Link>
              </Dropdown.Item>
              <Dropdown.Item>
                <Link to='/profile/change-password' className='text-[#3d3d3d] hover:text-[#3d3d3d]'> <Icon className='lock' /> Parola Değiştir </Link>
              </Dropdown.Item>
              <Dropdown.Item className='layout-menu-item logout'
              >
                <Modal
                  open={this.state.open}
                  trigger={<Button>Çıkış Yap</Button>}
                  onClose={() => this.handleClose()}
                  onOpen={() => this.handleOpen()}
                >
                  <Header icon='archive' content='Uygulamadan Çıkmak Üzeresiniz!' />
                  <Modal.Content>
                    <p>
                      Uygulamadan Çıkmak istediğinize emin misiniz?
                    </p>
                  </Modal.Content>
                  <Modal.Actions>
                    <Button color='red' onClick={() => this.handleClose()} >
                      <Icon name='remove' /> Hayır
                    </Button>
                    <Button color='green' onClick={() => { this.LogoutHandler() }}>
                      <Icon name='checkmark' /> Evet
                    </Button>
                  </Modal.Actions>
                </Modal>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </nav >
    )
  }

  LogoutHandler = (e) => {
    const { logOut } = this.props
    this.setState({ open: false })
    logOut()
  }

}
export default Navbar