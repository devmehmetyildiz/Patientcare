import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Form } from 'semantic-ui-react'
import validator from "../../Utils/Validator"
import { FormContext } from '../../Provider/FormProvider'
import {
  Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump,
  Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton
} from '../../Components'

export default class EquipmentgroupsCreate extends Component {

  PAGE_NAME = "EquipmentgroupsCreate"


  componentDidMount() {
    const { GetDepartments } = this.props
    GetDepartments()
  }

  render() {
    const { Departments, Equipmentgroups, Profile, history, closeModal } = this.props

    const t = Profile?.i18n?.t

    const Departmentoptions = (Departments.list || []).filter(u => u.Isactive).map(department => {
      return { key: department.Uuid, text: department.Name, value: department.Uuid }
    })

    return (
      Equipmentgroups.isLoading ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Equipmentgroups"}>
                <Breadcrumb.Section >{t('Pages.Equipmentgroups.Page.Header')}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{t('Pages.Equipmentgroups.Page.CreateHeader')}</Breadcrumb.Section>
            </Headerbredcrump>
            {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Equipmentgroups.Column.Name')} name="Name" />
              <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Equipmentgroups.Column.Department')} name="DepartmentID" options={Departmentoptions} formtype="dropdown" />
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Equipmentgroups"}
              buttonText={t('Common.Button.Goback')}
            />
            <Submitbutton
              isLoading={Equipmentgroups.isLoading}
              buttonText={t('Common.Button.Create')}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()

    const { AddEquipmentgroups, history, fillEquipmentgroupnotification, Profile, closeModal } = this.props

    const t = Profile?.i18n?.t

    const data = this.context.getForm(this.PAGE_NAME)

    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: t('Pages.Equipmentgroups.Page.Header'), description: t('Pages.Equipmentgroups.Messages.NameRequired') })
    }
    if (!validator.isUUID(data.DepartmentID)) {
      errors.push({ type: 'Error', code: t('Pages.Equipmentgroups.Page.Header'), description: t('Pages.Equipmentgroups.Messages.DepartmentRequired') })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillEquipmentgroupnotification(error)
      })
    } else {
      AddEquipmentgroups({ data, history, closeModal })
    }
  }
}
EquipmentgroupsCreate.contextType = FormContext