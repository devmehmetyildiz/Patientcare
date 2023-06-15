import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Divider, Dropdown, Form, Header } from 'semantic-ui-react'
import Notification from '../../Utils/Notification'
import formToObject from 'form-to-object'
import LoadingPage from '../../Utils/LoadingPage'
export default class CostumertypesEdit extends Component {

  constructor(props) {
    super(props)
    const selecteddepartments = []
    const isDatafetched = false
    this.state = {
      selecteddepartments,
      isDatafetched,
    }
  }

  componentDidMount() {
    const { GetCostumertype, match, history, GetDepartments } = this.props
    if (match.params.CostumertypeID) {
      GetCostumertype(match.params.CostumertypeID)
      GetDepartments()
    } else {
      history.push("/Costumertypes")
    }
  }

  componentDidUpdate() {
    const { Departments, Costumertypes, removeCostumertypenotification, removeDepartmentnotification } = this.props
    const { selected_record, isLoading } = Costumertypes
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0 && Departments.list.length > 0 && !Departments.isLoading && !isLoading && !this.state.isDatafetched) {
      this.setState({
        selecteddepartments: selected_record.Departments.map(department => {
          return department.Uuid
        }), isDatafetched: true,
      })
    }
    Notification(Costumertypes.notifications, removeCostumertypenotification)
    Notification(Departments.notifications, removeDepartmentnotification)
  }

  render() {

    const { Costumertypes, Departments } = this.props
    const { selected_record } = Costumertypes

    const Departmentoptions = Departments.list.map(department => {
      return { key: department.Uuid, text: department.Name, value: department.Uuid }
    })

    return (
      Departments.isLoading || Departments.isDispatching || Costumertypes.isLoading || Costumertypes.isDispatching ? <LoadingPage /> :
        <div className='w-full h-[calc(100vh-59px-2rem)] mx-auto flex flex-col  justify-start items-center pb-[2rem] px-[2rem]'>
          <div className='w-full mx-auto align-middle'>
            <Header style={{ backgroundColor: 'transparent', border: 'none', color: '#3d3d3d' }} as='h1' attached='top' >
              <Breadcrumb size='big'>
                <Link to={"/Costumertypes"}>
                  <Breadcrumb.Section >Müşteri Türleri</Breadcrumb.Section>
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
                <Form.Input label="Müşteri Tür Adı" placeholder="Müşteri Tür Adı" name="Name" fluid defaultValue={selected_record.Name} />
              </Form.Group>
              <Form.Group widths='equal'>
                <Form.Field>
                  <label className='text-[#000000de]'>Departmanlar</label>
                  <Dropdown placeholder='Departmanlar' clearable search fluid multiple selection options={Departmentoptions} onChange={this.handleChange} value={this.state.selecteddepartments} />
                </Form.Field>
              </Form.Group>
              <div className='flex flex-row w-full justify-between py-4  items-center'>
                <Link to="/Costumertypes">
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

    const { EditCostumertypes, history, fillCostumertypenotification, Departments, Costumertypes } = this.props
    const { list } = Departments
    const data = formToObject(e.target)
    data.Departments = this.state.selecteddepartments.map(department => {
      return list.find(u => u.Uuid === department)
    })

    let errors = []
    if (!data.Name || data.Name === '') {
      errors.push({ type: 'Error', code: 'Müşteri Türleri', description: 'İsim Boş Olamaz' })
    }
    if (!data.Departments || data.Departments.length <= 0) {
      errors.push({ type: 'Error', code: 'Müşteri Türleri', description: 'Hiç Bir Departman seçili değil' })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillCostumertypenotification(error)
      })
    } else {
      EditCostumertypes({ data: { ...Costumertypes.selected_record, ...data }, history })
    }
  }

  handleChange = (e, { value }) => {
    this.setState({ selecteddepartments: value })
  }

  handleChangeOption = (e, { value }) => {
    this.setState({ selectedstatusOption: value })
  }
}
