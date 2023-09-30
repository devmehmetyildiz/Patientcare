import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Form } from 'semantic-ui-react'
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
export default class StockdefinesEdit extends Component {

  PAGE_NAME = "StockdefinesEdit"

  constructor(props) {
    super(props)
    const selecteddepartment = {}
    const selectedunit = {}
    const isDatafetched = false
    this.state = {
      selecteddepartment,
      selectedunit,
      isDatafetched
    }
  }

  componentDidMount() {
    const { GetStockdefine, match, history, GetDepartments, GetUnits, StockdefineID } = this.props
    let Id = StockdefineID || match.params.StockdefineID
    if (validator.isUUID(Id)) {
      GetStockdefine(Id)
      GetDepartments()
      GetUnits()
    } else {
      history.push("/Stockdefines")
    }
  }

  componentDidUpdate() {
    const { Stockdefines, Units, removeUnitnotification, removeStockdefinenotification, Departments, removeDepartmentnotification } = this.props
    const { selected_record, isLoading } = Stockdefines
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0 && Units.list.length > 0 && !Units.isLoading && Departments.list.length > 0 && !Departments.isLoading && !isLoading && !this.state.isDatafetched) {
      this.setState({
        isDatafetched: true
      })
    }
    this.context.setForm(this.PAGE_NAME, selected_record)
    Notification(Stockdefines.notifications, removeStockdefinenotification)
    Notification(Departments.notifications, removeDepartmentnotification)
    Notification(Units.notifications, removeUnitnotification)
  }

  render() {

    const { Departments, Stockdefines, Units, Profile, history } = this.props

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

    const { EditStockdefines, history, fillStockdefinenotification, Stockdefines, Profile } = this.props
    const data = formToObject(e.target)
    data.UnitID = this.context.formstates[`${this.PAGE_NAME}/UnitID`]
    data.DepartmentID = this.context.formstates[`${this.PAGE_NAME}/DepartmentID`]

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
      EditStockdefines({ data: { ...Stockdefines.selected_record, ...data }, history })
    }
  }

  handleChangeUnit = (e, { value }) => {
    this.setState({ selectedunit: value })
  }
  handleChangeDepartement = (e, { value }) => {
    this.setState({ selecteddepartment: value })
  }
}
StockdefinesEdit.contextType = FormContext