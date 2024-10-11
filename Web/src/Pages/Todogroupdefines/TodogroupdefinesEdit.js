import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { FormInput, Contentwrapper, Footerwrapper, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
import TododefinesCreate from '../../Containers/Tododefines/TododefinesCreate'
import DepartmentsCreate from '../../Containers/Departments/DepartmentsCreate'
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

    const t = Profile?.i18n?.t

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
                <Breadcrumb.Section >{t('Pages.Todogroupdefines.Page.Header')}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{t('Pages.Todogroupdefines.Page.EditHeader')}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Todogroupdefines.Column.Name')} name="Name" />
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Todogroupdefines.Column.Tododefines')} name="Tododefines" multiple options={Tododefineoptions} formtype='dropdown' modal={TododefinesCreate} />
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Todogroupdefines.Column.Department')} name="DepartmentID" options={Departmentoptions} formtype='dropdown' modal={DepartmentsCreate} />
              </Form.Group>
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Todogroupdefines"}
              buttonText={t('Common.Button.Goback')}
            />
            <Submitbutton
              isLoading={Todogroupdefines.isLoading}
              buttonText={t('Common.Button.Update')}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()

    const { EditTodogroupdefines, history, fillTodogroupdefinenotification, Todogroupdefines, Profile, Tododefines } = this.props
   
    const t = Profile?.i18n?.t
   
    const data = this.context.getForm(this.PAGE_NAME)
    data.Tododefines = data.Tododefines.map(id => {
      return (Tododefines.list || []).find(u => u.Uuid === id)
    }).filter(u => u)

    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: t('Pages.Todogroupdefines.Page.Header'), description: t('Pages.Todogroupdefines.Messages.NameRNameRequiredequired') })
    }
    if (!validator.isArray(data.Tododefines)) {
      errors.push({ type: 'Error', code: t('Pages.Todogroupdefines.Page.Header'), description: t('Pages.Todogroupdefines.Messages.TododefinesRequired') })
    }
    if (!validator.isUUID(data.DepartmentID)) {
      errors.push({ type: 'Error', code: t('Pages.Todogroupdefines.Page.Header'), description: t('Pages.Todogroupdefines.Messages.DepartmentRequired') })
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
