import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { FormInput, Contentwrapper, Footerwrapper, Gobackbutton, Headerbredcrump, Headerwrapper, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'

export default function ProfessionsEdit(props) {
  const PAGE_NAME = "ProfessionsEdit"
  const { EditProfessions, history, fillRatingnotification, Professions, Profile, GetProfession, match, ProfessionID, GetFloors, Floors } = props

  const context = useContext(FormContext)

  const Id = ProfessionID || match.params.ProfessionID
  const t = Profile?.i18n?.t

  const handleSubmit = (e) => {
    e.preventDefault()


    const t = Profile?.i18n?.t

    const data = context.getForm(PAGE_NAME)
    data.Floors = (data.Floors || []).filter(u => validator.isUUID(u)).join(',')
    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: t('Pages.Professions.Page.Header'), description: t('Pages.Professions.Messages.NameRequired') })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillRatingnotification(error)
      })
    } else {
      EditProfessions({ data: { ...Professions.selected_record, ...data }, history })
    }
  }

  const Floorsoptions = (Floors.list || []).filter(u => u.Isactive).map(Floor => {
    return { key: Floor.Uuid, text: Floor.Name, value: Floor.Uuid }
  })


  useEffect(() => {
    if (validator.isUUID(Id)) {
      GetProfession(Id)
      GetFloors()
    } else {
      history.push("/Professions")
    }
  }, [])

  useEffect(() => {
    if (Professions.selected_record && validator.isObject(Professions.selected_record)) {
      context.setForm(PAGE_NAME, { ...Professions.selected_record, Floors: (Professions.selected_record?.Floors || '').split(',').filter(u => validator.isUUID(u)) })
    }
  }, [Professions.selected_record])

  return (
    <Pagewrapper dimmer isLoading={Professions.isLoading || Floors.isLoading}>
      <Headerwrapper>
        <Headerbredcrump>
          <Link to={"/Professions"}>
            <Breadcrumb.Section >{t('Pages.Professions.Page.Header')}</Breadcrumb.Section>
          </Link>
          <Breadcrumb.Divider icon='right chevron' />
          <Breadcrumb.Section>{t('Pages.Professions.Page.EditHeader')}</Breadcrumb.Section>
        </Headerbredcrump>
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
          buttonText={t('Common.Button.Update')}
          submitFunction={handleSubmit}
        />
      </Footerwrapper>
    </Pagewrapper >
  )
}