import React, { Component, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Form } from 'semantic-ui-react'
import validator from "../../Utils/Validator"
import { FormContext } from '../../Provider/FormProvider'
import {
  Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump,
  Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton
} from '../../Components'

export default function EquipmentgroupsEdit(props) {
  const PAGE_NAME = "EquipmentgroupsEdit"

  const { Equipmentgroups, Departments ,EditEquipmentgroups,  fillEquipmentgroupnotification, Profile,GetEquipmentgroup, match, history, GetDepartments, EquipmentgroupID } = props
  const Id = EquipmentgroupID || match?.params?.EquipmentgroupID
  const { selected_record, isLoading } = Equipmentgroups

  const t = Profile?.i18n?.t

  const context = useContext(FormContext)

  const Departmentoptions = (Departments.list || []).filter(u => u.Isactive).map(department => {
    return { key: department.Uuid, text: department.Name, value: department.Uuid }
  })

  const handleSubmit = (e) => {
    e.preventDefault()

    const data = context.getForm(PAGE_NAME)
    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: t('Pages.Equipmentgroups.Page.Header'), description: t('Pages.Equipmentgroups.Messages.NameRequired') })
    }
    if (!validator.isUUID(data.DepartmentID)) {
      errors.push({ type: 'Error', code: t('Pages.Equipmentgroups.Page.Header'), description: t('Pages.Equipmentgroups.Messages.DepartmentRequired') })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillEquipmentgroupnotification(error)
      })
    } else {
      EditEquipmentgroups({ data: { ...Equipmentgroups.selected_record, ...data }, history })
    }
  }

  useEffect(() => {
    if (selected_record && validator.isObject(selected_record)) {
      context.setForm(PAGE_NAME, selected_record)
    }
  }, [selected_record])

  useEffect(() => {
    if (validator.isUUID(Id)) {
      GetEquipmentgroup(Id)
      GetDepartments()
    } else {
      history.push("/Equipmentgroups")
    }
  }, [])

  return (
    <Pagewrapper dimmer isLoading={isLoading}>
      <Headerwrapper>
        <Headerbredcrump>
          <Link to={"/Equipmentgroups"}>
            <Breadcrumb.Section >{t('Pages.Equipmentgroups.Page.Header')}</Breadcrumb.Section>
          </Link>
          <Breadcrumb.Divider icon='right chevron' />
          <Breadcrumb.Section>{t('Pages.Equipmentgroups.Page.EditHeader')}</Breadcrumb.Section>
        </Headerbredcrump>
      </Headerwrapper>
      <Pagedivider />
      <Contentwrapper>
        <Form>
          <FormInput page={PAGE_NAME} required placeholder={t('Pages.Equipmentgroups.Column.Name')} name="Name" />
          <FormInput page={PAGE_NAME} required placeholder={t('Pages.Equipmentgroups.Column.Department')} name="DepartmentID" options={Departmentoptions} formtype="dropdown" />
        </Form>
      </Contentwrapper>
      <Footerwrapper>
        <Gobackbutton
          history={history}
          redirectUrl={"/Equipmentgroups"}
          buttonText={t('Common.Button.Goback')}
        />
        <Submitbutton
          isLoading={Equipmentgroups.isLoading}
          buttonText={t('Common.Button.Update')}
          submitFunction={handleSubmit}
        />
      </Footerwrapper>
    </Pagewrapper >
  )
}