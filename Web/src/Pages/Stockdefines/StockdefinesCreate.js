import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form } from 'semantic-ui-react'
import { Breadcrumb, Button} from 'semantic-ui-react'
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
export default class StockdefinesCreate extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selecteddepartment: {},
      selectedunit: {}
    }
  }

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

    const Departmentoptions = Departments.list.map(department => {
      return { key: department.Uuid, text: department.Name, value: department.Uuid }
    })
    const Unitoptions = Units.list.map(unit => {
      return { key: unit.Uuid, text: unit.Name, value: unit.Uuid }
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
                <FormInput placeholder={Literals.Columns.Department[Profile.Language]} value={this.state.selecteddepartment} clearable options={Departmentoptions} onChange={this.handleChangeDepartement} formtype='dropdown' />
                <FormInput placeholder={Literals.Columns.Unit[Profile.Language]} value={this.state.selectedunit} clearable options={Unitoptions} onChange={this.handleChangeUnit} formtype='dropdown' />
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
    data.UnitID = this.state.selectedunit
    data.DepartmentID = this.state.selecteddepartment

    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description:  Literals.Messages.NameRequired[Profile.Language] })
    }
    if (!validator.isUUID(data.DepartmentID)) {
      errors.push({ type: 'Error', code:  Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.DepartmentsRequired[Profile.Language] })
    }
    if (!validator.isUUID(data.UnitID)) {
      errors.push({ type: 'Error', code:  Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.UnitsRequired[Profile.Language] })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillStockdefinenotification(error)
      })
    } else {
      AddStockdefines({ data, history })
    }
  }

  handleChangeUnit = (e, { value }) => {
    this.setState({ selectedunit: value })
  }
  handleChangeDepartement = (e, { value }) => {
    this.setState({ selecteddepartment: value })
  }
}