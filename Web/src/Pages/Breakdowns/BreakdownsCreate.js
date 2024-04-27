import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Form } from 'semantic-ui-react'
import Literals from './Literals'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import {
  Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump,
  Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton
} from '../../Components'
import Fileupload from '../../Components/Fileupload'
export default class BreakdownsCreate extends Component {

  PAGE_NAME = "BreakdownsCreate"

  constructor(props) {
    super(props)
    this.state = {
      selectedFiles: []
    }
  }

  componentDidMount() {
    const { GetEquipments, GetUsagetypes, GetEquipmentgroups, GetUsers } = this.props
    GetEquipments()
    GetEquipmentgroups()
    GetUsers()
    GetUsagetypes()
  }

  setselectedFiles = (files) => {
    this.setState({ selectedFiles: [...files] })
  }

  render() {
    const { Breakdowns, Usagetypes, Equipments, Users, Equipmentgroups, Profile, history, closeModal, fillBreakdownnotification } = this.props

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
              <Breadcrumb.Section>{Literals.Page.Pagecreateheader[Profile.Language]}</Breadcrumb.Section>
            </Headerbredcrump>
            {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.EquipmentgroupID[Profile.Language]} name="EquipmentgroupID" options={Equipmentgroupoptions} formtype='dropdown' />
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.EquipmentID[Profile.Language]} name="EquipmentID" options={Equipmentoptions} formtype='dropdown' />
              </Form.Group>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.ResponsibleuserID[Profile.Language]} name="ResponsibleuserID" options={Useroptions} formtype='dropdown' />
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
              buttonText={Literals.Button.Create[Profile.Language]}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()
    const { AddBreakdowns, history, fillBreakdownnotification, Profile, closeModal } = this.props
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
      AddBreakdowns({ data, history, closeModal, files: this.state.selectedFiles })
    }
  }
}
BreakdownsCreate.contextType = FormContext