import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, } from 'semantic-ui-react'
import { Breadcrumb, Button } from 'semantic-ui-react'
import formToObject from 'form-to-object'
import Notification from '../../Utils/Notification'
import LoadingPage from '../../Utils/LoadingPage'
import Pagewrapper from '../../Common/Wrappers/Pagewrapper'
import Headerwrapper from '../../Common/Wrappers/Headerwrapper'
import Headerbredcrump from '../../Common/Wrappers/Headerbredcrump'
import Literals from './Literals'
import Pagedivider from '../../Common/Styled/Pagedivider'
import Contentwrapper from '../../Common/Wrappers/Contentwrapper'
import Footerwrapper from '../../Common/Wrappers/Footerwrapper'
import FormInput from '../../Utils/FormInput'
import validator from "../../Utils/Validator"
import { FormContext } from '../../Provider/FormProvider'
export default class CostumertypesCreate extends Component {

  PAGE_NAME = "CostumertypesCreate"

  componentDidMount() {
    const { GetDepartments } = this.props
    GetDepartments()
  }

  componentDidUpdate() {
    const { Costumertypes, removeCostumertypenotification, Departments, removeDepartmentnotification } = this.props
    Notification(Costumertypes.notifications, removeCostumertypenotification)
    Notification(Departments.notifications, removeDepartmentnotification)
  }

  render() {
    const { Costumertypes, Departments, Profile, history } = this.props

    const Departmentoptions = (Departments.list || []).filter(u => u.Isactive).map(department => {
      return { key: department.Uuid, text: department.Name, value: department.Uuid }
    })

    return (
      Costumertypes.isLoading || Costumertypes.isDispatching || Departments.isLoading || Departments.isDispatching ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Costumertypes"}>
                <Breadcrumb.Section >{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{Literals.Page.Pagecreateheader[Profile.Language]}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form onSubmit={this.handleSubmit}>
              <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Name[Profile.Language]} name="Name" />
              <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Departmentstxt[Profile.Language]} name="Departments" multiple options={Departmentoptions} formtype="dropdown" />
              <Footerwrapper>
                {history && <Link to="/Costumertypes">
                  <Button floated="left" color='grey'>{Literals.Button.Goback[Profile.Language]}</Button>
                </Link>}
                <Button floated="right" type='submit' color='blue'>{Literals.Button.Create[Profile.Language]}</Button>
              </Footerwrapper>
            </Form>
          </Contentwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()
    const { AddCostumertypes, history, fillCostumertypenotification, Departments, Profile } = this.props
    const data = formToObject(e.target)
    data.Departments = this.context.formstates[`${this.PAGE_NAME}/Departments`].map(id => {
      return (Departments.list || []).find(u => u.Uuid === id)
    })

    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Namerequired[Profile.Language] })
    }
    if (!validator.isArray(data.Departments)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Departmentsrequired[Profile.Language] })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillCostumertypenotification(error)
      })
    } else {
      AddCostumertypes({ data, history })
    }
  }
}
CostumertypesCreate.contextType = FormContext