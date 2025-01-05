import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Form, Icon, Table } from 'semantic-ui-react'
import validator from "../../Utils/Validator"
import { FormContext } from '../../Provider/FormProvider'
import {
  Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump,
  Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton
} from '../../Components'

export default class EquipmentsCreate extends Component {

  PAGE_NAME = "EquipmentsCreate"

  constructor(props) {
    super(props)
    this.state = {
      selectedProperties: []
    }
  }

  componentDidMount() {
    const { GetEquipmentgroups, GetRooms, GetFloors, GetBeds, GetUsers } = this.props
    GetEquipmentgroups()
    GetRooms()
    GetFloors()
    GetBeds()
    GetUsers()
  }

  render() {
    const { Equipments, Equipmentgroups, Floors, Rooms, Beds, Users, Profile, history, closeModal } = this.props

    const t = Profile?.i18n?.t

    const data = this.context.getForm(this.PAGE_NAME)

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

    return (
      Equipments.isLoading ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Equipments"}>
                <Breadcrumb.Section >{t('Pages.Equipments.Page.Header')}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{t('Pages.Equipments.Page.CreateHeader')}</Breadcrumb.Section>
            </Headerbredcrump>
            {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Equipments.Column.Name')} name="Name" />
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Equipments.Column.Equipmentgroup')} name="EquipmentgroupID" options={Equipmentgroupoptions} formtype="dropdown" />
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Equipments.Column.User')} name="UserID" options={Usersoptions} formtype="dropdown" />
              </Form.Group>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Equipments.Column.Floor')} name="FloorID" options={Flooroptions} formtype="dropdown" />
                {validator.isUUID(data?.FloorID) && <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Equipments.Column.Room')} name="RoomID" options={Roomsoptions} formtype="dropdown" />}
                {validator.isUUID(data?.FloorID) && validator.isUUID(data?.RoomID) && <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Equipments.Column.Bed')} name="BedID" options={Bedsoptions} formtype="dropdown" />}
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
                  {this.state.selectedProperties.sort((a, b) => a.Order - b.Order).map((property, index) => {
                    return <Table.Row key={property.key}>
                      <Table.Cell>
                        <Button.Group basic size='small'>
                          <Button type='button' disabled={index === 0} icon='angle up' onClick={() => { this.changeHandler(property.key, 'Order', property.Order - 1) }} />
                          <Button type='button' disabled={index + 1 === this.state.selectedProperties.length} icon='angle down' onClick={() => { this.changeHandler(property.key, 'Order', property.Order + 1) }} />
                        </Button.Group>
                      </Table.Cell>
                      <Table.Cell>
                        <Form.Field>
                          <Form.Input value={property.Propertyname} placeholder={t('Pages.Equipments.Column.Propertyname')} name="Propertyname" onChange={(e) => { this.changeHandler(property.key, 'Propertyname', e.target.value) }} />
                        </Form.Field>
                      </Table.Cell>
                      <Table.Cell>
                        <Form.Input value={property.Propertyvalue} placeholder={t('Pages.Equipments.Column.Propertyvalue')} name="Propertyvalue" onChange={(e) => { this.changeHandler(property.key, 'Propertyvalue', e.target.value) }} />
                      </Table.Cell>
                      <Table.Cell className='table-last-section'>
                        {!property.Uuid && <Icon className='type-conversion-remove-icon' link color='red' name='minus circle'
                          onClick={() => { this.remove(property.key, property.Order) }} />}
                      </Table.Cell>
                    </Table.Row>
                  })}
                </Table.Body>
                <Table.Footer>
                  <Table.Row>
                    <Table.Cell colSpan='11'>
                      <Button type="button" color='green' className='addMoreButton' size='mini' onClick={() => { this.AddNew() }}>{t('Pages.Equipments.Column.Addproperty')}</Button>
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
              buttonText={t('Common.Button.Create')}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()

    const { AddEquipments, history, fillEquipmentnotification, Profile, closeModal } = this.props

    const t = Profile?.i18n?.t

    const data = this.context.getForm(this.PAGE_NAME)
    data.Equipmentproperties = this.state.selectedProperties
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
      AddEquipments({ data, history, closeModal })
    }
  }

  AddNew = () => {
    this.setState({
      selectedProperties: [...this.state.selectedProperties,
      {
        EquipmentID: '',
        Propertyname: '',
        Propertyvalue: '',
        key: Math.random(),
        Order: this.state.selectedProperties.length,
      }]
    }, () => {
    })
  }

  remove = (key, order) => {
    let properties = this.state.selectedProperties.filter(productionRoute => productionRoute.key !== key)
    properties.filter(property => property.Order > order).forEach(property => property.Order--)
    this.setState({ selectedProperties: properties })
  }

  changeHandler = (key, property, value) => {

    let productionRoutes = this.state.selectedProperties
    const index = productionRoutes.findIndex(productionRoute => productionRoute.key === key)
    if (property === 'Order') {
      productionRoutes.filter(item => item.Order === value).forEach((item) => item.Order = productionRoutes[index].Order > value ? item.Order + 1 : item.Order - 1)
    }
    productionRoutes[index][property] = value
    this.setState({ selectedProperties: productionRoutes })
  }
}
EquipmentsCreate.contextType = FormContext