import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Form } from 'semantic-ui-react'
import validator from "../../Utils/Validator"
import { FormContext } from '../../Provider/FormProvider'
import DepartmentsCreate from '../../Containers/Departments/DepartmentsCreate'
import {
  Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump,
  Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton
} from '../../Components'
export default class CostumertypesCreate extends Component {

  PAGE_NAME = "CostumertypesCreate"

  componentDidMount() {
    const { GetDepartments } = this.props
    GetDepartments()
  }

  render() {
    const { Costumertypes, Departments, Profile, history, closeModal } = this.props

    const t = Profile?.i18n?.t

    const Departmentoptions = (Departments.list || []).filter(u => u.Isactive).map(department => {
      return { key: department.Uuid, text: department.Name, value: department.Uuid }
    })

    return (
      Costumertypes.isLoading ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Costumertypes"}>
                <Breadcrumb.Section >{t('Pages.Costumertypes.Page.Header')}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{t('Pages.Costumertypes.Page.CreateHeader')}</Breadcrumb.Section>
            </Headerbredcrump>
            {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Costumertypes.Column.Name')} name="Name" />
              <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Costumertypes.Column.Department')} name="Departments" multiple options={Departmentoptions} formtype="dropdown" modal={DepartmentsCreate} />
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Costumertypes"}
              buttonText={t('Common.Button.Goback')}
            />
            <Submitbutton
              isLoading={Costumertypes.isLoading}
              buttonText={t('Common.Button.Create')}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()
    const { AddCostumertypes, history, fillCostumertypenotification, Departments, Profile, closeModal } = this.props

    const t = Profile?.i18n?.t

    const data = this.context.getForm(this.PAGE_NAME)
    data.Departments = data.Departments.map(id => {
      return (Departments.list || []).find(u => u.Uuid === id)
    })

    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: t('Pages.Costumertypes.Page.Header'), description: t('Pages.Costumertypes.Messages.NameRequired') })
    }
    if (!validator.isArray(data.Departments)) {
      errors.push({ type: 'Error', code: t('Pages.Costumertypes.Page.Header'), description: t('Pages.Costumertypes.Messages.DepartmentRequired') })
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