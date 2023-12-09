import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { } from 'semantic-ui-react'
import { Breadcrumb, Form } from 'semantic-ui-react'
import Literals from './Literals'
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

    const Roomsoptions = (Rooms.list || []).filter(u => u.Isactive).map(room => {
      return { key: room.Uuid, text: `${room.Name} (${(Floors.list || []).find(u => u.Uuid === room.FloorID)?.Name})`, value: room.Uuid }
    })

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
            <Form>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Name[Profile.Language]} name="Name" />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.RoomID[Profile.Language]} name="RoomID" options={Roomsoptions} formtype='dropdown' modal={RoomsCreate} />
              </Form.Group>
              <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Isoccupied[Profile.Language]} name="Isoccupied" formtype={'checkbox'} />
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Beds"}
              buttonText={Literals.Button.Goback[Profile.Language]}
            />
            <Submitbutton
              isLoading={Beds.isLoading}
              buttonText={Literals.Button.Update[Profile.Language]}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()
    const { EditBeds, history, fillBednotification, Profile, Beds } = this.props
    const data = this.context.getForm(this.PAGE_NAME)
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