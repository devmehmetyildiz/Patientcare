import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Form } from 'semantic-ui-react'
import formToObject from 'form-to-object'
import LoadingPage from '../../Utils/LoadingPage'
import Notification from "../../Utils/Notification"
import Literals from './Literals'
import Pagewrapper from '../../Common/Wrappers/Pagewrapper'
import Headerwrapper from '../../Common/Wrappers/Headerwrapper'
import Headerbredcrump from '../../Common/Wrappers/Headerbredcrump'
import Footerwrapper from '../../Common/Wrappers/Footerwrapper'
import validator from '../../Utils/Validator'
import Pagedivider from '../../Common/Styled/Pagedivider'
import Contentwrapper from '../../Common/Wrappers/Contentwrapper'
import FormInput from '../../Utils/FormInput'
import { FormContext } from '../../Provider/FormProvider'
export default class TodogroupdefinesEdit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedTododefines: [],
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
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0 && Tododefines.list.length > 0 && !Tododefines.isLoading && !isLoading && !this.state.isDatafetched) {
      this.setState({
        selectedTododefines: selected_record.Tododefines.map(todos => {
          return todos.Uuid
        }), isDatafetched: true,
        selectedDepartment: selected_record.DepartmentID
      })
      this.context.setFormstates(selected_record)
    }
    Notification(Todogroupdefines.notifications, removeTodogroupdefinenotification)
    Notification(Tododefines.notifications, removeTododefinenotification)
    Notification(Departments.notifications, removeDepartmentnotification)
  }

  render() {

    const { Todogroupdefines, Tododefines, Departments, Profile } = this.props

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
              <Breadcrumb.Section>{Literals.Page.Pageeditheader[Profile.Language]}</Breadcrumb.Section>
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
                <Button floated="right" type='submit' color='blue'>{Literals.Button.Update[Profile.Language]}</Button>
              </Footerwrapper>
            </Form>
          </Contentwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()

    const { EditTodogroupdefines, history, fillTodogroupdefinenotification, Todogroupdefines, Profile, Tododefines } = this.props
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
      EditTodogroupdefines({ data: { ...Todogroupdefines.selected_record, ...data }, history })
    }
  }

  handleChange = (e, { value }) => {
    this.setState({ selectedtodos: value })
  }
}
TodogroupdefinesEdit.contextType = FormContext
