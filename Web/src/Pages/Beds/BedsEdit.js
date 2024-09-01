import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { } from 'semantic-ui-react'
import { Breadcrumb, Form } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import RoomsCreate from '../../Containers/Rooms/RoomsCreate'
import { Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'

export default class BedsEdit extends Component {

  PAGE_NAME = "BedsEdit"

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false,
    }
  }

  componentDidMount() {
    const { BedID, GetBed, GetRooms, GetFloors, match, history } = this.props
    let Id = BedID || match?.params?.BedID
    if (validator.isUUID(Id)) {
      GetBed(Id)
      GetRooms()
      GetFloors()
    } else {
      history.push("/Beds")
    }
  }

  componentDidUpdate() {
    const { Rooms, Beds, Floors } = this.props
    const { selected_record, isLoading } = Beds
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0
      && !Rooms.isLoading && !Floors.isLoading
      && !isLoading && !this.state.isDatafetched) {
      this.setState({
        isDatafetched: true
      })
      this.context.setForm(this.PAGE_NAME, selected_record)
    }
  }

  render() {
    const { Beds, Rooms, Floors, Profile, history } = this.props
    const t = Profile?.i18n?.t

    const Roomsoptions = (Rooms.list || []).filter(u => u.Isactive).map(room => {
      return { key: room.Uuid, text: `${room.Name} (${(Floors.list || []).find(u => u.Uuid === room.FloorID)?.Name})`, value: room.Uuid }
    })

    return (
      Rooms.isLoading || Beds.isLoading ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Beds"}>
                <Breadcrumb.Section >{t('Pages.Beds.Page.Header')}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{t('Pages.Beds.Page.EditHeader')}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} placeholder={t('Pages.Beds.Label.Name')} name="Name" />
                <FormInput page={this.PAGE_NAME} placeholder={t('Pages.Beds.Label.Room')} name="RoomID" options={Roomsoptions} formtype='dropdown' modal={RoomsCreate} />
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
              buttonText={t('Common.Button.Update')}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()
    const { EditBeds, history, fillBednotification, Profile, Beds } = this.props
    const t = Profile?.i18n?.t
    const data = this.context.getForm(this.PAGE_NAME)
    let errors = []
    if (!validator.isUUID(data.RoomID)) {
      errors.push({ type: 'Error', code: t('Pages.Beds.Page.Header'), description: t('Pages.Beds.Messages.RoomRequired') })
    }
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: t('Pages.Beds.Page.Header'), description: t('Pages.Beds.Messages.RoomRequired') })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillBednotification(error)
      })
    } else {
      EditBeds({ data: { ...Beds.selected_record, ...data }, history })
    }
  }
}
BedsEdit.contextType = FormContext