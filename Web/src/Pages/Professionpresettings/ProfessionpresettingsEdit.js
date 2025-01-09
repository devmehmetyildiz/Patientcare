import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { } from 'semantic-ui-react'
import { Breadcrumb, Form } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
import { Getdateoptions } from '../../Utils/Formatdate'
import usePreviousUrl from '../../Hooks/usePreviousUrl'

export default function ProfessionpresettingsEdit(props) {
  const PAGE_NAME = "ProfessionpresettingsEdit"

  const { ProfessionpresettingID, GetProfessionpresetting, GetFloors, GetShiftdefines, GetProfessions, match, history, closeModal } = props
  const { Professionpresettings, Floors, Professions, Shiftdefines } = props
  const { EditProfessionpresettings, fillProfessionpresettingnotification, Profile } = props

  const Id = ProfessionpresettingID || match?.params?.ProfessionpresettingID
  const t = Profile?.i18n?.t
  const { selected_record, isLoading } = Professionpresettings

  const { calculateRedirectUrl } = usePreviousUrl()
  const context = useContext(FormContext)

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = context.getForm(PAGE_NAME)

    !validator.isBoolean(data?.Isinfinite) && (data.Isinfinite = false)
    !validator.isBoolean(data?.Isapproved) && (data.Isapproved = false)
    !validator.isBoolean(data?.Iscompleted) && (data.Iscompleted = false)
    !validator.isBoolean(data?.Isdeactive) && (data.Isdeactive = false)
    !validator.isBoolean(data?.Ispersonelstay) && (data.Ispersonelstay = false)

    let errors = []

    if (!data.Isinfinite) {
      if (!validator.isISODate(data.Startdate)) {
        errors.push({ type: 'Error', code: t('Pages.Professionpresettings.Page.Header'), description: t('Pages.Professionpresettings.Messages.DateRequired') })
      }
    }
    if (!validator.isUUID(data.ProfessionID)) {
      errors.push({ type: 'Error', code: t('Pages.Professionpresettings.Page.Header'), description: t('Pages.Professionpresettings.Messages.ProfessionRequired') })
    }
    if (!validator.isUUID(data.ShiftdefineID) && !validator.isUUID(data.FloorID)) {
      errors.push({ type: 'Error', code: t('Pages.Professionpresettings.Page.Header'), description: t('Pages.Professionpresettings.Messages.Floororshiftrequired') })
    }

    if (errors.length > 0) {
      errors.forEach(error => {
        fillProfessionpresettingnotification(error)
      })
    } else {
      EditProfessionpresettings({
        data: { ...Professionpresettings.selected_record, ...data },
        history,
        redirectUrl: calculateRedirectUrl({ url: '/Professionpresettings', usePrev: true }),
      })
    }
  }

  const Flooroptions = (Floors.list || []).filter(u => u.Isactive).map(floor => {
    return { key: floor.Uuid, text: floor.Name, value: floor.Uuid }
  })

  const Shiftdefineoptions = (Shiftdefines.list || []).filter(u => u.Isactive).map(shiftdefine => {
    return { key: shiftdefine.Uuid, text: shiftdefine.Name, value: shiftdefine.Uuid }
  })

  const Professionoptions = (Professions.list || []).filter(u => u.Isactive).map(profession => {
    return { key: profession.Uuid, text: profession.Name, value: profession.Uuid }
  })

  const Dateoptions = Getdateoptions()

  const Isinfinite = context.formstates[`${PAGE_NAME}/Isinfinite`]

  const isLoadingstatus =
    Professionpresettings.isLoading ||
    Floors.isLoading ||
    Shiftdefines.isLoading ||
    Professions.isLoading

  useEffect(() => {
    const Isinfinite = context.formstates[`${PAGE_NAME}/Isinfinite`]
    const Startdate = context.formstates[`${PAGE_NAME}/Startdate`]
    const Enddate = context.formstates[`${PAGE_NAME}/Enddate`]
    if (Isinfinite && (Startdate !== null || Enddate !== null)) {
      context.setFormstates({
        ...context.formstates,
        [`${PAGE_NAME}/Startdate`]: null,
        [`${PAGE_NAME}/Enddate`]: null,
      })
    }
  }, [context])

  useEffect(() => {
    if (selected_record && validator.isObject(selected_record)) {
      context.setForm(PAGE_NAME, {
        ...selected_record,
        Startdate: new Date(selected_record?.Startdate).toDateString()
      })
    }
  }, [selected_record])

  useEffect(() => {
    if (validator.isUUID(Id)) {
      GetProfessionpresetting(Id)
      GetFloors()
      GetShiftdefines()
      GetProfessions()
    } else {
      history.push("/Professionpresetting")
    }
  }, [])

  return (
    <Pagewrapper dimmer isLoading={isLoading}>
      <Headerwrapper>
        <Headerbredcrump>
          <Link to={"/Professionpresettings"}>
            <Breadcrumb.Section>{t('Pages.Professionpresettings.Page.Header')}</Breadcrumb.Section>
          </Link>
          <Breadcrumb.Divider icon='right chevron' />
          <Breadcrumb.Section>{t('Pages.Professionpresettings.Page.EditHeader')}</Breadcrumb.Section>
        </Headerbredcrump>
        {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
      </Headerwrapper>
      <Pagedivider />
      <Contentwrapper>
        <Form>
          <FormInput page={PAGE_NAME} placeholder={t('Pages.Professionpresettings.Column.Isinfinite')} name="Isinfinite" formtype="checkbox" />
          {!Isinfinite && <FormInput page={PAGE_NAME} placeholder={t('Pages.Professionpresettings.Column.Startdate')} name="Startdate" options={Dateoptions} formtype="dropdown" />}
          <FormInput page={PAGE_NAME} placeholder={t('Pages.Professionpresettings.Column.Profession')} name="ProfessionID" formtype="dropdown" options={Professionoptions} />
          <Form.Group widths={'equal'}>
            <FormInput page={PAGE_NAME} placeholder={t('Pages.Professionpresettings.Column.Floor')} name="FloorID" formtype="dropdown" options={Flooroptions} />
            <FormInput page={PAGE_NAME} placeholder={t('Pages.Professionpresettings.Column.Shiftdefine')} name="ShiftdefineID" formtype="dropdown" options={Shiftdefineoptions} />
          </Form.Group>
          <Form.Group widths={'equal'}>
            <FormInput page={PAGE_NAME} placeholder={t('Pages.Professionpresettings.Column.Ispersonelstay')} name="Ispersonelstay" formtype="checkbox" />
            <FormInput page={PAGE_NAME} placeholder={t('Pages.Professionpresettings.Column.Minpersonelcount')} name="Minpersonelcount" type="number" />
          </Form.Group>
        </Form>
      </Contentwrapper>
      <Footerwrapper>
        <Gobackbutton
          history={history}
          redirectUrl={"/Professionpresettings"}
          buttonText={t('Common.Button.Goback')}
        />
        <Submitbutton
          isLoading={isLoadingstatus}
          buttonText={t('Common.Button.Update')}
          submitFunction={handleSubmit}
        />
      </Footerwrapper>
    </Pagewrapper >
  )
}