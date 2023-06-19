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
export default class StockdefinesEdit extends Component {
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
    const { GetStockdefine, match, history, GetDepartments, GetUnits } = this.props
    if (match.params.StockdefineID) {
      GetStockdefine(match.params.StockdefineID)
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
        selecteddepartment: selected_record.Department.Uuid, selectedunit: selected_record.Unit.Uuid, isDatafetched: true
      })
    }
    this.context.setFormstates(selected_record)
    Notification(Stockdefines.notifications, removeStockdefinenotification)
    Notification(Departments.notifications, removeDepartmentnotification)
    Notification(Units.notifications, removeUnitnotification)
  }

  render() {

    const { Departments, Stockdefines, Units, Profile, history } = this.props

    const Departmentoption = Departments.list.map(station => {
      return { key: station.Uuid, text: station.Name, value: station.Uuid }
    })
    const Unitoption = Units.list.map(station => {
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
                <FormInput placeholder={Literals.Columns.Name[Profile.Language]} name="Name" />
                <FormInput placeholder={Literals.Columns.Description[Profile.Language]} name="Description" fluid />
              </Form.Group>
              <Form.Group widths={"equal"}>
                <FormInput placeholder={Literals.Columns.Department[Profile.Language]} value={this.state.selecteddepartment} clearable options={Departmentoption} onChange={this.handleChangeDepartement} formtype='dropdown' />
                <FormInput placeholder={Literals.Columns.Unit[Profile.Language]} value={this.state.selectedunit} clearable options={Unitoption} onChange={this.handleChangeUnit} formtype='dropdown' />
              </Form.Group>
              <Footerwrapper>
                {history && <Link to="/Stockdefines">
                  <Button floated="left" color='grey'>{Literals.Button.Goback[Profile.Language]}</Button>
                </Link>}
                <Button floated="right" type='submit' color='blue'>{Literals.Button.Update[Profile.Language]}</Button>
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
    data.UnitID = this.state.selectedunit
    data.DepartmentID = this.state.selecteddepartment

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
