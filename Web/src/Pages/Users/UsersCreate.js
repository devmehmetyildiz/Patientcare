import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb, Button } from 'semantic-ui-react'
import Literals from './Literals'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { FormInput, Contentwrapper, Footerwrapper, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
import StationsCreate from '../../Containers/Stations/StationsCreate'
import DepartmentsCreate from '../../Containers/Departments/DepartmentsCreate'
import RolesCreate from '../../Containers/Roles/RolesCreate'
import { getSidebarroutes } from '../../Utils/Constants'

export default class UsersCreate extends Component {

  PAGE_NAME = "UsersCreate"

  constructor(props) {
    super(props)
    this.state = {
      modelOpened: false
    }
  }

  componentDidMount() {
    const { GetRoles, GetDepartments } = this.props
    GetRoles()
    GetDepartments()
  }

  render() {
    const { Departments, Users, Roles, Profile, history, closeModal } = this.props

    const Roleoptions = (Roles.list || []).filter(u => u.Isactive).map(roles => {
      return { key: roles.Uuid, text: roles.Name, value: roles.Uuid }
    })
    const Departmentoptions = (Departments.list || []).filter(u => u.Isactive).map(department => {
      return { key: department.Uuid, text: department.Name, value: department.Uuid }
    })

    const Languageoptions = [
      { key: 1, text: 'EN', value: 'en' },
      { key: 2, text: 'TR', value: 'tr' },
    ]

    const Sidebaroption = (getSidebarroutes(Profile) || []).flatMap(section => {
      return section.items.filter(u => u.permission)
    }).map(item => {
      return { text: item.subtitle, value: item.url, key: item.subtitle }
    })

    return (
      Users.isLoading ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Users"}>
                <Breadcrumb.Section >{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{Literals.Page.Pagecreateheader[Profile.Language]}</Breadcrumb.Section>
            </Headerbredcrump>
            {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Name[Profile.Language]} name="Name" />
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Surname[Profile.Language]} name="Surname" />
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Password[Profile.Language]} name="Password" type='password' />
              </Form.Group>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Email[Profile.Language]} name="Email" />
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Username[Profile.Language]} name="Username" />
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.UserID[Profile.Language]} name="UserID" type='Number' />
              </Form.Group>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Departments[Profile.Language]} name="Departments" multiple options={Departmentoptions} formtype='dropdown' modal={DepartmentsCreate} />
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Roles[Profile.Language]} name="Roles" multiple options={Roleoptions} formtype='dropdown' modal={RolesCreate} />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Defaultpage[Profile.Language]} name="Defaultpage" options={Sidebaroption} formtype='dropdown' />
              </Form.Group>
              <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Language[Profile.Language]} name="Language" options={Languageoptions} formtype='dropdown' />
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Users"}
              buttonText={Literals.Button.Goback[Profile.Language]}
            />
            <Submitbutton
              isLoading={Users.isLoading}
              buttonText={Literals.Button.Create[Profile.Language]}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { AddUsers, history, fillUsernotification, Roles, Departments, Profile, closeModal } = this.props
    const data = this.context.getForm(this.PAGE_NAME)
    data.UserID = parseInt(data.UserID, 10)
    data.Roles = data.Roles.map(id => {
      return (Roles.list || []).find(u => u.Uuid === id)
    })
    data.Departments = data.Departments.map(id => {
      return (Departments.list || []).find(u => u.Uuid === id)
    })

    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.NameRequired[Profile.Language] })
    }
    if (!validator.isString(data.Surname)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.SurnameRequired[Profile.Language] })
    }
    if (!validator.isString(data.Password)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.PasswordRequired[Profile.Language] })
    }
    if (!validator.isString(data.Username)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.UsernameRequired[Profile.Language] })
    }
    if (!validator.isString(data.Email)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.EmailRequired[Profile.Language] })
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
      AddUsers({ data, history, closeModal })
    }
  }
}
UsersCreate.contextType = FormContext