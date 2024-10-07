import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { FormInput, Contentwrapper, Footerwrapper, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
import FloorsCreate from '../../Containers/Floors/FloorsCreate'

export default class RoomsEdit extends Component {

  PAGE_NAME = "RoomsEdit"

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false,
      modelOpened: false
    }
  }

  componentDidMount() {
    const { RoomID, GetRoom, GetFloors, match, history } = this.props
    let Id = RoomID || match?.params?.RoomID
    if (validator.isUUID(Id)) {
      GetRoom(Id)
      GetFloors()
    } else {
      history.push("/Rooms")
    }
  }

  componentDidUpdate() {
    const { Floors, Rooms } = this.props
    const { selected_record, isLoading } = Rooms
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0
      && Floors.list.length > 0 && !Floors.isLoading
      && !isLoading && !this.state.isDatafetched) {
      this.setState({
        isDatafetched: true
      })
      this.context.setForm(this.PAGE_NAME, selected_record)
    }
  }

  render() {
    const { Rooms, Floors, Profile, history } = this.props

    const t = Profile?.i18n?.t

    const Floorsoptions = (Floors.list || []).filter(u => u.Isactive).map(Floor => {
      return { key: Floor.Uuid, text: Floor.Name, value: Floor.Uuid }
    })

    return (
      Rooms.isLoading ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Rooms"}>
                <Breadcrumb.Section >{t('Pages.Rooms.Page.Header')}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{t('Pages.Rooms.Page.EditHeader')}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Rooms.Label.Name')} name="Name" />
              <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Rooms.Label.Floor')} name="FloorID" options={Floorsoptions} formtype='dropdown' modal={FloorsCreate} />
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Rooms"}
              buttonText={t('Common.Button.Goback')}
            />
            <Submitbutton
              isLoading={Rooms.isLoading}
              buttonText={t('Common.Button.Update')}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()
    const { EditRooms, history, fillRoomnotification, Profile, Rooms } = this.props

    const t = Profile?.i18n?.t

    const data = this.context.getForm(this.PAGE_NAME)
    let errors = []
    if (!validator.isUUID(data.FloorID)) {
      errors.push({ type: 'Error', code: t('Pages.Rooms.Page.Header'), description: t('Pages.Rooms.Messages.FloorRequired') })
    }
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: t('Pages.Rooms.Page.Header'), description: t('Pages.Rooms.Messages.NameRequired') })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillRoomnotification(error)
      })
    } else {
      EditRooms({ data: { ...Rooms.selected_record, ...data }, history })
    }
  }
}
RoomsEdit.contextType = FormContext