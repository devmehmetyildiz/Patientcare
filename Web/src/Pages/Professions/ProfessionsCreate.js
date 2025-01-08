import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb, Button } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { FormInput, Contentwrapper, Footerwrapper, Gobackbutton, Headerbredcrump, Headerwrapper, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'

export default function ProfessionsCreate(props) {
  const PAGE_NAME = "ProfessionsCreate"

  const { AddProfessions, fillProfessionnotification, Profile, closeModal, GetFloors, Professions, Floors, history, } = props

  const context = useContext(FormContext)

  const t = Profile?.i18n?.t

  const handleSubmit = (e) => {
    e.preventDefault()

    const data = context.getForm(PAGE_NAME)
    data.Floors = (data.Floors || []).filter(u => validator.isUUID(u)).join(',')
    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: t('Pages.Professions.Page.Header'), description: t('Pages.Professions.Messages.NameRequired') })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillProfessionnotification(error)
      })
    } else {
      AddProfessions({ data, history, closeModal })
    }
  }

  const Floorsoptions = (Floors.list || []).filter(u => u.Isactive).map(Floor => {
    return { key: Floor.Uuid, text: Floor.Name, value: Floor.Uuid }
  })

  useEffect(() => {
    GetFloors()
  }, [])

  return (
    <Pagewrapper dimmer isLoading={Professions.isLoading || Floors.isLoading}>
      <Headerwrapper>
        <Headerbredcrump>
          <Link to={"/Professions"}>
            <Breadcrumb.Section >{t('Pages.Professions.Page.Header')}</Breadcrumb.Section>
          </Link>
          <Breadcrumb.Divider icon='right chevron' />
          <Breadcrumb.Section>{t('Pages.Professions.Page.CreateHeader')}</Breadcrumb.Section>
        </Headerbredcrump>
        {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
      </Headerwrapper>
      <Pagedivider />
      <Contentwrapper>
        <Form>
          <FormInput page={PAGE_NAME} required placeholder={t('Pages.Professions.Column.Name')} name="Name" />
          <FormInput page={PAGE_NAME} placeholder={t('Pages.Professions.Column.Floors')} name="Floors" formtype='dropdown' multiple options={Floorsoptions} />
        </Form>
      </Contentwrapper>
      <Footerwrapper>
        <Gobackbutton
          history={history}
          redirectUrl={"/Professions"}
          buttonText={t('Common.Button.Goback')}
        />
        <Submitbutton
          isLoading={Professions.isLoading}
          buttonText={t('Common.Button.Create')}
          submitFunction={handleSubmit}
        />
      </Footerwrapper>
    </Pagewrapper >
  )
}