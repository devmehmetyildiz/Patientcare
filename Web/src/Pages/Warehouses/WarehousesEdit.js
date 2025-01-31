import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import {
  FormInput, Contentwrapper, Footerwrapper, Gobackbutton, Headerbredcrump,
  Headerwrapper, Pagedivider, Pagewrapper, Submitbutton
} from '../../Components'

export default function WarehousesEdit(props) {
  const PAGE_NAME = "WarehousesEdit"
  const { Warehouses, EditWarehouses, fillWarehousenotification, WarehouseID, GetWarehouse, match, history, Profile } = props
  const Id = WarehouseID || match?.params?.WarehouseID

  const { selected_record, isLoading } = Warehouses

  const t = Profile?.i18n?.t

  const context = useContext(FormContext)

  const handleSubmit = (e) => {
    e.preventDefault()

    const data = context.getForm(PAGE_NAME)
    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: t('Pages.Warehouses.Page.Header'), description: t('Pages.Warehouses.Messages.NameRequired') })
    }

    if (errors.length > 0) {
      errors.forEach(error => {
        fillWarehousenotification(error)
      })
    } else {
      EditWarehouses({ data: { ...Warehouses.selected_record, ...data }, history })
    }
  }

  useEffect(() => {
    if (selected_record && validator.isObject(selected_record)) {
      context.setForm(PAGE_NAME, selected_record)
    }
  }, [selected_record])

  useEffect(() => {
    if (validator.isUUID(Id)) {
      GetWarehouse(Id)
    } else {
      history.push("/Warehouses")
    }
  }, [])

  return (
    <Pagewrapper dimmer isLoading={isLoading}>
      <Headerwrapper>
        <Headerbredcrump>
          <Link to={"/Warehouses"}>
            <Breadcrumb.Section >{t('Pages.Warehouses.Page.Header')}</Breadcrumb.Section>
          </Link>
          <Breadcrumb.Divider icon='right chevron' />
          <Breadcrumb.Section>{t('Pages.Warehouses.Page.EditHeader')}</Breadcrumb.Section>
        </Headerbredcrump>
      </Headerwrapper>
      <Pagedivider />
      <Contentwrapper>
        <Form>
          <Form.Group widths={'equal'}>
            <FormInput page={PAGE_NAME} required placeholder={t('Pages.Warehouses.Column.Name')} name="Name" />
          </Form.Group>
          <FormInput page={PAGE_NAME} placeholder={t('Pages.Warehouses.Column.Info')} name="Info" />
        </Form>
      </Contentwrapper>
      <Footerwrapper>
        <Gobackbutton
          history={history}
          redirectUrl={"/Warehouses"}
          buttonText={t('Common.Button.Goback')}
        />
        <Submitbutton
          isLoading={isLoading}
          buttonText={t('Common.Button.Update')}
          submitFunction={handleSubmit}
        />
      </Footerwrapper>
    </Pagewrapper >
  )
}