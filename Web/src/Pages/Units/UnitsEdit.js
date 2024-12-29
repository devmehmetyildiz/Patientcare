import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { FormInput, Contentwrapper, Footerwrapper, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
import DepartmentsCreate from '../../Containers/Departments/DepartmentsCreate'

export default class UnitsEdit extends Component {

  PAGE_NAME = "UnitsEdit"

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false,
      modelOpened: false
    }
  }

  componentDidMount() {
    const { GetUnit, match, history, GetDepartments, UnitID } = this.props
    let Id = UnitID || match?.params?.UnitID
    if (validator.isUUID(Id)) {
      GetUnit(Id)
      GetDepartments()
    } else {
      history.push("/Units")
    }
  }

  componentDidUpdate() {
    const { Departments, Units } = this.props
    const { selected_record, isLoading } = Units
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0 && Departments.list.length > 0 && !Departments.isLoading && !isLoading && !this.state.isDatafetched) {
      this.setState({
        isDatafetched: true
      })
      this.context.setForm(this.PAGE_NAME, { ...selected_record, Departments: selected_record.Departmentuuids.map(u => { return u.DepartmentID }) })
    }
  }

  render() {

    const { Units, Departments, Profile, history } = this.props

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
      Units.isLoading ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Units"}>
                <Breadcrumb.Section >{t('Pages.Units.Page.Header')}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{t('Pages.Units.Page.EditHeader')}</Breadcrumb.Section>
            </Headerbredcrump>
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
              buttonText={t('Common.Button.Update')}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()

    const { EditUnits, history, fillUnitnotification, Departments, Units, Profile } = this.props

    const t = Profile?.i18n?.t

    const data = this.context.getForm(this.PAGE_NAME)
    data.Departments = data.Departments.map(id => {
      return (Departments.list || []).filter(u => u.Isactive).find(u => u.Uuid === id)
    }).filter(u => u)

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
      EditUnits({ data: { ...Units.selected_record, ...data }, history })
    }
  }
}
UnitsEdit.contextType = FormContext
