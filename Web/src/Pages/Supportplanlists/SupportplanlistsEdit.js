import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb } from 'semantic-ui-react'
import Literals from './Literals'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { FormInput, Contentwrapper, Footerwrapper, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
import SupportplansCreate from '../../Containers/Supportplans/SupportplansCreate'
import DepartmentsCreate from '../../Containers/Departments/DepartmentsCreate'
export default class SupportplanlistsEdit extends Component {

  PAGE_NAME = "SupportplanlistsEdit"

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false,
    }
  }

  componentDidMount() {
    const { SupportplanlistID, GetSupportplanlist, match, history, GetSupportplans, GetDepartments } = this.props
    let Id = SupportplanlistID || match?.params?.SupportplanlistID
    if (validator.isUUID(Id)) {
      GetSupportplanlist(Id)
      GetSupportplans()
      GetDepartments()
    } else {
      history.push("/GetSupportplanlists")
    }
  }

  componentDidUpdate() {
    const { Supportplanlists, Supportplans, Departments } = this.props
    const { selected_record, isLoading } = Supportplanlists
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0 && !Departments.isLoading > 0 && !Supportplans.isLoading && !isLoading && !this.state.isDatafetched) {
      this.setState({
        isDatafetched: true,
      })
      this.context.setForm(this.PAGE_NAME, { ...selected_record, Supportplans: selected_record.Supportplanuuids.map(u => { return u.PlanID }) })
    }
  }

  render() {

    const { Supportplanlists, Supportplans, Departments, Profile, history } = this.props

    const Supportplanoptions = (Supportplans.list || []).filter(u => u.Isactive).map(plan => {
      return { key: plan.Uuid, text: plan.Name, value: plan.Uuid }
    })
    const Departmentoptions = (Departments.list || []).filter(u => u.Isactive).map(department => {
      return { key: department.Uuid, text: department.Name, value: department.Uuid }
    })

    return (
      Supportplanlists.isLoading ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Supportplanlists"}>
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
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Supportplans[Profile.Language]} name="Supportplans" multiple options={Supportplanoptions} formtype='dropdown' modal={SupportplansCreate} />
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Department[Profile.Language]} name="DepartmentID" options={Departmentoptions} formtype='dropdown' modal={DepartmentsCreate} />
              </Form.Group>
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Supportplanlists"}
              buttonText={Literals.Button.Goback[Profile.Language]}
            />
            <Submitbutton
              isLoading={Supportplanlists.isLoading}
              buttonText={Literals.Button.Update[Profile.Language]}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()

    const { EditSupportplanlists, history, fillSupportplanlistnotification, Supportplanlists, Profile, Supportplans } = this.props
    const data = this.context.getForm(this.PAGE_NAME)
    data.Supportplans = data.Supportplans.map(id => {
      return (Supportplans.list || []).find(u => u.Uuid === id)
    })

    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.NameRequired[Profile.Language] })
    }
    if (!validator.isArray(data.Supportplans)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.SupportplansRequired[Profile.Language] })
    }
    if (!validator.isUUID(data.DepartmentID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.DepartmentRequired[Profile.Language] })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillSupportplanlistnotification(error)
      })
    } else {
      EditSupportplanlists({ data: { ...Supportplanlists.selected_record, ...data }, history })
    }
  }

}
SupportplanlistsEdit.contextType = FormContext
