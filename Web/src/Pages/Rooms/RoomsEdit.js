import React, { Component, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { FormInput, Contentwrapper, Footerwrapper, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
import FloorsCreate from '../../Containers/Floors/FloorsCreate'
export default function RoomsEdit(props) {
  const PAGE_NAME = "RoomsEdit"
  const { RoomID, GetRoom, GetFloors, match, history } = props
  const { Profile, Floors, Rooms } = props
  const { EditRooms, fillRoomnotification, } = props

  const Id = RoomID || match?.params?.RoomID

  const handleSubmit = (e) => {
    e.preventDefault()

    const data = context.getForm(PAGE_NAME)
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

  const { selected_record, isLoading } = Rooms

  const t = Profile?.i18n?.t

  const Floorsoptions = (Floors.list || []).filter(u => u.Isactive).map(Floor => {
    return { key: Floor.Uuid, text: Floor.Name, value: Floor.Uuid }
  })

  const context = useContext(FormContext)

  useEffect(() => {
    if (selected_record && validator.isObject(selected_record)) {
      context.setForm(PAGE_NAME, selected_record)
    }
  }, [selected_record])

  useEffect(() => {
    if (validator.isUUID(Id)) {
      GetRoom(Id)
      GetFloors()
    } else {
      history.push("/Rooms")
    }
  }, [])



  return (
    <Pagewrapper dimmer isLoading={isLoading}>
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
          <FormInput page={PAGE_NAME} required placeholder={t('Pages.Rooms.Column.Name')} name="Name" />
          <FormInput page={PAGE_NAME} required placeholder={t('Pages.Rooms.Column.Floor')} name="FloorID" options={Floorsoptions} formtype='dropdown' modal={FloorsCreate} />
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
          submitFunction={handleSubmit}
        />
      </Footerwrapper>
    </Pagewrapper >
  )
}