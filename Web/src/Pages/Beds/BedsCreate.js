import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Form } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import RoomsCreate from '../../Containers/Rooms/RoomsCreate'
import {
  Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump,
  Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton
} from '../../Components'
export default class BedsCreate extends Component {

  PAGE_NAME = "BedsCreate"

  componentDidMount() {
    const { GetRooms, GetFloors } = this.props
    GetRooms()
    GetFloors()
  }

  render() {
    const { Beds, Rooms, Floors, Profile, history, closeModal } = this.props

    const t = Profile?.i18n?.t
   
    const Roomsoptions = (Rooms.list || []).filter(u => u.Isactive).map(room => {
      return { key: room.Uuid, text: `${room.Name} (${(Floors.list || []).find(u => u.Uuid === room.FloorID)?.Name})`, value: room.Uuid }
    })

    return (
      Beds.isLoading ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Beds"}>
                <Breadcrumb.Section >{t('Pages.Beds.Page.Header')}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{t('Pages.Beds.Page.CreateHeader')}</Breadcrumb.Section>
            </Headerbredcrump>
            {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Beds.Label.Name')} name="Name" />
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Beds.Label.Room')} name="RoomID" options={Roomsoptions} formtype='dropdown' modal={RoomsCreate} />
              </Form.Group>
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Beds"}
              buttonText={t('Common.Button.Goback')}
            />
            <Submitbutton
              isLoading={Beds.isLoading}
              buttonText={t('Common.Button.Create')}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()
    const { AddBeds, history, fillBednotification, Profile, closeModal } = this.props
    const t = Profile?.i18n?.t
    const data = this.context.getForm(this.PAGE_NAME)
    let errors = []
    if (!validator.isUUID(data.RoomID)) {
      errors.push({ type: 'Error', code: t('Pages.Beds.Page.Header'), description: t('Pages.Beds.Messages.RoomRequired') })
    }
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: t('Pages.Beds.Page.Header'), description: t('Pages.Beds.Messages.NameRequired') })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillBednotification(error)
      })
    } else {
      AddBeds({ data, history, closeModal })
    }
  }
}
BedsCreate.contextType = FormContext