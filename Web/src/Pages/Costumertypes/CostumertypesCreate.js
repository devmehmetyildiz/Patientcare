import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Form } from 'semantic-ui-react'
import Literals from './Literals'
import validator from "../../Utils/Validator"
import { FormContext } from '../../Provider/FormProvider'
import DepartmentsCreate from '../../Containers/Departments/DepartmentsCreate'
import { Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump, 
  Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
export default class CostumertypesCreate extends Component {

  PAGE_NAME = "CostumertypesCreate"

  constructor(props) {
    super(props)
    this.state = {
      modelOpened: false
    }
  }

  componentDidMount() {
    const { GetDepartments } = this.props
    GetDepartments()
  }

  render() {
    const { Costumertypes, Departments, Profile, history, closeModal } = this.props

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
              <Breadcrumb.Section>{Literals.Page.Pagecreateheader[Profile.Language]}</Breadcrumb.Section>
            </Headerbredcrump>
            {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
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
              buttonText={Literals.Button.Create[Profile.Language]}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()
    const { AddCostumertypes, history, fillCostumertypenotification, Departments, Profile, closeModal } = this.props
    const data = this.context.getForm(this.PAGE_NAME)
    data.Departments = data.Departments.map(id => {
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
      AddCostumertypes({ data, history, closeModal })
    }
  }
}
CostumertypesCreate.contextType = FormContext