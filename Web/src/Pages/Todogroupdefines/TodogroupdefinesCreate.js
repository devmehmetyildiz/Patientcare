import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form } from 'semantic-ui-react'
import { Breadcrumb, Button } from 'semantic-ui-react'
import formToObject from 'form-to-object'
import LoadingPage from '../../Utils/LoadingPage'
import Notification from '../../Utils/Notification'
import Literals from './Literals'
import Pagewrapper from '../../Common/Wrappers/Pagewrapper'
import Headerwrapper from '../../Common/Wrappers/Headerwrapper'
import Headerbredcrump from '../../Common/Wrappers/Headerbredcrump'
import Footerwrapper from '../../Common/Wrappers/Footerwrapper'
import validator from '../../Utils/Validator'
import Pagedivider from '../../Common/Styled/Pagedivider'
import Contentwrapper from '../../Common/Wrappers/Contentwrapper'
import FormInput from '../../Utils/FormInput'
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

    Notification(Todogroupdefines.notifications, removeTodogroupdefinenotification)
    Notification(Tododefines.notifications, removeTododefinenotification)
    Notification(Departments.notifications, removeDepartmentnotification)
  }

  render() {
    const { Todogroupdefines, Departments, Tododefines, Profile } = this.props

    const Tododefineoptions = Tododefines.list.map(tododefine => {
      return { key: tododefine.Uuid, text: tododefine.Name, value: tododefine.Uuid }
    })
    const Departmentoptions = Departments.list.map(department => {
      return { key: department.Uuid, text: department.Name, value: department.Uuid }
    })

    return (
      Todogroupdefines.isLoading || Todogroupdefines.isDispatching || Tododefines.isLoading || Tododefines.isDispatching ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Todogroupdefines"}>
                <Breadcrumb.Section >{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{Literals.Page.Pagecreateheader[Profile.Language]}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form onSubmit={this.handleSubmit}>
              <FormInput required placeholder={Literals.Columns.Name[Profile.Language]} name="Name" />
              <Form.Group widths={'equal'}>
                <FormInput required placeholder={Literals.Columns.Tododefines[Profile.Language]} value={this.state.selectedTododefines} clearable multiple selection options={Tododefineoptions} onChange={(e, { value }) => { this.setState({ selectedTododefines: value }) }} formtype='dropdown' />
                <FormInput required placeholder={Literals.Columns.Department[Profile.Language]} value={this.state.selectedDepartment} clearable selection options={Departmentoptions} onChange={(e, { value }) => { this.setState({ selectedDepartment: value }) }} formtype='dropdown' />
              </Form.Group>
              <Footerwrapper>
                <Link to="/Todogroupdefines">
                  <Button floated="left" color='grey'>{Literals.Button.Goback[Profile.Language]}</Button>
                </Link>
                <Button floated="right" type='submit' color='blue'>{Literals.Button.Create[Profile.Language]}</Button>
              </Footerwrapper>
            </Form>
          </Contentwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()

    const { AddTodogroupdefines, history, fillTodogroupdefinenotification, Tododefines, Profile } = this.props
    const { list } = Tododefines
    const data = formToObject(e.target)
    data.Tododefines = this.state.selectedTododefines.map(tododefines => {
      return list.find(u => u.Uuid === tododefines)
    })
    data.DepartmentID = this.state.selectedDepartment

    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.NameRequired[Profile.Language] })
    }
    if (!validator.isArray(data.Tododefines)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.TododefininesRequired[Profile.Language] })
    }
    if (!validator.isUUID(data.DepartmentID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.DepartmentRequired[Profile.Language] })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillTodogroupdefinenotification(error)
      })
    } else {
      AddTodogroupdefines({ data, history })
    }
  }


}