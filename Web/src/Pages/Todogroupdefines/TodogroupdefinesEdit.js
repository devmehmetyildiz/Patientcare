import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Form } from 'semantic-ui-react'
import LoadingPage from '../../Utils/LoadingPage'
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
import TododefinesCreate from '../../Containers/Tododefines/TododefinesCreate'
import DepartmentsCreate from '../../Containers/Departments/DepartmentsCreate'
import Submitbutton from '../../Common/Submitbutton'
import Gobackbutton from '../../Common/Gobackbutton'
export default class TodogroupdefinesEdit extends Component {

  PAGE_NAME = "TodogroupdefinesEdit"

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false,
      modelOpened: false
    }
  }

  componentDidMount() {
    const { TodogroupdefineID, GetTodogroupdefine, match, history, GetTododefines, GetDepartments } = this.props
    let Id = TodogroupdefineID || match?.params?.TodogroupdefineID
    if (validator.isUUID(Id)) {
      GetTodogroupdefine(Id)
      GetTododefines()
      GetDepartments()
    } else {
      history.push("/Todogroupdefines")
    }
  }

  componentDidUpdate() {
    const { Todogroupdefines, Tododefines, Departments } = this.props
    const { selected_record, isLoading } = Todogroupdefines
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0 && !Departments.isLoading > 0 && !Tododefines.isLoading && !isLoading && !this.state.isDatafetched) {
      this.setState({
        isDatafetched: true,
      })
      this.context.setForm(this.PAGE_NAME, { ...selected_record, Tododefines: selected_record.Tododefineuuids.map(u => { return u.TodoID }) })
    }
  }

  render() {

    const { Todogroupdefines, Tododefines, Departments, Profile, history } = this.props

    const Tododefineoptions = (Tododefines.list || []).filter(u => u.Isactive).map(tododefine => {
      return { key: tododefine.Uuid, text: tododefine.Name, value: tododefine.Uuid }
    })

    const Departmentoptions = (Departments.list || []).filter(u => u.Isactive).map(department => {
      return { key: department.Uuid, text: department.Name, value: department.Uuid }
    })

    return (
      Todogroupdefines.isLoading ? <LoadingPage /> :
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
            <Form>
              <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Name[Profile.Language]} name="Name" />
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Tododefines[Profile.Language]} name="Tododefines" multiple options={Tododefineoptions} formtype='dropdown' modal={TododefinesCreate} />
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Department[Profile.Language]} name="DepartmentID" options={Departmentoptions} formtype='dropdown' modal={DepartmentsCreate} />
              </Form.Group>
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Todogroupdefines"}
              buttonText={Literals.Button.Goback[Profile.Language]}
            />
            <Submitbutton
              isLoading={Todogroupdefines.isLoading}
              buttonText={Literals.Button.Update[Profile.Language]}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()

    const { EditTodogroupdefines, history, fillTodogroupdefinenotification, Todogroupdefines, Profile, Tododefines } = this.props
    const data = this.context.getForm(this.PAGE_NAME)
    data.Tododefines = data.Tododefines.map(id => {
      return (Tododefines.list || []).find(u => u.Uuid === id)
    }).filter(u => u)

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

}
TodogroupdefinesEdit.contextType = FormContext
