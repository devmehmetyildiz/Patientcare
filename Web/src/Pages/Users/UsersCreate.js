import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Divider, Dropdown, Form, Header } from 'semantic-ui-react'
import Notification from '../../Utils/Notification'
import formToObject from 'form-to-object'
import LoadingPage from '../../Utils/LoadingPage'

export default class UsersCreate extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedstations: [],
      selectedroles: [],
      selectedlanguage: {},
      selecteddepartments: [],
    }
  }

  componentDidMount() {
    const { GetStations, GetRoles, GetDepartments } = this.props
    GetStations()
    GetRoles()
    GetDepartments()
  }

  componentDidUpdate() {
    const { Departments, Users, Stations, Roles, removeDepartmentnotification,
      removeStationnotification, removeRolenotification, removeUsernotification } = this.props
    Notification(Departments.notifications, removeDepartmentnotification)
    Notification(Users.notifications, removeUsernotification)
    Notification(Stations.notifications, removeStationnotification)
    Notification(Roles.notifications, removeRolenotification)
  }

  render() {

    const { Departments, Users, Stations, Roles } = this.props

    const Stationoptions = Stations.list.map(station => {
      return { key: station.Uuid, text: station.Name, value: station.Uuid }
    })
    const Roleoptions = Roles.list.map(roles => {
      return { key: roles.Uuid, text: roles.Name, value: roles.Uuid }
    })
    const Departmentoptions = Departments.list.map(department => {
      return { key: department.Uuid, text: department.Name, value: department.Uuid }
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
            <Form className='' onSubmit={this.handleSubmit} preventDefault={false}>
              <Form.Group widths={'equal'}>
                <Form.Input label="İsim" placeholder="İsim" name="Name" fluid />
                <Form.Input label="Soyisim" placeholder="Soyisim" name="Surname" fluid />
                <Form.Input label="Parola" placeholder="Parola" name="Password" fluid type='password' />
              </Form.Group>
              <Form.Group widths={'equal'}>
                <Form.Input label="E Posta" placeholder="E posta" name="Email" fluid />
                <Form.Input label="Kullanıcı Adı" placeholder="Kullanıcı Adı" name="Username" fluid />
                <Form.Input label="Kullanıcı Numarası" placeholder="Kullanıcı Numarası" name="UserID" type='Number' fluid />

              </Form.Group>
              <Form.Group widths={'equal'}>
                <Form.Input label="Kayıtlı Şehir" placeholder="Kayıtlı Şehir" name="City" fluid />
                <Form.Input label="Kayıtlı İlçe" placeholder="Kayıtlı İlçe" name="Town" fluid />
                <Form.Input label="Adres" placeholder="Adres" name="Address" fluid />
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
              <Form.Field>
                <label className='text-[#000000de]'>Dil</label>
                <Dropdown label="Dil" fluid selection options={Languageoptions} onChange={this.handleChangeLanguage} />
              </Form.Field>
              <div className='flex flex-row w-full justify-between py-4  items-center'>
                <Link to="/Users">
                  <Button floated="left" color='grey'>Geri Dön</Button>
                </Link>
                <Button floated="right" type='submit' color='blue'>Oluştur</Button>
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
    data.UserID = parseInt(data.UserID, 10)
    data.Stations = this.state.selectedstations.map(station => {
      return Stations.list.find(u => u.Uuid === station)
    })
    data.Roles = this.state.selectedroles.map(roles => {
      return Roles.list.find(u => u.Uuid === roles)
    })
    data.Departments = this.state.selecteddepartments.map(department => {
      return Departments.list.find(u => u.Uuid === department)
    })
    data.Language = this.state.selectedlanguage

    let errors = []
    if (!data.Name || data.Name === '') {
      errors.push({ type: 'Error', code: 'Kullanıcılar', description: 'İsim boş olamaz' })
    }
    if (!data.Surname || data.Surname === '') {
      errors.push({ type: 'Error', code: 'Kullanıcılar', description: 'Soy isim boş olamaz' })
    }
    if (!data.Username || data.Username === '') {
      errors.push({ type: 'Error', code: 'Kullanıcılar', description: 'Kullanıcı adı boş olamaz' })
    }
    if (!data.Email || data.Email === '') {
      errors.push({ type: 'Error', code: 'Kullanıcılar', description: 'E-posta boş olamaz' })
    }
    if (!data.Stations || data.Stations.length <= 0) {
      errors.push({ type: 'Error', code: 'Kullanıcılar', description: 'Hiç Bir İstasyon seçili değil' })
    }
    if (!data.Departments || data.Departments.length <= 0) {
      errors.push({ type: 'Error', code: 'Kullanıcılar', description: 'Hiç Bir Departman seçili değil' })
    }
    if (!data.Roles || data.Roles.length <= 0) {
      errors.push({ type: 'Error', code: 'Kullanıcılar', description: 'Hiç Bir Rol seçili değil' })
    }
    if (!data.Language || data.Language === '' || Object.keys(data.Language).length <= 0) {
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
  handleChangeLanguage = (e, { value }) => {
    this.setState({ selectedlanguage: value })
  }
}
