import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Form } from 'semantic-ui-react'
import validator from "../../Utils/Validator"
import { FormContext } from '../../Provider/FormProvider'
import {
  Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump,
  Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton
} from '../../Components'

export default class EquipmentgroupsEdit extends Component {

  PAGE_NAME = "EquipmentgroupsEdit"

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false,
    }
  }

  componentDidMount() {
    const { GetEquipmentgroup, match, history, GetDepartments, EquipmentgroupID } = this.props
    let Id = EquipmentgroupID || match?.params?.EquipmentgroupID
    if (validator.isUUID(Id)) {
      GetEquipmentgroup(Id)
      GetDepartments()
    } else {
      history.push("/Equipmentgroups")
    }
  }

  componentDidUpdate() {
    const { Equipmentgroups, Departments } = this.props
    const { selected_record, isLoading } = Equipmentgroups
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0 && !Departments.isLoading && !isLoading && !this.state.isDatafetched) {
      this.setState({
        isDatafetched: true
      })
      this.context.setForm(this.PAGE_NAME, selected_record)
    }
  }

  render() {

    const { Equipmentgroups, Departments, Profile, history } = this.props

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
              <Breadcrumb.Section>{t('Pages.Equipmentgroups.Page.EditHeader')}</Breadcrumb.Section>
            </Headerbredcrump>
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
              buttonText={t('Common.Button.Update')}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()

    const { EditEquipmentgroups, history, fillEquipmentgroupnotification, Equipmentgroups, Profile } = this.props

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
      EditEquipmentgroups({ data: { ...Equipmentgroups.selected_record, ...data }, history })
    }
  }
}
EquipmentgroupsEdit.contextType = FormContext