import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Form } from 'semantic-ui-react'
import Literals from './Literals'
import validator from "../../Utils/Validator"
import { FormContext } from '../../Provider/FormProvider'
import DepartmentsCreate from '../../Containers/Departments/DepartmentsCreate'
import {
  Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump,
  Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton
} from '../../Components'
export default class CostumertypesEdit extends Component {

  PAGE_NAME = "CostumertypesEdit"

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false,
    }
  }

  componentDidMount() {
    const { GetCostumertype, match, history, GetDepartments, CostumertypeID } = this.props
    let Id = CostumertypeID || match?.params?.CostumertypeID
    if (validator.isUUID(Id)) {
      GetCostumertype(Id)
      GetDepartments()
    } else {
      history.push("/Costumertypes")
    }
  }

  componentDidUpdate() {
    const { Departments, Costumertypes, } = this.props
    const { selected_record, isLoading } = Costumertypes
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0 && Departments.list.length > 0 && !Departments.isLoading && !isLoading && !this.state.isDatafetched) {
      this.setState({
        isDatafetched: true,
      })
      this.context.setForm(this.PAGE_NAME, { ...selected_record, Departments: selected_record.Departmentuuids.map(u => { return u.DepartmentID }) })
    }
  }

  render() {

    const { Costumertypes, Departments, Profile, history } = this.props

    const Departmentoptions = (Departments.list || []).filter(u => u.Isactive).map(department => {
      return { key: department.Uuid, text: department.Name, value: department.Uuid }
    })


    return (
      Costumertypes.isLoading ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Costumertypes"}>
                <Breadcrumb.Section >{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{Literals.Page.Pageeditheader[Profile.Language]}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Name[Profile.Language]} name="Name" />
              <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Departmentstxt[Profile.Language]} name="Departments" multiple options={Departmentoptions} formtype="dropdown" modal={DepartmentsCreate} />
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Costumertypes"}
              buttonText={Literals.Button.Goback[Profile.Language]}
            />
            <Submitbutton
              isLoading={Costumertypes.isLoading}
              buttonText={Literals.Button.Update[Profile.Language]}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()

    const { EditCostumertypes, history, fillCostumertypenotification, Departments, Costumertypes, Profile } = this.props
    const data = this.context.getForm(this.PAGE_NAME)
    data.Departments = data.Departments.map(id => {
      return (Departments.list || []).filter(u => u.Isactive).find(u => u.Uuid === id)
    }).filter(u => u)

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
      EditCostumertypes({ data: { ...Costumertypes.selected_record, ...data }, history })
    }
  }
}
CostumertypesEdit.contextType = FormContext