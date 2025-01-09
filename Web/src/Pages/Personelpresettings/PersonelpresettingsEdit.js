import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Form } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import {
  Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump,
  Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton
} from '../../Components'
import { Getdateoptions } from '../../Utils/Formatdate'
import usePreviousUrl from '../../Hooks/usePreviousUrl'

export default function PersonelpresettingsEdit(props) {
  const PAGE_NAME = "PersonelpresettingsEdit"

  const { PersonelpresettingID, GetPersonelpresetting, GetFloors, GetShiftdefines, GetUsers, match, history } = props
  const { Profile, EditPersonelpresettings, fillPersonelpresettingnotification, Personelpresettings, Floors, Users, Shiftdefines } = props

  const Id = PersonelpresettingID || match?.params?.PersonelpresettingID

  const t = Profile?.i18n?.t

  const { selected_record } = Personelpresettings

  const { calculateRedirectUrl } = usePreviousUrl()
  const context = useContext(FormContext)

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = context.getForm(PAGE_NAME)

    !validator.isBoolean(data?.Isinfinite) && (data.Isinfinite = false)
    !validator.isBoolean(data?.Isapproved) && (data.Isapproved = false)
    !validator.isBoolean(data?.Iscompleted) && (data.Iscompleted = false)
    !validator.isBoolean(data?.Isdeactive) && (data.Isdeactive = false)

    let errors = []

    if (!data.Isinfinite) {
      if (!validator.isISODate(data.Startdate)) {
        errors.push({ type: 'Error', code: t('Pages.Personelpresettings.Page.Header'), description: t('Pages.Personelpresettings.Column.DateRequired') })
      }
    }
    if (!validator.isUUID(data.PersonelID)) {
      errors.push({ type: 'Error', code: t('Pages.Personelpresettings.Page.Header'), description: t('Pages.Personelpresettings.Column.PersonelRequired') })
    }
    if (!validator.isUUID(data.ShiftdefineID) && !validator.isUUID(data.FloorID)) {
      errors.push({ type: 'Error', code: t('Pages.Personelpresettings.Page.Header'), description: t('Pages.Personelpresettings.Column.FloorRequired') })
    }

    if (errors.length > 0) {
      errors.forEach(error => {
        fillPersonelpresettingnotification(error)
      })
    } else {
      EditPersonelpresettings({
        data: { ...Personelpresettings.selected_record, ...data },
        redirectUrl: calculateRedirectUrl({ url: '/Personelpresettings', usePrev: true }),
        history
      })
    }
  }

  const Flooroptions = (Floors.list || []).filter(u => u.Isactive).map(floor => {
    return { key: floor.Uuid, text: floor.Name, value: floor.Uuid }
  })

  const Shiftdefineoptions = (Shiftdefines.list || []).filter(u => u.Isactive).map(shiftdefine => {
    return { key: shiftdefine.Uuid, text: shiftdefine.Name, value: shiftdefine.Uuid }
  })

  const Useroptions = (Users.list || []).filter(u => u.Isactive).map(user => {
    return { key: user.Uuid, text: `${user?.Name} ${user?.Surname}`, value: user.Uuid }
  })


  const Dateoptions = Getdateoptions()

  const Isinfinite = context.formstates[`${PAGE_NAME}/Isinfinite`]

  const isLoadingstatus =
    Personelpresettings.isLoading ||
    Floors.isLoading ||
    Shiftdefines.isLoading ||
    Users.isLoading

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
    if (validator.isUUID(Id)) {
      GetPersonelpresetting(Id)
      GetFloors()
      GetShiftdefines()
      GetUsers()
    } else {
      history.push("/Personelpresettings")
    }
  }, [])

  useEffect(() => {
    if (selected_record && validator.isObject(selected_record)) {
      context.setForm(PAGE_NAME,
        {
          ...selected_record,
          Startdate: new Date(selected_record?.Startdate).toDateString()
        })
    }
  }, [selected_record])

  return (
    isLoadingstatus ? <LoadingPage /> :
      <Pagewrapper>
        <Headerwrapper>
          <Headerbredcrump>
            <Link to={"/Personelpresettings"}>
              <Breadcrumb.Section >{t('Pages.Personelpresettings.Page.Header')}</Breadcrumb.Section>
            </Link>
            <Breadcrumb.Divider icon='right chevron' />
            <Breadcrumb.Section>{t('Pages.Personelpresettings.Page.EditHeader')}</Breadcrumb.Section>
          </Headerbredcrump>
        </Headerwrapper>
        <Pagedivider />
        <Contentwrapper>
          <Form>
            <FormInput page={PAGE_NAME} placeholder={t('Pages.Personelpresettings.Column.Isinfinite')} name="Isinfinite" formtype="checkbox" />
            {!Isinfinite && <FormInput page={PAGE_NAME} placeholder={t('Pages.Personelpresettings.Column.Startdate')} name="Startdate" options={Dateoptions} formtype="dropdown" />}
            <FormInput page={PAGE_NAME} placeholder={t('Pages.Personelpresettings.Column.Personel')} name="PersonelID" formtype="dropdown" options={Useroptions} />
            <Form.Group widths={'equal'}>
              <FormInput page={PAGE_NAME} placeholder={t('Pages.Personelpresettings.Column.Floor')} name="FloorID" formtype="dropdown" options={Flooroptions} />
              <FormInput page={PAGE_NAME} placeholder={t('Pages.Personelpresettings.Column.Shiftdefine')} name="ShiftdefineID" formtype="dropdown" options={Shiftdefineoptions} />
            </Form.Group>
          </Form>
        </Contentwrapper>
        <Footerwrapper>
          <Gobackbutton
            history={history}
            redirectUrl={"/Personelpresettings"}
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