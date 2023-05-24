import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Divider, Dropdown, Form, Header, Icon, Popup } from 'semantic-ui-react'
import Notification from '../../Utils/Notification'
import formToObject from 'form-to-object'
import LoadingPage from '../../Utils/LoadingPage'
export default class CasesEdit extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selecteddepartments: [],
      isDatafetched: false,
      selectedstatusOption: {}
    }
  }

  componentDidMount() {
    const { GetCase, match, history, GetDepartments } = this.props
    if (match.params.CaseID) {
      GetCase(match.params.CaseID)
      GetDepartments()
    } else {
      history.push("/Cases")
    }
  }

  componentDidUpdate() {
    const { Departments, Cases, removeCasenotification, removeDepartmentnotification } = this.props
    const { selected_record, isLoading } = Cases
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.id != 0 && Departments.list.length > 0 && !Departments.isLoading && !isLoading && !this.state.isDatafetched) {
      this.setState({
        selecteddepartments: selected_record.departments.map(department => {
          return department.concurrencyStamp
        }), isDatafetched: true, selectedstatusOption: selected_record.caseStatus
      })
    }
    Notification(Cases.notifications, removeCasenotification)
    Notification(Departments.notifications, removeDepartmentnotification)
  }

  render() {

    const { Cases, Departments } = this.props
    const { selected_record } = Cases


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
      }
    ]

    return (
      Departments.isLoading || Departments.isDispatching || Cases.isLoading || Cases.isDispatching ? <LoadingPage /> :
        <div className='w-full h-[calc(100vh-59px-2rem)] mx-auto flex flex-col  justify-start items-center pb-[2rem] px-[2rem]'>
          <div className='w-full mx-auto align-middle'>
            <Header style={{ backgroundColor: 'transparent', border: 'none', color: '#3d3d3d' }} as='h1' attached='top' >
              <Breadcrumb size='big'>
                <Link to={"/Cases"}>
                  <Breadcrumb.Section >Durumlar</Breadcrumb.Section>
                </Link>
                <Breadcrumb.Divider icon='right chevron' />
                <Breadcrumb.Section>Güncelle</Breadcrumb.Section>
              </Breadcrumb>
            </Header>
          </div>
          <Divider className='w-full  h-[1px]' />
          <div className='w-full bg-white p-4 rounded-lg shadow-md outline outline-[1px] outline-gray-200 '>
            <Form className='' onSubmit={this.handleSubmit}>
              <Form.Group widths='equal'>
                <Form.Input label="Durum Adı" placeholder="Durum Adı" name="name" fluid defaultValue={selected_record.name} />
                <Form.Input label="Durum Kısaltma" placeholder="Durum Kısaltma" name="shortname" fluid defaultValue={selected_record.shortname} />
              </Form.Group>
              <Form.Group widths='equal'>
                <Form.Field>
                  <label className='text-[#000000de]'>Durum Rengi<span> <Popup
                    trigger={<Icon link name='exclamation' />}
                    content='blue,red,green...'
                    position='bottom left'
                  /></span></label>
                  <Form.Input placeholder="Durum Rengi" name="casecolor" fluid defaultValue={selected_record.casecolor} />
                </Form.Field>
                <Form.Field>
                  <label className='text-[#000000de]'>Durum Türü</label>
                  <Dropdown placeholder='Durum Türü' fluid selection options={casestatusOption} onChange={this.handleChangeOption} value={this.state.selectedstatusOption} />
                </Form.Field>
              </Form.Group>
              <Form.Group widths='equal'>
                <Form.Field>
                  <label className='text-[#000000de]'>Departmanlar</label>
                  <Dropdown placeholder='Departmanlar' clearable search fluid multiple selection options={Departmentoptions} onChange={this.handleChange} value={this.state.selecteddepartments} />
                </Form.Field>
              </Form.Group>
              <div className='flex flex-row w-full justify-between py-4  items-center'>
                <Link to="/Cases">
                  <Button floated="left" color='grey'>Geri Dön</Button>
                </Link>
                <Button floated="right" type='submit' color='blue'>Güncelle</Button>
              </div>
            </Form>
          </div>
        </div>
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()

    const { EditCases, history, fillCasenotification, Departments, Cases } = this.props
    const { list } = Departments
    const pushData = { ...Cases.selected_record }
    const data = formToObject(e.target)
    data.caseStatus = this.state.selectedstatusOption
    console.log('data.caseStatus: ', data.caseStatus);
    data.departments = this.state.selecteddepartments.map(department => {
      return list.find(u => u.concurrencyStamp === department)
    })

    let errors = []
    if (!data.name || data.name == '') {
      errors.push({ type: 'Error', code: 'Durumlar', description: 'İsim Boş Olamaz' })
    }
    console.log('!Number.isInteger(data.caseStatus): ', !Number.isInteger(data.caseStatus));
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
      EditCases({ ...Cases.selected_record, ...data }, history)
    }
  }

  handleChange = (e, { value }) => {
    this.setState({ selecteddepartments: value })
  }

  handleChangeOption = (e, { value }) => {
    console.log('value: ', value);
    this.setState({ selectedstatusOption: value })
  }
}
