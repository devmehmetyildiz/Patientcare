import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Divider, Dropdown, Form, Header, Icon, Modal } from 'semantic-ui-react'
import Notification from '../../Utils/Notification'
import formToObject from 'form-to-object'
import LoadingPage from '../../Utils/LoadingPage'
import Literals from './Literals'
import Pagewrapper from '../../Common/Wrappers/Pagewrapper'
import Headerwrapper from '../../Common/Wrappers/Headerwrapper'
import Headerbredcrump from '../../Common/Wrappers/Headerbredcrump'
import Footerwrapper from '../../Common/Wrappers/Footerwrapper'
import validator from '../../Utils/Validator'
import Pagedivider from '../../Common/Styled/Pagedivider'
import Contentwrapper from '../../Common/Wrappers/Contentwrapper'
import FormInput from '../../Utils/FormInput'
import { FormContext } from '../../Provider/FormProvider'
import StationsCreate from '../../Containers/Stations/StationsCreate'
import DepartmentsCreate from '../../Containers/Departments/DepartmentsCreate'
import RolesCreate from '../../Containers/Roles/RolesCreate'
export default class UsersEdit extends Component {

  PAGE_NAME = "UsersEdit"

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false,
      modelOpened: false
    }
  }

  componentDidMount() {
    const { UserID, GetUser, GetStations, GetRoles, GetDepartments, match, history } = this.props
    let Id = UserID || match?.params?.UserID
    if (validator.isUUID(Id)) {
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
        isDatafetched: true
      })
      this.context.setForm(this.PAGE_NAME,
        {
          ...selected_record,
          Departments: selected_record.Departmentuuids.map(u => { return u.DepartmentID }),
          Roles: selected_record.Roleuuids.map(u => { return u.RoleID }),
          Stations: selected_record.Stationuuids.map(u => { return u.StationID }),
        })
    }
    Notification(Departments.notifications, removeDepartmentnotification)
    Notification(Users.notifications, removeUsernotification)
    Notification(Stations.notifications, removeStationnotification)
    Notification(Roles.notifications, removeRolenotification)
  }


  render() {

    const { Departments, Users, Stations, Roles, Profile } = this.props

    const Stationoptions = (Stations.list || []).filter(u => u.Isactive).map(station => {
      return { key: station.Uuid, text: station.Name, value: station.Uuid }
    })
    const Roleoptions = (Roles.list || []).filter(u => u.Isactive).map(roles => {
      return { key: roles.Uuid, text: roles.Name, value: roles.Uuid }
    })
    const Departmentoptions = (Departments.list || []).map(department => {
      return { key: department.Uuid, text: department.Name, value: department.Uuid }
    })
    const Languageoptions = [
      { key: 1, text: 'EN', value: 'en' },
      { key: 2, text: 'TR', value: 'tr' },
    ]

    const addModal = (content) => {
      return <Modal
        onClose={() => { this.setState({ modelOpened: false }) }}
        onOpen={() => { this.setState({ modelOpened: true }) }}
        trigger={<Icon link name='plus' />}
        content={content}
      />
    }

    return (
      Users.isLoading ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Users"}>
                <Breadcrumb.Section >{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{Literals.Page.Pageeditheader[Profile.Language]}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form onSubmit={this.handleSubmit}>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Name[Profile.Language]} name="Name" />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Surname[Profile.Language]} name="Surname" />
              </Form.Group>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Email[Profile.Language]} name="Email" />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Username[Profile.Language]} name="Username" />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.UserID[Profile.Language]} name="UserID" type='Number' />
              </Form.Group>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.City[Profile.Language]} name="City" />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Town[Profile.Language]} name="Town" />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Address[Profile.Language]} name="Address" />
              </Form.Group>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Stations[Profile.Language]} name="Stations" multiple options={Stationoptions} formtype='dropdown' modal={addModal(<StationsCreate />)} />
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Departments[Profile.Language]} name="Departments" multiple options={Departmentoptions} formtype='dropdown' modal={addModal(<DepartmentsCreate />)} />
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Roles[Profile.Language]} name="Roles" multiple options={Roleoptions} formtype='dropdown' modal={addModal(<RolesCreate />)} />
              </Form.Group>
              <FormInput placeholder={Literals.Columns.Language[Profile.Language]} value={this.state.selectedlanguage} options={Languageoptions} onChange={this.handleChangeLanguage} formtype='dropdown' />
              <Footerwrapper>
                <Link to="/Users">
                  <Button floated="left" color='grey'>{Literals.Button.Goback[Profile.Language]}</Button>
                </Link>
                <Button floated="right" type='submit' color='blue'>{Literals.Button.Update[Profile.Language]}</Button>
              </Footerwrapper>
            </Form>
          </Contentwrapper>
        </Pagewrapper >
    )
  }
  handleSubmit = (e) => {
    e.preventDefault()
    const { EditUsers, history, fillUsernotification, Roles, Departments, Stations, Users, Profile } = this.props
    const data = formToObject(e.target)
    data.UserID = parseInt(data.UserID, 10)
    data.Stations = this.context.formstates[`${this.PAGE_NAME}/Stations`].map(id => {
      return (Stations.list || []).find(u => u.Uuid === id)
    })
    data.Roles = this.context.formstates[`${this.PAGE_NAME}/Roles`].map(id => {
      return (Roles.list || []).find(u => u.Uuid === id)
    })
    data.Departments = this.context.formstates[`${this.PAGE_NAME}/Departments`].map(id => {
      return (Departments.list || []).find(u => u.Uuid === id)
    })
    data.Language = this.context.formstates[`${this.PAGE_NAME}/Language`]

    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.NameRequired[Profile.Language] })
    }
    if (!validator.isString(data.Surname)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.SurnameRequired[Profile.Language] })
    }
    if (!validator.isString(data.Username)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.UsernameRequired[Profile.Language] })
    }
    if (!validator.isString(data.Email)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.EmailRequired[Profile.Language] })
    }
    if (!validator.isArray(data.Stations)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.StationsRequired[Profile.Language] })
    }
    if (!validator.isArray(data.Departments)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.DepartmentsRequired[Profile.Language] })
    }
    if (!validator.isArray(data.Roles)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.RolesRequired[Profile.Language] })
    }
    if (!validator.isString(data.Language)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.LanguageRequired[Profile.Language] })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillUsernotification(error)
      })
    } else {
      EditUsers({ data: { ...Users.selected_record, ...data }, history })
    }
  }
}
UsersEdit.contextType = FormContext