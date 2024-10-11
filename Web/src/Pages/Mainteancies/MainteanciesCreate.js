import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb, Button } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
import Fileupload from '../../Components/Fileupload'
export default class MainteanciesCreate extends Component {

  PAGE_NAME = "MainteanciesCreate"

  constructor(props) {
    super(props)
    this.state = {
      selectedFiles: []
    }
  }

  componentDidMount() {
    const { GetEquipments, GetEquipmentgroups, GetUsers, GetUsagetypes } = this.props
    GetEquipments()
    GetEquipmentgroups()
    GetUsers()
    GetUsagetypes()
  }

  setselectedFiles = (files) => {
    this.setState({ selectedFiles: [...files] })
  }

  render() {
    const { Mainteancies, Equipments, Users, Usagetypes, Equipmentgroups, Profile, history, closeModal, fillMainteancenotification } = this.props

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
              <Breadcrumb.Section>{t('Pages.Mainteancies.Page.CreateHeader')}</Breadcrumb.Section>
            </Headerbredcrump>
            {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
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
              buttonText={t('Common.Button.Create')}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()
    const { AddMainteancies, history, fillMainteancenotification, Profile, closeModal } = this.props

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
      AddMainteancies({ data, history, closeModal, files: this.state.selectedFiles })
    }
  }
}
MainteanciesCreate.contextType = FormContext