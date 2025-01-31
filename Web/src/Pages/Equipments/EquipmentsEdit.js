import React, { Component, useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Form, Icon, Table } from 'semantic-ui-react'
import validator from "../../Utils/Validator"
import { FormContext } from '../../Provider/FormProvider'
import {
  Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump,
  Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton
} from '../../Components'

export default function EquipmentsEdit(props) {
  const PAGE_NAME = "EquipmentsEdit"

  const { GetEquipment, match, history, GetEquipmentgroups, GetRooms, GetFloors, GetBeds, GetUsers, EquipmentID } = props
  const { Equipments, Rooms, Floors, Beds, Equipmentgroups, Users, EditEquipments, fillEquipmentnotification, Profile } = props

  const [selectedProperties, setSelectedProperties] = useState([])

  const context = useContext(FormContext)

  const t = Profile?.i18n?.t
  const { selected_record, isLoading } = Equipments

  const Id = EquipmentID || match?.params?.EquipmentID

  const AddNew = () => {
    setSelectedProperties([...selectedProperties,
    {
      EquipmentID: '',
      Propertyname: '',
      Propertyvalue: '',
      key: Math.random(),
      Order: selectedProperties.length,
    }])
  }

  const remove = (key, order) => {
    let properties = selectedProperties.filter(productionRoute => productionRoute.key !== key)
    properties.filter(property => property.Order > order).forEach(property => property.Order--)
    setSelectedProperties(properties)
  }

  const changeHandler = (key, property, value) => {

    let productionRoutes = selectedProperties
    const index = productionRoutes.findIndex(productionRoute => productionRoute.key === key)
    if (property === 'Order') {
      productionRoutes.filter(item => item.Order === value).forEach((item) => item.Order = productionRoutes[index].Order > value ? item.Order + 1 : item.Order - 1)
    }
    productionRoutes[index][property] = value
    setSelectedProperties(productionRoutes)
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const data = context.getForm(PAGE_NAME)
    data.Equipmentproperties = selectedProperties
    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: t('Pages.Equipments.Page.Header'), description: t('Pages.Equipments.Messages.NameRequired') })
    }
    if (!validator.isString(data.EquipmentgroupID)) {
      errors.push({ type: 'Error', code: t('Pages.Equipments.Page.Header'), description: t('Pages.Equipments.Messages.EquipmentgroupRequired') })
    }
    if (!validator.isString(data.UserID)) {
      errors.push({ type: 'Error', code: t('Pages.Equipments.Page.Header'), description: t('Pages.Equipments.Messages.UserRequired') })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillEquipmentnotification(error)
      })
    } else {
      EditEquipments({ data: { ...Equipments.selected_record, ...data }, history })
    }
  }

  const Equipmentgroupoptions = (Equipmentgroups.list || []).filter(u => u.Isactive).map(group => {
    return { key: group.Uuid, text: group.Name, value: group.Uuid }
  })

  const Flooroptions = (Floors.list || []).filter(u => u.Isactive).map(floor => {
    return { key: floor.Uuid, text: floor.Name, value: floor.Uuid }
  })

  const Roomsoptions = (Rooms.list || []).filter(u => u.Isactive && u.FloorID === data?.FloorID).map(room => {
    return { key: room.Uuid, text: room.Name, value: room.Uuid }
  })

  const Bedsoptions = (Beds.list || []).filter(u => u.Isactive && u.RoomID === data?.RoomID).map(bed => {
    return { key: bed.Uuid, text: bed.Name, value: bed.Uuid }
  })

  const Usersoptions = (Users.list || []).filter(u => u.Isactive).map(user => {
    return { key: user.Uuid, text: user.Username, value: user.Uuid }
  })

  const data = context.getForm(PAGE_NAME)

  useEffect(() => {

    if (selected_record && validator.isObject(selected_record)) {
      setSelectedProperties((selected_record?.Equipmentproperties || []).map(u => {
        return { ...u, key: Math.random() }
      }))
      context.setForm(PAGE_NAME, selected_record)
    }
  }, [selected_record, setSelectedProperties])

  useEffect(() => {

    if (validator.isUUID(Id)) {
      GetEquipment(Id)
      GetEquipmentgroups()
      GetRooms()
      GetFloors()
      GetBeds()
      GetUsers()
    } else {
      history.push("/Equipments")
    }
  }, [])

  return (
    <Pagewrapper dimmer isLoading={isLoading}>
      <Headerwrapper>
        <Headerbredcrump>
          <Link to={"/Equipments"}>
            <Breadcrumb.Section >{t('Pages.Equipments.Page.Header')}</Breadcrumb.Section>
          </Link>
          <Breadcrumb.Divider icon='right chevron' />
          <Breadcrumb.Section>{t('Pages.Equipments.Page.EditHeader')}</Breadcrumb.Section>
        </Headerbredcrump>
      </Headerwrapper>
      <Pagedivider />
      <Contentwrapper>
        <Form>
          <Form.Group widths={'equal'}>
            <FormInput page={PAGE_NAME} required placeholder={t('Pages.Equipments.Column.Name')} name="Name" />
            <FormInput page={PAGE_NAME} required placeholder={t('Pages.Equipments.Column.Equipmentgroup')} name="EquipmentgroupID" options={Equipmentgroupoptions} formtype="dropdown" />
            <FormInput page={PAGE_NAME} required placeholder={t('Pages.Equipments.Column.User')} name="UserID" options={Usersoptions} formtype="dropdown" />
          </Form.Group>
          <Form.Group widths={'equal'}>
            <FormInput page={PAGE_NAME} required placeholder={t('Pages.Equipments.Column.Floor')} name="FloorID" options={Flooroptions} formtype="dropdown" />
            {validator.isUUID(data?.FloorID) && <FormInput page={PAGE_NAME} required placeholder={t('Pages.Equipments.Column.Room')} name="RoomID" options={Roomsoptions} formtype="dropdown" />}
            {validator.isUUID(data?.FloorID) && validator.isUUID(data?.RoomID) && <FormInput page={PAGE_NAME} required placeholder={t('Pages.Equipments.Column.Bed')} name="BedID" options={Bedsoptions} formtype="dropdown" />}
          </Form.Group>
          <Table celled className='overflow-x-auto' key='table' >
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell width={1}>{t('Pages.Equipments.Column.Order')}</Table.HeaderCell>
                <Table.HeaderCell width={3}>{t('Pages.Equipments.Column.Propertyname')}</Table.HeaderCell>
                <Table.HeaderCell width={6}>{t('Pages.Equipments.Column.Propertyvalue')}</Table.HeaderCell>
                <Table.HeaderCell width={1}>{t('Pages.Equipments.Column.Remove')}</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {selectedProperties.sort((a, b) => a.Order - b.Order).map((property, index) => {
                return <Table.Row key={property.key}>
                  <Table.Cell>
                    <Button.Group basic size='small'>
                      <Button type='button' disabled={index === 0} icon='angle up' onClick={() => { changeHandler(property.key, 'Order', property.Order - 1) }} />
                      <Button type='button' disabled={index + 1 === selectedProperties.length} icon='angle down' onClick={() => { changeHandler(property.key, 'Order', property.Order + 1) }} />
                    </Button.Group>
                  </Table.Cell>
                  <Table.Cell>
                    <Form.Field>
                      <Form.Input value={property.Propertyname} placeholder={t('Pages.Equipments.Column.Propertyname')} name="Propertyname" onChange={(e) => { changeHandler(property.key, 'Propertyname', e.target.value) }} />
                    </Form.Field>
                  </Table.Cell>
                  <Table.Cell>
                    <Form.Input value={property.Propertyvalue} placeholder={t('Pages.Equipments.Column.Propertyvalue')} name="Propertyvalue" onChange={(e) => { changeHandler(property.key, 'Propertyvalue', e.target.value) }} />
                  </Table.Cell>
                  <Table.Cell className='table-last-section'>
                    {!property.Uuid && <Icon className='type-conversion-remove-icon' link color='red' name='minus circle'
                      onClick={() => { remove(property.key, property.Order) }} />}
                  </Table.Cell>
                </Table.Row>
              })}
            </Table.Body>
            <Table.Footer>
              <Table.Row>
                <Table.Cell colSpan='11'>
                  <Button type="button" color='green' className='addMoreButton' size='mini' onClick={() => { AddNew() }}>{t('Pages.Equipments.Column.Addproperty')}</Button>
                </Table.Cell>
              </Table.Row>
            </Table.Footer>
          </Table>
        </Form>
      </Contentwrapper>
      <Footerwrapper>
        <Gobackbutton
          history={history}
          redirectUrl={"/Equipments"}
          buttonText={t('Common.Button.Goback')}
        />
        <Submitbutton
          isLoading={Equipments.isLoading}
          buttonText={t('Common.Button.Update')}
          submitFunction={handleSubmit}
        />
      </Footerwrapper>
    </Pagewrapper >
  )
}
