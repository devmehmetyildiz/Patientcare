import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Divider, Dropdown, Form, Header } from 'semantic-ui-react'
import formToObject from 'form-to-object'
import LoadingPage from '../../Utils/LoadingPage'
import Notification from "../../Utils/Notification"

export default class TodogroupdefinesEdit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedtodos: [],
      isDatafetched: false,
      selectedDepartment: "",
    }
  }

  componentDidMount() {
    const { GetTodogroupdefine, match, history, GetTododefines, GetDepartments } = this.props
    if (match.params.TodogroupdefineID) {
      GetTodogroupdefine(match.params.TodogroupdefineID)
      GetTododefines()
      GetDepartments()
    } else {
      history.push("/Todogroupdefines")
    }
  }

  componentDidUpdate() {
    const { Todogroupdefines, Tododefines, Departments, removeDepartmentnotification, removeTodogroupdefinenotification, removeTododefinenotification } = this.props
    const { selected_record, isLoading } = Todogroupdefines
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.id !== 0 && Tododefines.list.length > 0 && !Tododefines.isLoading && !isLoading && !this.state.isDatafetched) {
      this.setState({
        selectedtodos: selected_record.todos.map(todos => {
          return todos.concurrencyStamp
        }), isDatafetched: true,
        selectedDepartment: selected_record.departmentID
      })
    }
    Notification(Todogroupdefines.notifications, removeTodogroupdefinenotification)
    Notification(Tododefines.notifications, removeTododefinenotification)
    Notification(Departments.notifications, removeDepartmentnotification)
  }

  render() {

    const { Todogroupdefines, Tododefines, Departments } = this.props

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
                <Form.Input defaultValue={Todogroupdefines.selected_record?.name} label="Yapılacaklar Grup Adı" placeholder="Yapılacaklar Grup Adı" name="name" fluid />
              </Form.Field>
              <Form.Group widths={'equal'}>
                <Form.Field>
                  <label className='text-[#000000de]'>Yapılacaklar</label>
                  <Dropdown value={this.state.selectedtodos} placeholder='Yapılacaklar' clearable search fluid multiple selection options={Tododefineoptions} onChange={(e, { value }) => { this.setState({ selectedTododefines: value }) }} />
                </Form.Field>
                <Form.Field>
                  <label className='text-[#000000de]'>Departman</label>
                  <Dropdown value={this.state.selectedDepartment} placeholder='Departman' clearable search fluid selection options={Departmentoptions} onChange={(e, { value }) => { this.setState({ selectedDepartment: value }) }} />
                </Form.Field>
              </Form.Group>
              <div className='flex flex-row w-full justify-between py-4  items-center'>
                <Link to="/Todogroupdefines">
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

    const { EditTodogroupdefines, history, fillTodogroupdefinenotification, Todogroupdefines, Tododefines } = this.props
    const { list } = Tododefines
    const data = formToObject(e.target)
    data.todos = this.state.selectedtodos.map(tododefines => {
      return list.find(u => u.concurrencyStamp === tododefines)
    })
    data.departmentID = this.state.selectedDepartment

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
      EditTodogroupdefines({ ...Todogroupdefines.selected_record, ...data }, history)
    }
  }

  handleChange = (e, { value }) => {
    this.setState({ selectedtodos: value })
  }
}
