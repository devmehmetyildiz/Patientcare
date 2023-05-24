import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Divider, Dropdown, Form, Icon, Popup } from 'semantic-ui-react'
import { Breadcrumb, Button, Header } from 'semantic-ui-react'
import formToObject from 'form-to-object'
import Notification from '../../Utils/Notification'
import LoadingPage from '../../Utils/LoadingPage'

export default class CasesCreate extends Component {

  constructor(props) {
    super(props)
    const selecteddepartments = []
    const record = {}
    const selectedstatusOption = {}
    this.state = {
      selecteddepartments,
      selectedstatusOption
    }
  }


  componentDidMount() {
    const { GetDepartments } = this.props
    GetDepartments()
  }

  componentDidUpdate() {
    const { Cases, removeCasenotification, Departments, removeDepartmentnotification } = this.props
    Notification(Cases.notifications, removeCasenotification)
    Notification(Departments.notifications, removeDepartmentnotification)
  }


  render() {
    const { Cases, Departments } = this.props

    const Departmentoptions = Departments.list.map(department => {
      return { key: department.concurrencyStamp, text: department.name, value: department.concurrencyStamp }
    })

    const casestatusOption = [
      {
        key: '0',
        text: 'Pasif',
        value: 0,
      },
      {
        key: '1',
        text: 'Tamamlama',
        value: 1,
      },
      {
        key: '2',
        text: 'İptal Etme',
        value: 2,
      },
    ]

    return (
      Cases.isLoading || Cases.isDispatching || Departments.isLoading || Departments.isDispatching ? <LoadingPage /> :
        <div className='w-full h-[calc(100vh-59px-2rem)] mx-auto flex flex-col  justify-start items-center pb-[2rem] px-[2rem]'>
          <div className='w-full mx-auto align-middle'>
            <Header style={{ backgroundColor: 'transparent', border: 'none', color: '#3d3d3d' }} as='h1' attached='top' >
              <Breadcrumb size='big'>
                <Link to={"/Cases"}>
                  <Breadcrumb.Section >Durumlar</Breadcrumb.Section>
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
                <Form.Input label="Durum Adı" placeholder="Durum Adı" name="name" fluid />
                <Form.Input label="Durum Kısaltma" placeholder="Durum Kısaltma" name="shortname" fluid />
              </Form.Group>
              <Form.Group widths='equal'>
                <Form.Field>
                  <label className='text-[#000000de]'>Durum Rengi<span> <Popup
                    trigger={<Icon link name='exclamation' />}
                    content='blue,red,green...'
                    position='bottom left'
                  /></span></label>
                  <Form.Input placeholder="Durum Rengi" name="casecolor" fluid />
                </Form.Field>
                <Form.Field>
                  <label className='text-[#000000de]'>Durum Türü</label>
                  <Dropdown placeholder='Durum Türü' fluid selection options={casestatusOption} onChange={this.handleChangeOption} />
                </Form.Field>
              </Form.Group>
              <Form.Group widths='equal'>
                <Form.Field>
                  <label className='text-[#000000de]'>Departmanlar</label>
                  <Dropdown placeholder='Departmanlar' clearable search fluid multiple selection options={Departmentoptions} onChange={this.handleChange} />
                </Form.Field>
              </Form.Group>
              <div className='flex flex-row w-full justify-between py-4  items-center'>
                <Link to="/Cases">
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
    const { AddCases, history, fillCasenotification, Departments } = this.props
    const { list } = Departments
    const data = formToObject(e.target)
    data.departments = this.state.selecteddepartments.map(department => {
      return list.find(u => u.concurrencyStamp === department)
    })
    data.caseStatus = this.state.selectedstatusOption
    data.departmentstxt = null
    data.id = 0
    data.concurrencyStamp = null
    data.createdUser = null
    data.updatedUser = null
    data.deleteUser = null
    data.createTime = null
    data.updateTime = null
    data.deleteTime = null
    data.isActive = true

    let errors = []
    if (!data.name || data.name == '') {
      errors.push({ type: 'Error', code: 'Durumlar', description: 'İsim Boş Olamaz' })
    }
    if ((!Number.isInteger(data.caseStatus))) {
      errors.push({ type: 'Error', code: 'Durumlar', description: 'Tür seçili değil' })
    }
    if (!data.casecolor || data.casecolor == '') {
      errors.push({ type: 'Error', code: 'Durumlar', description: 'Renk seçili değil' })
    }
    if (!data.shortname || data.shortname == '') {
      errors.push({ type: 'Error', code: 'Durumlar', description: 'Kısaltma girili değil' })
    }
    if (!data.departments || data.departments.length <= 0) {
      errors.push({ type: 'Error', code: 'Durumlar', description: 'Hiç Bir Departman seçili değil' })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillCasenotification(error)
      })
    } else {
      AddCases(data, history)
    }
  }

  handleChange = (e, { value }) => {
    this.setState({ selecteddepartments: value })
  }

  handleChangeOption = (e, { value }) => {
    this.setState({ selectedstatusOption: value })
  }
}