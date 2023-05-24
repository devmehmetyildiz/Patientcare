import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Divider, Dropdown, Form, Header } from 'semantic-ui-react'
import Notification from '../../Utils/Notification'
import formToObject from 'form-to-object'
import LoadingPage from '../../Utils/LoadingPage'

export default class DepartmentsEdit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedstations: [],
      isDatafetched: false
    }
  }

  componentDidMount() {
    const { GetDepartment, match, history, GetStations } = this.props
    if (match.params.DepartmentID) {
      GetDepartment(match.params.DepartmentID)
      GetStations()
    } else {
      history.push("/Departments")
    }
  }

  componentDidUpdate() {
    const { Departments, Stations, removeDepartmentnotification, removeStationnotification } = this.props
    const { selected_record, isLoading } = Departments
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.id !== 0 && Stations.list.length > 0 && !Stations.isLoading && !isLoading && !this.state.isDatafetched) {
      this.setState({
        selectedstations: selected_record.stations.map(station => {
          return station.concurrencyStamp
        }), isDatafetched: true
      })
    }
    Notification(Departments.notifications, removeDepartmentnotification)
    Notification(Stations.notifications, removeStationnotification)
  }

  render() {

    const { Departments, Stations } = this.props

    const Stationoptions = Stations.list.map(station => {
      return { key: station.concurrencyStamp, text: station.name, value: station.concurrencyStamp }
    })

    return (
      Departments.isLoading || Departments.isDispatching || Stations.isLoading || Stations.isDispatching ? <LoadingPage /> :
        <div className='w-full h-[calc(100vh-59px-2rem)] mx-auto flex flex-col  justify-start items-center pb-[2rem] px-[2rem]'>
          <div className='w-full mx-auto align-middle'>
            <Header style={{ backgroundColor: 'transparent', border: 'none', color: '#3d3d3d' }} as='h1' attached='top' >
              <Breadcrumb size='big'>
                <Link to={"/Departments"}>
                  <Breadcrumb.Section >Departmanlar</Breadcrumb.Section>
                </Link>
                <Breadcrumb.Divider icon='right chevron' />
                <Breadcrumb.Section>Oluştur</Breadcrumb.Section>
              </Breadcrumb>
            </Header>
          </div>
          <Divider className='w-full  h-[1px]' />
          <div className='w-full bg-white p-4 rounded-lg shadow-md outline outline-[1px] outline-gray-200 '>
            <Form className='' onSubmit={this.handleSubmit}>
              <Form.Field>
                <Form.Input label="Departman Adı" placeholder="Departman Adı" name="name" fluid defaultValue={Departments.selected_record.name} />
              </Form.Field>
              <Form.Field>
                <label className='text-[#000000de]'>Tanımlı İstasyonlar</label>
                <Dropdown placeholder='İstasyonlar' clearable search fluid multiple selection value={this.state.selectedstations} options={Stationoptions} onChange={this.handleChange} />
              </Form.Field>
              <div className='flex flex-row w-full justify-between py-4  items-center'>
                <Link to="/Departments">
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

    const { EditDepartments, history, fillDepartmentnotification, Stations, Departments } = this.props
    const { list } = Stations
    const data = formToObject(e.target)
    data.stations = this.state.selectedstations.map(station => {
      return list.find(u => u.concurrencyStamp === station)
    })

    let errors = []
    if (!data.name || data.name === '') {
      errors.push({ type: 'Error', code: 'Departmanlar', description: 'İsim Boş Olamaz' })
    }
    if (!data.stations || data.stations.length <= 0) {
      errors.push({ type: 'Error', code: 'Departmanlar', description: 'Hiç Bir İstasyon seçili değil' })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillDepartmentnotification(error)
      })
    } else {
      EditDepartments({ ...Departments.selected_record, ...data }, history)
    }
  }

  handleChange = (e, { value }) => {
    this.setState({ selectedstations: value })
  }
}
