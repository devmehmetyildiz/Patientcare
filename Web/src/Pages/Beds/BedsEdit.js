import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Divider, Dropdown, Form, Icon, Modal } from 'semantic-ui-react'
import { Breadcrumb, Button, Header } from 'semantic-ui-react'
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

export default class BedsEdit extends Component {

  PAGE_NAME = "BedsEdit"

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false,
      modelOpened: false
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
    const { Rooms, Beds, removeFloornotification, Floors,
      removeRoomnotification, removeBednotification } = this.props
    const { selected_record, isLoading } = Beds
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0
      && Rooms.list.length > 0 && !Rooms.isLoading
      && !isLoading && !this.state.isDatafetched) {
      this.setState({
        isDatafetched: true
      })
      this.context.setForm(this.PAGE_NAME, selected_record)
    }
    Notification(Beds.notifications, removeBednotification)
    Notification(Rooms.notifications, removeRoomnotification)
    Notification(Floors.notification, removeFloornotification)
  }

  render() {
    const { Beds, Rooms, Floors, Profile } = this.props

    const Roomsoptions = (Rooms.list || []).filter(u => u.Isactive).map(room => {
      return { key: room.Uuid, text: `${room.Name} (${(Floors.list || []).find(u => u.Uuid === room.FloorID)?.Name})`, value: room.Uuid }
    })

    const addModal = (content) => {
      return <Modal
        onClose={() => { this.setState({ modelOpened: false }) }}
        onOpen={() => { this.setState({ modelOpened: true }) }}
        trigger={<Icon link name='plus' />}
        content={content}
      />
    }

    return (
      Rooms.isLoading || Rooms.isDispatching || Beds.isLoading || Beds.isDispatching ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Beds"}>
                <Breadcrumb.Section >{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{Literals.Page.Pageeditheader[Profile.Language]}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form onSubmit={this.handleSubmit}>
              <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Name[Profile.Language]} name="Name" />
              <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.RoomID[Profile.Language]} name="RoomID" options={Roomsoptions} formtype='dropdown' modal={addModal(<RoomsCreate />)} />
              <Footerwrapper>
                <Link to="/Beds">
                  <Button floated="left" color='grey'>{Literals.Button.Goback[Profile.Language]}</Button>
                </Link>
                <Button floated="right" type='submit' color='blue'>{Literals.Button.Update[Profile.Language]}</Button>
              </Footerwrapper>
            </Form>
          </Contentwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()
    const { EditBeds, history, fillBednotification, Profile, Beds } = this.props
    const data = formToObject(e.target)
    data.RoomID = this.context.formstates[`${this.PAGE_NAME}/RoomID`]
    let errors = []
    if (!validator.isUUID(data.RoomID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.RoomIDrequired[Profile.Language] })
    }
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Namerequired[Profile.Language] })
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