import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb, Button } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { FormInput, Contentwrapper, Footerwrapper, Gobackbutton, Headerbredcrump, Headerwrapper, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
import FloorsCreate from '../../Containers/Floors/FloorsCreate'

export default function RoomsCreate(props) {

  const PAGE_NAME = "RoomsCreate"
  const { Rooms, Floors, Profile, } = props
  const { GetFloors, AddRooms, history, fillRoomnotification, closeModal } = props

  const context = useContext(FormContext)

  const t = Profile?.i18n?.t

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
      AddRooms({ data, history, closeModal })
    }
  }

  const Floorsoptions = (Floors.list || []).filter(u => u.Isactive).map(Floor => {
    return { key: Floor.Uuid, text: Floor.Name, value: Floor.Uuid }
  })

  useEffect(() => {
    GetFloors()
  }, [])

  return (
    <Pagewrapper dimmer isLoading={Rooms.isLoading}>
      <Headerwrapper>
        <Headerbredcrump>
          <Link to={"/Rooms"}>
            <Breadcrumb.Section >{t('Pages.Rooms.Page.Header')}</Breadcrumb.Section>
          </Link>
          <Breadcrumb.Divider icon='right chevron' />
          <Breadcrumb.Section>{t('Pages.Rooms.Page.CreateHeader')}</Breadcrumb.Section>
        </Headerbredcrump>
        {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
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
          buttonText={t('Common.Button.Create')}
          submitFunction={handleSubmit}
        />
      </Footerwrapper>
    </Pagewrapper >
  )
}