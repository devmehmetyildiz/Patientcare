import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Form } from 'semantic-ui-react'
import Literals from './Literals'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
import Fileupload from '../../Components/Fileupload'

export default class BreakdownsEdit extends Component {

  PAGE_NAME = "BreakdownsEdit"

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false,
      selectedFiles: []
    }
  }

  componentDidMount() {
    const { BreakdownID, GetBreakdown, GetEquipments, GetEquipmentgroups, GetUsagetypes, GetFiles, GetUsers, match, history } = this.props
    let Id = BreakdownID || match?.params?.BreakdownID
    if (validator.isUUID(Id)) {
      GetBreakdown(Id)
      GetEquipments()
      GetEquipmentgroups()
      GetUsers()
      GetUsagetypes()
      GetFiles()
    } else {
      history.push("/Breakdowns")
    }
  }

  componentDidUpdate() {
    const { Breakdowns, Equipmentgroups, Users, Usagetypes, Equipments, Files } = this.props
    const { selected_record, isLoading } = Breakdowns
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0
      && !Equipmentgroups.isLoading && !Users.isLoading && !Equipments.isLoading && !Usagetypes.isLoading && !Files.isLoading
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
    const { Breakdowns, Equipments, Files, Usagetypes, Users, Equipmentgroups, Profile, history, fillBreakdownnotification } = this.props

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
      Breakdowns.isLoading ||
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
              <Link to={"/Breakdowns"}>
                <Breadcrumb.Section >{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{Literals.Page.Pageeditheader[Profile.Language]}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.EquipmentgroupID[Profile.Language]} name="EquipmentgroupID" options={Equipmentgroupoptions} formtype='dropdown' />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.EquipmentID[Profile.Language]} name="EquipmentID" options={Equipmentoptions} formtype='dropdown' />
              </Form.Group>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.ResponsibleuserID[Profile.Language]} name="ResponsibleuserID" options={Useroptions} formtype='dropdown' />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Openinfo[Profile.Language]} name="Openinfo" />
              </Form.Group>
            </Form>
            <Fileupload
              fillnotification={fillBreakdownnotification}
              Usagetypes={Usagetypes}
              selectedFiles={this.state.selectedFiles}
              setselectedFiles={this.setselectedFiles}
              Literals={Literals}
              Profile={Profile}
            />
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Breakdowns"}
              buttonText={Literals.Button.Goback[Profile.Language]}
            />
            <Submitbutton
              isLoading={Breakdowns.isLoading}
              buttonText={Literals.Button.Update[Profile.Language]}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()
    const { EditBreakdowns, history, fillBreakdownnotification, Profile, Breakdowns } = this.props
    const data = this.context.getForm(this.PAGE_NAME)
    let errors = []
    if (!validator.isUUID(data.EquipmentID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Equipmentrequired[Profile.Language] })
    }
    if (!validator.isUUID(data.ResponsibleuserID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Responsibleuserrequired[Profile.Language] })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillBreakdownnotification(error)
      })
    } else {
      EditBreakdowns({ data: { ...Breakdowns.selected_record, ...data }, history, files: this.state.selectedFiles })
    }
  }
}
BreakdownsEdit.contextType = FormContext