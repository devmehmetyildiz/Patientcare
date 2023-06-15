import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Divider, Dropdown, Form, Header } from 'semantic-ui-react'
import Notification from '../../Utils/Notification'
import formToObject from 'form-to-object'
import LoadingPage from '../../Utils/LoadingPage'

export default class UsersEdit extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedstations: [],
      selectedroles: [],
      selectedlanguage: {},
      selecteddepartments: [],
      isDatafetched: false,
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
    const { Departments, Roles, Stations, Users,
      removeDepartmentnotification, removeStationnotification, removeRolenotification,
      removeUsernotification } = this.props
    const { selected_record, isLoading } = Users
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0 &&
      Departments.list.length > 0 && !Departments.isLoading && Roles.list.length > 0 && !Roles.isLoading &&
      Stations.list.length > 0 && !Stations.isLoading && !isLoading && !this.state.isDatafetched) {
      this.setState({
        selecteddepartments: selected_record.Departments.map(department => {
          return department.Uuid
        }),
        selectedroles: selected_record.Roles.map(role => {
          return role.Uuid
        }),
        selectedstations: selected_record.Stations.map(station => {
          return station.Uuid
        }),
        selectedlanguage: selected_record.Language,
        isDatafetched: true
      })
    }
    Notification(Departments.notifications, removeDepartmentnotification)
    Notification(Users.notifications, removeUsernotification)
    Notification(Stations.notifications, removeStationnotification)
    Notification(Roles.notifications, removeRolenotification)
  }


  render() {

    const { Departments, Users, Stations, Roles } = this.props
    const { selected_record } = Users

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
      { key: 'EN', text: 'EN', value: 'EN' },
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
            <Form className='' onSubmit={this.handleSubmit} preventDefault={false}>
              <Form.Group widths={'equal'}>
                <Form.Input label="İsim" placeholder="İsim" name="Name" fluid defaultValue={selected_record.Name} />
                <Form.Input label="Soyisim" placeholder="Soyisim" name="Surname" fluid defaultValue={selected_record.Surname} />
                <Form.Input label="E Posta" placeholder="E posta" name="Email" fluid defaultValue={selected_record.Email} />
              </Form.Group>
              <Form.Group widths={'equal'}>
                <Form.Input label="Kullanıcı Adı" placeholder="Kullanıcı Adı" name="Username" fluid defaultValue={selected_record.Username} />
                <Form.Input label="Kullanıcı Numarası" placeholder="Kullanıcı Numarası" name="UserID" type='number' fluid defaultValue={selected_record.UserID} />
                <Form.Field>
                  <label className='text-[#000000de]'>Dil</label>
                  <Dropdown label="Dil" fluid selection options={Languageoptions} onChange={this.handleChangeLanguage} value={this.state.selectedlanguage} />
                </Form.Field>
              </Form.Group>
              <Form.Group widths={'equal'}>
                <Form.Input label="Kayıtlı Şehir" placeholder="Kayıtlı Şehir" name="City" fluid defaultValue={selected_record.City} />
                <Form.Input label="Kayıtlı İlçe" placeholder="Kayıtlı İlçe" name="Town" fluid defaultValue={selected_record.Town} />
                <Form.Input label="Adres" placeholder="Adres" name="Address" fluid defaultValue={selected_record.Address} />
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
              <Form.Field>
                <label className='text-[#000000de]'>Dil</label>
                <Dropdown label="Dil" fluid selection options={Languageoptions} onChange={this.handleChangeLanguage} />
              </Form.Field>
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
    if (!data.Language || data.Language === '') {
      errors.push({ type: 'Error', code: 'Kullanıcılar', description: 'Dil seçili değil' })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillUsernotification(error)
      })
    } else {
      EditUsers({ data: { ...Users.selected_record, ...data }, history })
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
