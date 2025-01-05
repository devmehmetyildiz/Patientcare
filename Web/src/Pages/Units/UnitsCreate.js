import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb, Button } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { FormInput, Contentwrapper, Footerwrapper, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
import DepartmentsCreate from '../../Containers/Departments/DepartmentsCreate'
export default class UnitsCreate extends Component {

  PAGE_NAME = "UnitsCreate"

  constructor(props) {
    super(props)
    this.state = {
      modelOpened: false
    }
  }

  componentDidMount() {
    const { GetDepartments } = this.props
    GetDepartments()
  }


  render() {
    const { Units, Departments, Profile, history, closeModal } = this.props

    const t = Profile?.i18n?.t

    const Departmentoptions = (Departments.list || []).filter(u => u.Isactive).map(department => {
      return { key: department.Uuid, text: department.Name, value: department.Uuid }
    })

    const unitstatusOption = [
      {
        key: '0',
        text: 'Number',
        value: 0,
      },
      {
        key: '1',
        text: 'String',
        value: 1,
      }
    ]

    return (
      <Pagewrapper dimmer isLoading={Units.isLoading}>
        <Headerwrapper>
          <Headerbredcrump>
            <Link to={"/Units"}>
              <Breadcrumb.Section >{t('Pages.Units.Page.Header')}</Breadcrumb.Section>
            </Link>
            <Breadcrumb.Divider icon='right chevron' />
            <Breadcrumb.Section>{t('Pages.Units.Page.CreateHeader')}</Breadcrumb.Section>
          </Headerbredcrump>
          {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
        </Headerwrapper>
        <Pagedivider />
        <Contentwrapper>
          <Form>
            <Form.Group widths='equal'>
              <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Units.Column.Name')} name="Name" />
              <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Units.Column.Unittype')} name="Unittype" options={unitstatusOption} formtype='dropdown' />
            </Form.Group>
            <Form.Group widths='equal'>
              <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Units.Column.Department')} name="Departments" multiple options={Departmentoptions} formtype='dropdown' modal={DepartmentsCreate} />
            </Form.Group>
          </Form>
        </Contentwrapper>
        <Footerwrapper>
          <Gobackbutton
            history={history}
            redirectUrl={"/Units"}
            buttonText={t('Common.Button.Goback')}
          />
          <Submitbutton
            isLoading={Units.isLoading}
            buttonText={t('Common.Button.Create')}
            submitFunction={this.handleSubmit}
          />
        </Footerwrapper>
      </Pagewrapper >
    )
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { AddUnits, history, fillUnitnotification, Departments, Profile, closeModal } = this.props

    const t = Profile?.i18n?.t

    const data = this.context.getForm(this.PAGE_NAME)
    data.Departments = data.Departments.map(id => {
      return (Departments.list || []).find(u => u.Uuid === id)
    })

    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: t('Pages.Units.Page.Header'), description: t('Pages.Units.Messages.NameRequired') })
    }
    if (!validator.isNumber(data.Unittype)) {
      errors.push({ type: 'Error', code: t('Pages.Units.Page.Header'), description: t('Pages.Units.Messages.UnittypeRequired') })
    }
    if (!validator.isArray(data.Departments)) {
      errors.push({ type: 'Error', code: t('Pages.Units.Page.Header'), description: t('Pages.Units.Messages.DepartmentRequired') })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillUnitnotification(error)
      })
    } else {
      AddUnits({ data, history, closeModal })
    }
  }
}
UnitsCreate.contextType = FormContext