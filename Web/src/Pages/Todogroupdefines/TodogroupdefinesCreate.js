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
      return { key: tododefine.concurrencyStamp, text: tododefine.name, value: tododefine.concurrencyStamp }
    })
    const Departmentoptions = Departments.list.map(department => {
      return { key: department.concurrencyStamp, text: department.name, value: department.concurrencyStamp }
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
                <Form.Input label="Yapılacaklar Grup Adı" placeholder="Yapılacaklar Grup Adı" name="name" fluid />
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
    data.todos = this.state.selectedTododefines.map(tododefines => {
      return list.find(u => u.concurrencyStamp === tododefines)
    })
    data.departmentID = this.state.selectedDepartment
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
    if (!data.name || data.name === '') {
      errors.push({ type: 'Error', code: 'Yapılacaklar Grupları', description: 'İsim Boş Olamaz' })
    }
    if (!data.todos || data.todos.length <= 0) {
      errors.push({ type: 'Error', code: 'Yapılacaklar Grupları', description: 'Hiç Bir yapılacak seçili değil' })
    }
    if (!data.departmentID || data.departmentID === '') {
      errors.push({ type: 'Error', code: 'Yapılacaklar Grupları', description: 'Departman Seçili değil' })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillTodogroupdefinenotification(error)
      })
    } else {
      AddTodogroupdefines(data, history)
    }
  }

 
}