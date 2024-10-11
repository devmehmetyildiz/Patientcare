import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb, Button } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { FormInput, Contentwrapper, Footerwrapper, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
import TododefinesCreate from '../../Containers/Tododefines/TododefinesCreate'
import DepartmentsCreate from '../../Containers/Departments/DepartmentsCreate'
export default class TodogroupdefinesCreate extends Component {

  PAGE_NAME = "TodogroupdefinesCreate"

  constructor(props) {
    super(props)
    this.state = {
      modelOpened: false
    }
  }

  componentDidMount() {
    const { GetTododefines, GetDepartments } = this.props
    GetTododefines()
    GetDepartments()
  }


  render() {
    const { Todogroupdefines, Departments, Tododefines, Profile, history, closeModal } = this.props

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
              <Breadcrumb.Section>{t('Pages.Todogroupdefines.Page.CreateHeader')}</Breadcrumb.Section>
            </Headerbredcrump>
            {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
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
              buttonText={t('Common.Button.Create')}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()

    const { AddTodogroupdefines, history, fillTodogroupdefinenotification, Tododefines, Profile, closeModal } = this.props
   
    const t = Profile?.i18n?.t
   
    const data = this.context.getForm(this.PAGE_NAME)
    data.Tododefines = data.Tododefines.map(id => {
      return (Tododefines.list || []).find(u => u.Uuid === id)
    })

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
      AddTodogroupdefines({ data, history, closeModal })
    }
  }
}
TodogroupdefinesCreate.contextType = FormContext