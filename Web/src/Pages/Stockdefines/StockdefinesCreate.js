import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form } from 'semantic-ui-react'
import { Breadcrumb, Button } from 'semantic-ui-react'
import formToObject from 'form-to-object'
import LoadingPage from '../../Utils/LoadingPage'
import Notification from '../../Utils/Notification'
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
export default class StockdefinesCreate extends Component {

  PAGE_NAME = "StockdefinesCreate"

  componentDidMount() {
    const { GetDepartments, GetUnits } = this.props
    GetDepartments()
    GetUnits()
  }

  componentDidUpdate() {
    const { Stockdefines, Units, removeUnitnotification, removeStockdefinenotification, Departments, removeDepartmentnotification } = this.props
    Notification(Stockdefines.notifications, removeStockdefinenotification)
    Notification(Departments.notifications, removeDepartmentnotification)
    Notification(Units.notifications, removeUnitnotification)
  }

  render() {
    const { Departments, Units, Stockdefines, history, Profile } = this.props

    const Departmentoption = (Departments.list || []).filter(u => u.Isactive).map(station => {
      return { key: station.Uuid, text: station.Name, value: station.Uuid }
    })
    const Unitoption = (Units.list || []).filter(u => u.Isactive).map(station => {
      return { key: station.Uuid, text: station.Name, value: station.Uuid }
    })

    return (
      Units.isLoading || Units.isDispatching || Departments.isLoading || Departments.isDispatching || Stockdefines.isLoading || Stockdefines.isDispatching ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Stockdefines"}>
                <Breadcrumb.Section >{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{Literals.Page.Pagecreateheader[Profile.Language]}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form onSubmit={this.handleSubmit}>
              <Form.Group widths={"equal"}>
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Name[Profile.Language]} name="Name" />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Description[Profile.Language]} name="Description" />
              </Form.Group>
              <Form.Group widths={"equal"}>
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Department[Profile.Language]} options={Departmentoption} name="DepartmentID" formtype='dropdown' />
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Unit[Profile.Language]} options={Unitoption} name="UnitID" formtype='dropdown' />
              </Form.Group>
              <Form.Group widths={"equal"}>
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Ismedicine[Profile.Language]} name="Ismedicine" formtype='checkbox' />
              </Form.Group>
              <Footerwrapper>
                {history && <Link to="/Stockdefines">
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

    const { AddStockdefines, history, fillStockdefinenotification, Profile } = this.props
    const data = formToObject(e.target)
    data.UnitID = this.context.formstates[`${this.PAGE_NAME}/UnitID`]
    data.DepartmentID = this.context.formstates[`${this.PAGE_NAME}/DepartmentID`]
    data.Ismedicine = this.context.formstates[`${this.PAGE_NAME}/Ismedicine`]
    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.NameRequired[Profile.Language] })
    }
    if (!validator.isUUID(data.DepartmentID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.DepartmentsRequired[Profile.Language] })
    }
    if (!validator.isUUID(data.UnitID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.UnitsRequired[Profile.Language] })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillStockdefinenotification(error)
      })
    } else {
      AddStockdefines({ data, history })
    }
  }
}
StockdefinesCreate.contextType = FormContext