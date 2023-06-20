import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Form } from 'semantic-ui-react'
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
import Notification from '../../Utils/Notification'


export default class UnitsEdit extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selecteddepartments: [],
      isDatafetched: false,
      selectedstatusOption: {}
    }
  }

  componentDidMount() {
    const { GetUnit, match, history, GetDepartments } = this.props
    if (match.params.UnitID) {
      GetUnit(match.params.UnitID)
      GetDepartments()
    } else {
      history.push("/Units")
    }
  }

  componentDidUpdate() {
    const { Departments, Units, removeDepartmentnotification, removeUnitnotification } = this.props
    const { selected_record, isLoading } = Units
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0 && Departments.list.length > 0 && !Departments.isLoading && !isLoading && !this.state.isDatafetched) {
      this.setState({
        selecteddepartments: selected_record.Departments.map(department => {
          return department.Uuid
        }), isDatafetched: true, selectedstatusOption: selected_record.Unittype
      })
      this.context.setFormstates(selected_record)
    }
    Notification(Departments.notifications, removeDepartmentnotification)
    Notification(Units.notifications, removeUnitnotification)
  }

  render() {

    const { Units, Departments, Profile } = this.props

    const Departmentoptions = Departments.list.map(department => {
      return { key: department.Uuid, text: department.Name, value: department.Uuid }
    })

    const unitstatusOption = [
      {
        key: '0',
        text: 'Number',
        value: 0,
      },
      {
        key: '1',
        text: 'String',
        value: 1,
      }
    ]

    return (
      Departments.isLoading || Departments.isDispatching || Units.isLoading || Units.isDispatching ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Units"}>
                <Breadcrumb.Section >{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{Literals.Page.Pageeditheader[Profile.Language]}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form onSubmit={this.handleSubmit}>
              <Form.Group widths='equal'>
                <FormInput required placeholder={Literals.Columns.Name[Profile.Language]} name="Name" />
                <FormInput required placeholder={Literals.Columns.Unittype[Profile.Language]} value={this.state.selectedstatusOption} options={unitstatusOption} onChange={this.handleChangeOption} formtype='dropdown' />
              </Form.Group>
              <Form.Group widths='equal'>
                <FormInput required placeholder={Literals.Columns.Department[Profile.Language]} value={this.state.selecteddepartments} clearable search multiple options={Departmentoptions} onChange={this.handleChange} formtype='dropdown' />
              </Form.Group>
              <Footerwrapper>
                <Link to="/Units">
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

    const { EditUnits, history, fillUnitnotification, Departments, Units, Profile } = this.props
    const { list } = Departments
    const data = formToObject(e.target)
    data.Unittype = this.state.selectedstatusOption
    data.Departments = this.state.selecteddepartments.map(department => {
      return list.find(u => u.Uuid === department)
    })

    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.NameRequired[Profile.Language] })
    }
    if (!validator.isNumber(data.Unittype)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.UnittypeRequired[Profile.Language] })
    }
    if (!validator.isArray(data.Departments)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.DepartmentRequired[Profile.Language] })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillUnitnotification(error)
      })
    } else {
      EditUnits({ data: { ...Units.selected_record, ...data }, history })
    }
  }

  handleChange = (e, { value }) => {
    this.setState({ selecteddepartments: value })
  }

  handleChangeOption = (e, { value }) => {
    this.setState({ selectedstatusOption: value })
  }
}
UnitsEdit.contextType = FormContext
