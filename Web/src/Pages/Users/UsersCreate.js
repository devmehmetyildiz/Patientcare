import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Divider, Dropdown, Form,  Header } from 'semantic-ui-react'
import Popup from '../../Utils/Popup'
import formToObject from 'form-to-object'
import LoadingPage from '../../Utils/LoadingPage'

export default class UsersCreate extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedstations:[],
      selectedroles:[],
      selectedlanguage:{},
      selecteddepartments:[],
    }
  }

  componentDidMount() {
    const { GetStations, GetRoles, GetDepartments } = this.props
    GetStations()
    GetRoles()
    GetDepartments()
  }

  render() {

    const { Departments, Users, Stations, Roles, removeDepartmentnotification, removeStationnotification, removeRolenotification, removeUsernotification } = this.props
    if (Departments.notifications && Departments.notifications.length > 0) {
      let msg = Departments.notifications[0]
      Popup(msg.type, msg.code, msg.description)
      removeDepartmentnotification()
    }
    if (Stations.notifications && Stations.notifications.length > 0) {
      let msg = Stations.notifications[0]
      Popup(msg.type, msg.code, msg.description)
      removeStationnotification()
    }
    if (Users.notifications && Users.notifications.length > 0) {
      let msg = Users.notifications[0]
      Popup(msg.type, msg.code, msg.description)
      removeUsernotification()
    }
    if (Roles.notifications && Roles.notifications.length > 0) {
      let msg = Roles.notifications[0]
      Popup(msg.type, msg.code, msg.description)
      removeRolenotification()
    }

    const Stationoptions = Stations.list.map(station => {
      return { key: station.concurrencyStamp, text: station.name, value: station.concurrencyStamp }
    })
    const Roleoptions = Roles.list.map(roles => {
      return { key: roles.concurrencyStamp, text: roles.name, value: roles.concurrencyStamp }
    })
    const Departmentoptions = Departments.list.map(department => {
      return { key: department.concurrencyStamp, text: department.name, value: department.concurrencyStamp }
    })

    const Languageoptions = [
      { key: 'TR', text: 'TR', value: 'TR' },
    ]

    return (
      Departments.isLoading || Departments.isDispatching ||
        Roles.isLoading || Roles.isDispatching ||
        Users.isLoading || Users.isDispatching ||
        Stations.isLoading || Stations.isDispatching ? <LoadingPage /> :
        <div className='w-full h-[calc(100vh-59px-2rem)] mx-auto flex flex-col  justify-start items-center pb-[2rem] px-[2rem]'>
          <div className='w-full mx-auto align-middle'>
            <Header style={{ backgroundColor: 'transparent', border: 'none', color: '#3d3d3d' }} as='h1' attached='top' >
              <Breadcrumb size='big'>
                <Link to={"/Users"}>
                  <Breadcrumb.Section >Kullanıcılar</Breadcrumb.Section>
                </Link>
                <Breadcrumb.Divider icon='right chevron' />
                <Breadcrumb.Section>Oluştur</Breadcrumb.Section>
              </Breadcrumb>
            </Header>
          </div>
          <Divider className='w-full  h-[1px]' />
          <div className='w-full bg-white p-4 rounded-lg shadow-md outline outline-[1px] outline-gray-200 '>
            <Form className='' onSubmit={this.handleSubmit}>
              <Form.Group widths={'equal'}>
                <Form.Input label="İsim" placeholder="İsim" name="name" fluid />
                <Form.Input label="Soyisim" placeholder="Soyisim" name="surname" fluid />
                <Form.Input label="E Posta" placeholder="E posta" name="email" fluid />
              </Form.Group>
              <Form.Group widths={'equal'}>
                <Form.Input label="Kullanıcı Adı" placeholder="Kullanıcı Adı" name="username" fluid />
                <Form.Input label="Kullanıcı Numarası" placeholder="Kullanıcı Numarası" name="userID" type='number' fluid />
                <Form.Field>
                  <label className='text-[#000000de]'>Dil</label>
                  <Dropdown label="Dil" fluid selection options={Languageoptions} onChange={this.handleChangeLanguage} />
                </Form.Field>
              </Form.Group>
              <Form.Group widths={'equal'}>
                <Form.Input label="Kayıtlı Şehir" placeholder="Kayıtlı Şehir" name="city" fluid />
                <Form.Input label="Kayıtlı İlçe" placeholder="Kayıtlı İlçe" name="town" fluid />
                <Form.Input label="Adres" placeholder="Adres" name="address" fluid />
              </Form.Group>
              <Form.Group widths={'equal'}>
                <Form.Field>
                  <label className='text-[#000000de]'>İstasyonlar</label>
                  <Dropdown clearable search fluid multiple selection options={Stationoptions} onChange={this.handleChangeStation} />
                </Form.Field>
                <Form.Field>
                  <label className='text-[#000000de]'>Departmanlar</label>
                  <Dropdown clearable search fluid multiple selection options={Departmentoptions} onChange={this.handleChangeDepartment} />
                </Form.Field>
                <Form.Field>
                  <label className='text-[#000000de]'>Roller</label>
                  <Dropdown clearable search fluid multiple selection options={Roleoptions} onChange={this.handleChangeRoles} />
                </Form.Field>
              </Form.Group>
              <div className='flex flex-row w-full justify-between py-4  items-center'>
                <Link to="/Users">
                  <Button floated="left" color='grey'>Geri Dön</Button>
                </Link>
                <Button floated="right" type='submit' color='blue'>Güncelle</Button>
              </div>
            </Form>
          </div>
        </div>
    )
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { AddUsers, history, fillUsernotification, Roles, Departments, Stations } = this.props
    const data = formToObject(e.target)
    data.stations = this.state.selectedstations.map(station => {
      return Stations.list.find(u => u.concurrencyStamp === station)
    })
    data.roles = this.state.selectedroles.map(roles => {
      return Roles.list.find(u => u.concurrencyStamp === roles)
    })
    data.stations = this.state.selecteddepartments.map(department => {
      return Departments.list.find(u => u.concurrencyStamp === department)
    })
    data.language = this.state.selectedlanguage
    console.log('data.language: ', data.language);
    data.normalizedUsername = data.username.toUpperCase()
    data.emailConfirmed = false
    data.accessFailedCount = 0
    data.phoneNumberConfirmed = false
    data.id = 0
    data.concurrencyStamp = null
    data.createdUser = null
    data.updatedUser = null
    data.deleteUser = null
    data.createTime = null
    data.updateTime = null
    data.deleteTime = null
    data.isActive = true

    let errors = []
    if (!data.name || data.name === '') {
      errors.push({ type: 'Error', code: 'Kullanıcılar', description: 'İsim boş olamaz' })
    }
    if (!data.surname || data.surname === '') {
      errors.push({ type: 'Error', code: 'Kullanıcılar', description: 'Soy isim boş olamaz' })
    }
    if (!data.username || data.username === '') {
      errors.push({ type: 'Error', code: 'Kullanıcılar', description: 'Kullanıcı adı boş olamaz' })
    }
    if (!data.email || data.email === '') {
      errors.push({ type: 'Error', code: 'Kullanıcılar', description: 'E-posta boş olamaz' })
    }
    if (!data.stations || data.stations.length <= 0) {
      errors.push({ type: 'Error', code: 'Kullanıcılar', description: 'Hiç Bir İstasyon seçili değil' })
    }
    if (!data.departments || data.departments.length <= 0) {
      errors.push({ type: 'Error', code: 'Kullanıcılar', description: 'Hiç Bir Departman seçili değil' })
    }
    if (!data.roles || data.roles.length <= 0) {
      errors.push({ type: 'Error', code: 'Kullanıcılar', description: 'Hiç Bir Rol seçili değil' })
    }
    if (!data.language || data.language === '' || Object.keys(data.language).length <= 0) {
      errors.push({ type: 'Error', code: 'Kullanıcılar', description: 'Dil seçili değil' })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillUsernotification(error)
      })
    } else {
      AddUsers(data, history)
    }
  }

  handleChangeStation = (e, { value }) => {
    this.setState({ selectedstations: value })
  }
  handleChangeDepartment = (e, { value }) => {
    this.setState({ selecteddepartments: value })
  }
  handleChangeRoles = (e, { value }) => {
    this.setState({ selectedroles: value })
  }

}
