import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Form, Icon, Table } from 'semantic-ui-react'
import Literals from './Literals'
import validator from "../../Utils/Validator"
import { FormContext } from '../../Provider/FormProvider'
import {
  Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump,
  Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton
} from '../../Components'

export default class EquipmentsEdit extends Component {

  PAGE_NAME = "EquipmentsEdit"

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false,
      selectedProperties: []
    }
  }

  componentDidMount() {
    const { GetEquipment, match, history, GetEquipmentgroups, GetRooms, GetFloors, GetBeds, GetUsers, EquipmentID } = this.props
    let Id = EquipmentID || match?.params?.EquipmentID
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
  }

  componentDidUpdate() {
    const { Equipments, Rooms, Floors, Beds, Equipmentgroups, Users } = this.props
    const { selected_record, isLoading } = Equipments
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0
      && !Rooms.isLoading && !Floors.isLoading && !Beds.isLoading && !Equipmentgroups.isLoading && !Users.isLoading && !isLoading && !this.state.isDatafetched) {
      this.setState({
        isDatafetched: true,
        selectedProperties: (selected_record?.Equipmentproperties || []).map(u => {
          return { ...u, key: Math.random() }
        })
      })
      this.context.setForm(this.PAGE_NAME, selected_record)
    }
  }

  render() {

    const { Equipments, Equipmentgroups, Floors, Rooms, Beds, Users, Profile, history } = this.props

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
      Equipments.isLoading || Equipments.isDispatching ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Equipments"}>
                <Breadcrumb.Section >{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{Literals.Page.Pageeditheader[Profile.Language]}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Name[Profile.Language]} name="Name" />
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Equipmentgroup[Profile.Language]} name="EquipmentgroupID" options={Equipmentgroupoptions} formtype="dropdown" />
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.User[Profile.Language]} name="UserID" options={Usersoptions} formtype="dropdown" />
              </Form.Group>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Floor[Profile.Language]} name="FloorID" options={Flooroptions} formtype="dropdown" />
                {validator.isUUID(data?.FloorID) && <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Room[Profile.Language]} name="RoomID" options={Roomsoptions} formtype="dropdown" />}
                {validator.isUUID(data?.FloorID) && validator.isUUID(data?.RoomID) && <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Bed[Profile.Language]} name="BedID" options={Bedsoptions} formtype="dropdown" />}
              </Form.Group>
              <Table celled className='overflow-x-auto' key='table' >
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell width={1}>{Literals.Columns.Order[Profile.Language]}</Table.HeaderCell>
                    <Table.HeaderCell width={3}>{Literals.Columns.Propertyname[Profile.Language]}</Table.HeaderCell>
                    <Table.HeaderCell width={6}>{Literals.Columns.Propertyvalue[Profile.Language]}</Table.HeaderCell>
                    <Table.HeaderCell width={1}>{Literals.Columns.Remove[Profile.Language]}</Table.HeaderCell>
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
                          <Form.Input value={property.Propertyname} placeholder={Literals.Columns.Propertyname[Profile.Language]} name="Propertyname" onChange={(e) => { this.changeHandler(property.key, 'Propertyname', e.target.value) }} />
                        </Form.Field>
                      </Table.Cell>
                      <Table.Cell>
                        <Form.Input value={property.Propertyvalue} placeholder={Literals.Columns.Propertyvalue[Profile.Language]} name="Propertyvalue" onChange={(e) => { this.changeHandler(property.key, 'Propertyvalue', e.target.value) }} />
                      </Table.Cell>
                      <Table.Cell className='table-last-section'>
                        {!property.Id && <Icon className='type-conversion-remove-icon' link color='red' name='minus circle'
                          onClick={() => { this.remove(property.key, property.Order) }} />}
                      </Table.Cell>
                    </Table.Row>
                  })}
                </Table.Body>
                <Table.Footer>
                  <Table.Row>
                    <Table.Cell colSpan='11'>
                      <Button type="button" color='green' className='addMoreButton' size='mini' onClick={() => { this.AddNew() }}>{Literals.Button.Addproperty[Profile.Language]}</Button>
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
              buttonText={Literals.Button.Goback[Profile.Language]}
            />
            <Submitbutton
              isLoading={Equipments.isLoading}
              buttonText={Literals.Button.Update[Profile.Language]}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()

    const { EditEquipments, history, Equipments, fillEquipmentnotification, Profile } = this.props
    const data = this.context.getForm(this.PAGE_NAME)
    data.Equipmentproperties = this.state.selectedProperties
    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Namerequired[Profile.Language] })
    }
    if (!validator.isString(data.EquipmentgroupID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Equipmentgrouprequired[Profile.Language] })
    }
    if (!validator.isString(data.UserID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Userrequired[Profile.Language] })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillEquipmentnotification(error)
      })
    } else {
      EditEquipments({ data: { ...Equipments.selected_record, ...data }, history })
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
EquipmentsEdit.contextType = FormContext