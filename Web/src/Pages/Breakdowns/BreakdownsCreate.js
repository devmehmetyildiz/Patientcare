import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Icon, Modal } from 'semantic-ui-react'
import { Breadcrumb, Button } from 'semantic-ui-react'
import formToObject from 'form-to-object'
import Notification from '../../Utils/Notification'
import LoadingPage from '../../Utils/LoadingPage'
import Literals from './Literals'
import Footerwrapper from '../../Common/Wrappers/Footerwrapper'
import Pagedivider from '../../Common/Styled/Pagedivider'
import Contentwrapper from '../../Common/Wrappers/Contentwrapper'
import Pagewrapper from '../../Common/Wrappers/Pagewrapper'
import Headerwrapper from '../../Common/Wrappers/Headerwrapper'
import Headerbredcrump from '../../Common/Wrappers/Headerbredcrump'
import FormInput from '../../Utils/FormInput'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import RoomsCreate from '../../Containers/Rooms/RoomsCreate'
import Gobackbutton from '../../Common/Gobackbutton'
import Submitbutton from '../../Common/Submitbutton'
export default class BreakdownsCreate extends Component {

  PAGE_NAME = "BreakdownsCreate"

  constructor(props) {
    super(props)
    this.state = {
      modelOpened: false
    }
  }

  componentDidMount() {
    const { GetEquipments, GetEquipmentgroups, GetPersonels } = this.props
    GetEquipments()
    GetEquipmentgroups()
    GetPersonels()
  }


  render() {
    const { Breakdowns, Equipments, Personels, Equipmentgroups, Profile, history, closeModal } = this.props

    const Personeloptions = (Personels.list || []).filter(u => u.Isactive).map(personel => {
      return { key: personel.Uuid, text: `${personel?.Name} ${personel?.Surname}`, value: personel.Uuid }
    })

    const Equipmentgroupoptions = (Equipmentgroups.list || []).filter(u => u.Isactive).map(group => {
      return { key: group.Uuid, text: group?.Name, value: group.Uuid }
    })

    const Equipmentoptions = (Equipments.list || []).filter(u => u.Isactive && u.EquipmentgroupID === this.context.formstates[`${this.PAGE_NAME}/EquipmentgroupID`]).map(equipment => {
      return { key: equipment.Uuid, text: equipment?.Name, value: equipment.Uuid }
    })

    return (
      Breakdowns.isLoading ? <LoadingPage /> :
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
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.ResponsibleuserID[Profile.Language]} name="ResponsibleuserID" options={Personeloptions} formtype='dropdown' />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Openinfo[Profile.Language]} name="Openinfo" />
              </Form.Group>
            </Form>
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
      AddBreakdowns({ data, history, closeModal })
    }
  }
}
BreakdownsCreate.contextType = FormContext