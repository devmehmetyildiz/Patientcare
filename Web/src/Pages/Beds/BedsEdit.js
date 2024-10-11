import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { } from 'semantic-ui-react'
import { Breadcrumb, Form } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import RoomsCreate from '../../Containers/Rooms/RoomsCreate'
import { Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'

export default function BedsEdit(props) {

  const { EditBeds, fillBednotification, Beds, Rooms, Floors, Profile, history, BedID, GetBed, GetRooms, GetFloors, match, } = props

  const [fetch, setFetch] = useState(false)
  const [fetched, setFetched] = useState(false)

  const PAGE_NAME = "BedsEdit"
  const context = useContext(FormContext)
  const Id = BedID || match?.params?.BedID
  const t = Profile?.i18n?.t

  const { selected_record, isLoading } = Beds

  const pass = validator.isUUID(selected_record?.Uuid)
    && !Rooms.isLoading && !Floors.isLoading
    && !isLoading && !fetched && fetch;

  const loading = isLoading || Rooms.isLoading || Floors.isLoading

  const Roomsoptions = (Rooms.list || []).filter(u => u.Isactive).map(room => {
    return { key: room.Uuid, text: `${room.Name} (${(Floors.list || []).find(u => u.Uuid === room.FloorID)?.Name})`, value: room.Uuid }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const t = Profile?.i18n?.t
    const data = context.getForm(PAGE_NAME)
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

  useEffect(() => {
    if (!fetch) {
      if (validator.isUUID(Id)) {
        GetBed(Id)
        GetRooms()
        GetFloors()
      } else {
        history.push("/Beds")
      }
      setFetch(true)
    }

    if (pass) {
      setFetched(true)
      context.setForm(PAGE_NAME, selected_record)
    }
  }, [Rooms.isLoading, Beds.isLoading, Floors.isLoading])

  return (
    loading ? <LoadingPage /> :
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
              <FormInput page={PAGE_NAME} placeholder={t('Pages.Beds.Label.Name')} name="Name" />
              <FormInput page={PAGE_NAME} placeholder={t('Pages.Beds.Label.Room')} name="RoomID" options={Roomsoptions} formtype='dropdown' modal={RoomsCreate} />
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
            submitFunction={handleSubmit}
          />
        </Footerwrapper>
      </Pagewrapper >
  )
}
