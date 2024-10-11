import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
import Fileupload from '../../Components/Fileupload'

export default class MainteanciesEdit extends Component {

  PAGE_NAME = "MainteanciesEdit"

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false,
      selectedFiles: []
    }
  }

  componentDidMount() {
    const { MainteanceID, GetMaineance, GetEquipments, GetEquipmentgroups, GetFiles, GetUsagetypes, GetUsers, match, history } = this.props
    let Id = MainteanceID || match?.params?.MainteanceID
    if (validator.isUUID(Id)) {
      GetMaineance(Id)
      GetEquipments()
      GetEquipmentgroups()
      GetUsers()
      GetFiles()
      GetUsagetypes()
    } else {
      history.push("/Mainteancies")
    }
  }

  componentDidUpdate() {
    const { Mainteancies, Equipmentgroups, Users, Equipments, Usagetypes, Files } = this.props
    const { selected_record, isLoading } = Mainteancies
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0
      && !Equipmentgroups.isLoading && !Users.isLoading && !Equipments.isLoading && !Files.isLoading && !Usagetypes.isLoading
      && !isLoading && !this.state.isDatafetched) {
      const equipment = (Equipments.list || []).find(u => u.Uuid === selected_record?.EquipmentID)
      const equipmentgroup = (Equipmentgroups.list || []).find(u => u.Uuid === equipment?.EquipmentgroupID)
      var response = (Files.list || []).filter(u => u.ParentID === selected_record?.Uuid).map(element => {
        return {
          ...element,
          key: Math.random(),
          Usagetype: (element.Usagetype.split(',') || []).map(u => {
            return u
          })
        }
      });
      this.setState({
        isDatafetched: true,
        selectedFiles: [...response] || []
      })
      this.context.setForm(this.PAGE_NAME, { ...selected_record, EquipmentgroupID: equipmentgroup?.Uuid })
    }
  }

  setselectedFiles = (files) => {
    this.setState({ selectedFiles: [...files] })
  }

  render() {
    const { Mainteancies, Files, Equipments, Users, Equipmentgroups, Profile, history, Usagetypes, fillMainteancenotification } = this.props

    const t = Profile?.i18n?.t

    const Useroptions = (Users.list || []).filter(u => u.Isactive).map(personel => {
      return { key: personel.Uuid, text: `${personel?.Name} ${personel?.Surname}`, value: personel.Uuid }
    })

    const Equipmentgroupoptions = (Equipmentgroups.list || []).filter(u => u.Isactive).map(group => {
      return { key: group.Uuid, text: group?.Name, value: group.Uuid }
    })

    const Equipmentoptions = (Equipments.list || []).filter(u => u.Isactive && u.EquipmentgroupID === this.context.formstates[`${this.PAGE_NAME}/EquipmentgroupID`]).map(equipment => {
      return { key: equipment.Uuid, text: equipment?.Name, value: equipment.Uuid }
    })

    const isLoadingstatus =
      Mainteancies.isLoading ||
      Equipments.isLoading ||
      Usagetypes.isLoading ||
      Files.isLoading ||
      Users.isLoading ||
      Equipmentgroups.isLoading

    return (
      isLoadingstatus ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Mainteancies"}>
                <Breadcrumb.Section >{t('Pages.Mainteancies.Page.Header')}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{t('Pages.Mainteancies.Page.EditHeader')}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} placeholder={t('Pages.Mainteancies.Column.Equipmentgroup')} name="EquipmentgroupID" options={Equipmentgroupoptions} formtype='dropdown' />
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Mainteancies.Column.Equipment')} name="EquipmentID" options={Equipmentoptions} formtype='dropdown' />
              </Form.Group>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Mainteancies.Column.Responsibleuser')} name="ResponsibleuserID" options={Useroptions} formtype='dropdown' />
                <FormInput page={this.PAGE_NAME} placeholder={t('Pages.Mainteancies.Column.Openinfo')} name="Openinfo" />
              </Form.Group>
            </Form>
            <Fileupload
              fillnotification={fillMainteancenotification}
              Usagetypes={Usagetypes}
              selectedFiles={this.state.selectedFiles}
              setselectedFiles={this.setselectedFiles}
              Profile={Profile}
            />
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Mainteancies"}
              buttonText={t('Common.Button.Goback')}
            />
            <Submitbutton
              isLoading={Mainteancies.isLoading}
              buttonText={t('Common.Button.Update')}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()
    const { EditMainteancies, history, fillMainteancenotification, Profile, Mainteancies } = this.props

    const t = Profile?.i18n?.t

    const data = this.context.getForm(this.PAGE_NAME)
    let errors = []
    if (!validator.isUUID(data.EquipmentID)) {
      errors.push({ type: 'Error', code: t('Pages.Mainteancies.Page.Header'), description: t('Pages.Mainteancies.Messages.EquipmentRequired') })
    }
    if (!validator.isUUID(data.ResponsibleuserID)) {
      errors.push({ type: 'Error', code: t('Pages.Mainteancies.Page.Header'), description: t('Pages.Mainteancies.Messages.ResponsibleuserRequired') })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillMainteancenotification(error)
      })
    } else {
      EditMainteancies({ data: { ...Mainteancies.selected_record, ...data }, history, files: this.state.selectedFiles })
    }
  }
}
MainteanciesEdit.contextType = FormContext