import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Divider, Dropdown, Form,  Header } from 'semantic-ui-react'
import Popup from '../../Utils/Popup'
import formToObject from 'form-to-object'
import LoadingPage from '../../Utils/LoadingPage'

export default class UsersEdit extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedstations:[],
      selectedroles:[],
      selectedlanguage:{},
      selecteddepartments:[],
      isDatafetched:false,
    }
  }

  componentDidMount() {
    const { GetUser, GetStations, GetRoles, GetDepartments, match, history } = this.props
    if (match.params.UserID) {
      GetUser(match.params.UserID)
      GetStations()
      GetRoles()
      GetDepartments()
    } else {
      history.push("/Users")
    }
  }

  componentDidUpdate() {
    const { Departments, Roles, Stations, Users } = this.props
    const { selected_record, isLoading } = Users
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.id !== 0 &&
      Departments.list.length > 0 && !Departments.isLoading && Roles.list.length > 0 && !Roles.isLoading &&
      Stations.list.length > 0 && !Stations.isLoading && !isLoading && !this.state.isDatafetched) {
      this.setState({
        selecteddepartments: selected_record.departments.map(department => {
          return department.concurrencyStamp
        }),
        selectedroles: selected_record.roles.map(role => {
          return role.concurrencyStamp
        }),
        selectedstations: selected_record.stations.map(station => {
          return station.concurrencyStamp
        }),
        selectedlanguage: selected_record.language,
        isDatafetched: true
      })
    }
  }


  render() {

    const { Departments, Users, Stations, Roles, removeDepartmentnotification, removeStationnotification, removeRolenotification, removeUsernotification } = this.props
    const { selected_record } = Users
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
                <Breadcrumb.Section>Güncelle</Breadcrumb.Section>
              </Breadcrumb>
            </Header>
          </div>
          <Divider className='w-full  h-[1px]' />
          <div className='w-full bg-white p-4 rounded-lg shadow-md outline outline-[1px] outline-gray-200 '>
            <Form className='' onSubmit={this.handleSubmit}>
              <Form.Group widths={'equal'}>
                <Form.Input label="İsim" placeholder="İsim" name="name" fluid defaultValue={selected_record.name} />
                <Form.Input label="Soyisim" placeholder="Soyisim" name="surname" fluid defaultValue={selected_record.surname} />
                <Form.Input label="E Posta" placeholder="E posta" name="email" fluid defaultValue={selected_record.email} />
              </Form.Group>
              <Form.Group widths={'equal'}>
                <Form.Input label="Kullanıcı Adı" placeholder="Kullanıcı Adı" name="username" fluid defaultValue={selected_record.username} />
                <Form.Input label="Kullanıcı Numarası" placeholder="Kullanıcı Numarası" name="userID" type='number' fluid defaultValue={selected_record.userID} />
                <Form.Field>
                  <label className='text-[#000000de]'>Dil</label>
                  <Dropdown label="Dil" fluid selection options={Languageoptions} onChange={this.handleChangeLanguage} value={this.state.selectedlanguage} />
                </Form.Field>
              </Form.Group>
              <Form.Group widths={'equal'}>
                <Form.Input label="Kayıtlı Şehir" placeholder="Kayıtlı Şehir" name="city" fluid defaultValue={selected_record.city} />
                <Form.Input label="Kayıtlı İlçe" placeholder="Kayıtlı İlçe" name="town" fluid defaultValue={selected_record.town} />
                <Form.Input label="Adres" placeholder="Adres" name="address" fluid defaultValue={selected_record.address} />
              </Form.Group>
              <Form.Group widths={'equal'}>
                <Form.Field>
                  <label className='text-[#000000de]'>İstasyonlar</label>
                  <Dropdown label="İstasyonlar" clearable search fluid multiple selection options={Stationoptions} onChange={this.handleChangeStation} value={this.state.selectedstations} />
                </Form.Field>
                <Form.Field>
                  <label className='text-[#000000de]'>Departmanlar</label>
                  <Dropdown label="İstasyonlar" clearable search fluid multiple selection options={Departmentoptions} onChange={this.handleChangeDepartment} value={this.state.selecteddepartments} />
                </Form.Field>
                <Form.Field>
                  <label className='text-[#000000de]'>Roller</label>
                  <Dropdown label="İstasyonlar" clearable search fluid multiple selection options={Roleoptions} onChange={this.handleChangeRoles} value={this.state.selectedroles} />
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
    const { EditUsers, history, fillUsernotification, Roles, Departments, Stations, Users } = this.props
    const data = formToObject(e.target)
    data.stations = this.state.selectedstations.map(station => {
      return Stations.list.find(u => u.concurrencyStamp === station)
    })
    data.roles = this.state.selectedroles.map(roles => {
      return Roles.list.find(u => u.concurrencyStamp === roles)
    })
    data.departments = this.state.selecteddepartments.map(department => {
      return Departments.list.find(u => u.concurrencyStamp === department)
    })
    data.language = this.state.selectedlanguage

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
    if (!data.language || data.language === '') {
      errors.push({ type: 'Error', code: 'Kullanıcılar', description: 'Dil seçili değil' })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillUsernotification(error)
      })
    } else {
      EditUsers({ ...Users.selected_record, ...data }, history)
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
