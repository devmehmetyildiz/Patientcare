import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Divider, Dropdown, Form } from 'semantic-ui-react'
import { Breadcrumb, Button, Header } from 'semantic-ui-react'
import formToObject from 'form-to-object'
import LoadingPage from '../../Utils/LoadingPage'
import Notification from '../../Utils/Notification'

export default class TodogroupdefinesCreate extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedTododefines: [],
      selectedDepartment: "",
    }
  }


  componentDidMount() {
    const { GetTododefines, GetDepartments } = this.props
    GetTododefines()
    GetDepartments()
  }

  componentDidUpdate() {
    const { Todogroupdefines, Departments, removeDepartmentnotification, Tododefines,
      removeTododefinenotification, removeTodogroupdefinenotification } = this.props
    Notification(Todogroupdefines.notification, removeTodogroupdefinenotification)
    Notification(Tododefines.notification, removeTododefinenotification)
    Notification(Departments.notification, removeDepartmentnotification)
  }

  render() {
    const { Todogroupdefines, Departments, Tododefines } = this.props

    const Tododefineoptions = Tododefines.list.map(tododefine => {
      return { key: tododefine.Uuid, text: tododefine.Name, value: tododefine.Uuid }
    })
    const Departmentoptions = Departments.list.map(department => {
      return { key: department.Uuid, text: department.Name, value: department.Uuid }
    })

    return (
      Todogroupdefines.isLoading || Todogroupdefines.isDispatching || Tododefines.isLoading || Tododefines.isDispatching ? <LoadingPage /> :
        <div className='w-full h-[calc(100vh-59px-2rem)] mx-auto flex flex-col  justify-start items-center pb-[2rem] px-[2rem]'>
          <div className='w-full mx-auto align-middle'>
            <Header style={{ backgroundColor: 'transparent', border: 'none', color: '#3d3d3d' }} as='h1' attached='top' >
              <Breadcrumb size='big'>
                <Link to={"/Todogroupdefines"}>
                  <Breadcrumb.Section >Yapılacaklar Grupları</Breadcrumb.Section>
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
                <Form.Input label="Yapılacaklar Grup Adı" placeholder="Yapılacaklar Grup Adı" name="Name" fluid />
              </Form.Field>
              <Form.Group widths={'equal'}>
                <Form.Field>
                  <label className='text-[#000000de]'>Yapılacaklar</label>
                  <Dropdown placeholder='Yapılacaklar' clearable search fluid multiple selection options={Tododefineoptions} onChange={(e, { value }) => { this.setState({ selectedTododefines: value }) }} />
                </Form.Field>
                <Form.Field>
                  <label className='text-[#000000de]'>Departman</label>
                  <Dropdown placeholder='Departman' clearable search fluid selection options={Departmentoptions} onChange={(e, { value }) => { this.setState({ selectedDepartment: value }) }} />
                </Form.Field>
              </Form.Group>
              <div className='flex flex-row w-full justify-between py-4  items-center'>
                <Link to="/Todogroupdefines">
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

    const { AddTodogroupdefines, history, fillTodogroupdefinenotification, Tododefines } = this.props
    const { list } = Tododefines
    const data = formToObject(e.target)
    data.Tododefines = this.state.selectedTododefines.map(tododefines => {
      return list.find(u => u.Uuid === tododefines)
    })
    data.DepartmentID = this.state.selectedDepartment

    let errors = []
    if (!data.Name || data.Name === '') {
      errors.push({ type: 'Error', code: 'Yapılacaklar Grupları', description: 'İsim Boş Olamaz' })
    }
    if (!data.Tododefines || data.Tododefines.length <= 0) {
      errors.push({ type: 'Error', code: 'Yapılacaklar Grupları', description: 'Hiç Bir yapılacak seçili değil' })
    }
    if (!data.DepartmentID || data.DepartmentID === '') {
      errors.push({ type: 'Error', code: 'Yapılacaklar Grupları', description: 'Departman Seçili değil' })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillTodogroupdefinenotification(error)
      })
    } else {
      AddTodogroupdefines({data, history})
    }
  }

 
}