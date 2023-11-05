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
import FloorsCreate from '../../Containers/Floors/FloorsCreate'
export default class RoomsCreate extends Component {

  PAGE_NAME = "RoomsCreate"

  constructor(props) {
    super(props)
    this.state = {
      modelOpened: false
    }
  }

  componentDidMount() {
    const { GetFloors } = this.props
    GetFloors()
  }

  render() {
    const { Rooms, Floors, Profile } = this.props

    const Floorsoptions = (Floors.list || []).filter(u => u.Isactive).map(Floor => {
      return { key: Floor.Uuid, text: Floor.Name, value: Floor.Uuid }
    })

    return (
      Rooms.isLoading ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Rooms"}>
                <Breadcrumb.Section >{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{Literals.Page.Pagecreateheader[Profile.Language]}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form onSubmit={this.handleSubmit}>
              <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Name[Profile.Language]} name="Name" />
              <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.FloorID[Profile.Language]} name="FloorID" options={Floorsoptions} formtype='dropdown' modal={FloorsCreate} />
              <Footerwrapper>
                <Link to="/Rooms">
                  <Button floated="left" color='grey'>{Literals.Button.Goback[Profile.Language]}</Button>
                </Link>
                <Button floated="right" type='submit' color='blue'>{Literals.Button.Create[Profile.Language]}</Button>
              </Footerwrapper>
            </Form>
          </Contentwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()
    const { AddRooms, history, fillRoomnotification, Profile, closeModal } = this.props
    const data = formToObject(e.target)
    data.FloorID = this.context.formstates[`${this.PAGE_NAME}/FloorID`]

    let errors = []
    if (!validator.isUUID(data.FloorID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.FloorIDrequired[Profile.Language] })
    }
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Namerequired[Profile.Language] })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillRoomnotification(error)
      })
    } else {
      AddRooms({ data, history, closeModal })
    }
  }
}
RoomsCreate.contextType = FormContext