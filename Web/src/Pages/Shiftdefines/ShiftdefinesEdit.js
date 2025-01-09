import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { FormInput, Contentwrapper, Footerwrapper, Gobackbutton, Headerbredcrump, Headerwrapper, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'

export default function ShiftdefinesEdit(props) {
  const PAGE_NAME = "ShiftdefinesEdit"

  const { Shiftdefines, Profile, ShiftdefineID, GetShiftdefine, match, history, EditShiftdefines, fillShiftdefinenotification } = props

  const context = useContext(FormContext)

  const Id = ShiftdefineID || match?.params?.ShiftdefineID
  const { selected_record, isLoading } = Shiftdefines
  const t = Profile?.i18n?.t

  const handleSubmit = (e) => {
    e.preventDefault()

    const data = context.getForm(PAGE_NAME)

    !validator.isBoolean(data?.Isjoker) && (data.Isjoker = false)

    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: t('Pages.Shiftdefines.Page.Header'), description: t('Pages.Shiftdefines.Messages.NameRequired') })
    }
    if (!validator.isString(data.Starttime)) {
      errors.push({ type: 'Error', code: t('Pages.Shiftdefines.Page.Header'), description: t('Pages.Shiftdefines.Messages.StarttimeRequired') })
    }
    if (!validator.isString(data.Endtime)) {
      errors.push({ type: 'Error', code: t('Pages.Shiftdefines.Page.Header'), description: t('Pages.Shiftdefines.Messages.EndtimeRequired') })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillShiftdefinenotification(error)
      })
    } else {
      EditShiftdefines({ data: { ...Shiftdefines.selected_record, ...data }, history })
    }
  }

  useEffect(() => {
    if (validator.isUUID(Id)) {
      GetShiftdefine(Id)
    } else {
      history.push("/Shiftdefines")
    }
  }, [])

  useEffect(() => {
    if (selected_record && validator.isObject(selected_record)) {
      context.setForm(PAGE_NAME, selected_record)
    }
  }, [selected_record])



  return (
    <Pagewrapper dimmer isLoading={isLoading}>
      <Headerwrapper>
        <Headerbredcrump>
          <Link to={"/Shiftdefines"}>
            <Breadcrumb.Section >{t('Pages.Shiftdefines.Page.Header')}</Breadcrumb.Section>
          </Link>
          <Breadcrumb.Divider icon='right chevron' />
          <Breadcrumb.Section>{t('Pages.Shiftdefines.Page.EditHeader')}</Breadcrumb.Section>
        </Headerbredcrump>
      </Headerwrapper>
      <Pagedivider />
      <Contentwrapper>
        <Form>
          <Form.Group widths={'equal'}>
            <FormInput page={PAGE_NAME} required placeholder={t('Pages.Shiftdefines.Column.Name')} name="Name" />
            <FormInput page={PAGE_NAME} placeholder={t('Pages.Shiftdefines.Column.Priority')} name="Priority" type='number' min="0" max="10"/>
          </Form.Group>
          <Form.Group widths={'equal'}>
            <FormInput page={PAGE_NAME} required placeholder={t('Pages.Shiftdefines.Column.Starttime')} name="Starttime" type='time' />
            <FormInput page={PAGE_NAME} required placeholder={t('Pages.Shiftdefines.Column.Endtime')} name="Endtime" type='time' />
          </Form.Group>
          <Form.Group widths={'equal'}>
            <FormInput page={PAGE_NAME} required placeholder={t('Pages.Shiftdefines.Column.Isjoker')} name="Isjoker" formtype="checkbox" />
          </Form.Group>
        </Form>
      </Contentwrapper>
      <Footerwrapper>
        <Gobackbutton
          history={history}
          redirectUrl={"/Shiftdefines"}
          buttonText={t('Common.Button.Goback')}
        />
        <Submitbutton
          isLoading={Shiftdefines.isLoading}
          buttonText={t('Common.Button.Update')}
          submitFunction={handleSubmit}
        />
      </Footerwrapper>
    </Pagewrapper >
  )
}