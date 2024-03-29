import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb } from 'semantic-ui-react'
import Literals from './Literals'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { FormInput,Contentwrapper, Footerwrapper, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
import DepartmentsCreate from '../../Containers/Departments/DepartmentsCreate'

export default class UnitsEdit extends Component {

  PAGE_NAME = "UnitsEdit"

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false,
      modelOpened: false
    }
  }

  componentDidMount() {
    const { GetUnit, match, history, GetDepartments, UnitID } = this.props
    let Id = UnitID || match?.params?.UnitID
    if (validator.isUUID(Id)) {
      GetUnit(Id)
      GetDepartments()
    } else {
      history.push("/Units")
    }
  }

  componentDidUpdate() {
    const { Departments, Units } = this.props
    const { selected_record, isLoading } = Units
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0 && Departments.list.length > 0 && !Departments.isLoading && !isLoading && !this.state.isDatafetched) {
      this.setState({
        isDatafetched: true
      })
      this.context.setForm(this.PAGE_NAME, { ...selected_record, Departments: selected_record.Departmentuuids.map(u => { return u.DepartmentID }) })
    }
  }

  render() {

    const { Units, Departments, Profile, history } = this.props

    const Departmentoptions = (Departments.list || []).map(department => {
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
      Units.isLoading ? <LoadingPage /> :
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
            <Form>
              <Form.Group widths='equal'>
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Name[Profile.Language]} name="Name" />
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Unittype[Profile.Language]} name="Unittype" options={unitstatusOption} formtype='dropdown' />
              </Form.Group>
              <Form.Group widths='equal'>
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Department[Profile.Language]} name="Departments" multiple options={Departmentoptions} formtype='dropdown' modal={DepartmentsCreate} />
              </Form.Group>
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Units"}
              buttonText={Literals.Button.Goback[Profile.Language]}
            />
            <Submitbutton
              isLoading={Units.isLoading}
              buttonText={Literals.Button.Update[Profile.Language]}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()

    const { EditUnits, history, fillUnitnotification, Departments, Units, Profile } = this.props
    const data = this.context.getForm(this.PAGE_NAME)
    data.Departments = data.Departments.map(id => {
      return (Departments.list || []).filter(u => u.Isactive).find(u => u.Uuid === id)
    }).filter(u => u)

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
}
UnitsEdit.contextType = FormContext
