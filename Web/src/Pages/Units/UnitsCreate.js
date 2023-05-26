import React, { Component } from 'react'
import { Link} from 'react-router-dom'
import {  Divider, Dropdown, Form } from 'semantic-ui-react'
import { Breadcrumb, Button,Header } from 'semantic-ui-react'
import formToObject from 'form-to-object'
import LoadingPage from '../../Utils/LoadingPage'
import Notification from '../../Utils/Notification'

export default class CasesCreate extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selecteddepartments:[],
      selectedstatusOption:{}
    }
  }

  componentDidMount() {
    const { GetDepartments } = this.props
    GetDepartments()
  }

  componentDidUpdate() {
    const { Units, removeUnitnotification,Departments,removeDepartmentnotification } = this.props
    Notification(Units.notifications, removeUnitnotification)
    Notification(Departments.notifications, removeDepartmentnotification)
  }

  render() {
    const { Units, Departments } = this.props

    const Departmentoptions = Departments.list.map(department => {
      return { key: department.Uuid, text: department.Name, value: department.Uuid }
    })

    const unitstatusOption = [
      {
        key: '0',
        text: 'Number',
        value: 0,
      },
      {
        key: '1',
        text: 'String',
        value: 1,
      }
    ]

    return (
      Units.isLoading || Units.isDispatching || Departments.isLoading || Departments.isDispatching ? <LoadingPage /> :
        <div className='w-full h-[calc(100vh-59px-2rem)] mx-auto flex flex-col  justify-start items-center pb-[2rem] px-[2rem]'>
          <div className='w-full mx-auto align-middle'>
            <Header style={{ backgroundColor: 'transparent', border: 'none', color: '#3d3d3d' }} as='h1' attached='top' >
              <Breadcrumb size='big'>
                <Link to={"/Units"}>
                  <Breadcrumb.Section >Birimler</Breadcrumb.Section>
                </Link>
                <Breadcrumb.Divider icon='right chevron' />
                <Breadcrumb.Section>Oluştur</Breadcrumb.Section>
              </Breadcrumb>
            </Header>
          </div>
          <Divider className='w-full  h-[1px]' />
          <div className='w-full bg-white p-4 rounded-lg shadow-md outline outline-[1px] outline-gray-200 '>
            <Form className='' onSubmit={this.handleSubmit}>
              <Form.Group widths='equal'>
                <Form.Input label="Birim Adı" placeholder="Birim Adı" name="Name" fluid />
                <Form.Field>
                  <label className='text-[#000000de]'>Birim Türü</label>
                  <Dropdown placeholder='Birim Türü' fluid selection options={unitstatusOption} onChange={this.handleChangeOption} />
                </Form.Field>
              </Form.Group>
              <Form.Group widths='equal'>
                <Form.Field>
                  <label className='text-[#000000de]'>Departmanlar</label>
                  <Dropdown placeholder='Departmanlar' clearable search fluid multiple selection options={Departmentoptions} onChange={this.handleChange} />
                </Form.Field>
              </Form.Group>
              <div className='flex flex-row w-full justify-between py-4  items-center'>
                <Link to="/Units">
                  <Button floated="left" color='grey'>Geri Dön</Button>
                </Link>
                <Button floated="right" type='submit' color='blue'>Oluştur</Button>
              </div>
            </Form>
          </div>

        </div>
    )
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { AddUnits, history, fillUnitnotification, Departments } = this.props
    const { list } = Departments
    const data = formToObject(e.target)
    data.Unittype = this.state.selectedstatusOption
    data.Departments = this.state.selecteddepartments.map(department => {
      return list.find(u => u.Uuid === department)
    })

    let errors = []
    if (!data.Name || data.Name === '') {
      errors.push({ type: 'Error', code: 'Birimler', description: 'İsim Boş Olamaz' })
    }
    if ((Number.isNaN(data.Unittype))) {
      errors.push({ type: 'Error', code: 'Birimler', description: 'Tür Seçili Değil' })
    }
    if (!data.Departments || data.Departments.length <= 0) {
      errors.push({ type: 'Error', code: 'Birimler', description: 'Hiç Bir Departman seçili değil' })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillUnitnotification(error)
      })
    } else {
      AddUnits(data, history)
    }
  }

  handleChange = (e, { value }) => {
    this.setState({ selecteddepartments: value })
  }

  handleChangeOption = (e, { value }) => {
    this.setState({ selectedstatusOption: value })
  }
}