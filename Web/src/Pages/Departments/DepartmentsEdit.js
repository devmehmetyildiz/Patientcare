import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Checkbox, Divider, Dropdown, Form, Header, Icon, Modal } from 'semantic-ui-react'
import Notification from '../../Utils/Notification'
import formToObject from 'form-to-object'
import LoadingPage from '../../Utils/LoadingPage'
import FormInput from '../../Utils/FormInput'
import Literals from './Literals'
import validator from "../../Utils/Validator"
import { FormContext } from '../../Provider/FormProvider'
import Pagewrapper from '../../Common/Wrappers/Pagewrapper'
import Headerwrapper from '../../Common/Wrappers/Headerwrapper'
import Headerbredcrump from '../../Common/Wrappers/Headerbredcrump'
import Contentwrapper from '../../Common/Wrappers/Contentwrapper'
import Pagedivider from '../../Common/Styled/Pagedivider'
import Footerwrapper from '../../Common/Wrappers/Footerwrapper'
import StationsCreate from '../../Containers/Stations/StationsCreate'
import Gobackbutton from '../../Common/Gobackbutton'
import Submitbutton from '../../Common/Submitbutton'

export default class DepartmentsEdit extends Component {

  PAGE_NAME = "DepartmentsEdit"

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false,
      modelOpened: false
    }
  }

  componentDidMount() {
    const { GetDepartment, match, history, GetStations, DepartmentID } = this.props
    let Id = DepartmentID || match?.params?.DepartmentID
    if (validator.isUUID(Id)) {
      GetDepartment(Id)
      GetStations()
    } else {
      history.push("/Departments")
    }
  }

  componentDidUpdate() {
    const { Departments, Stations } = this.props
    const { selected_record, isLoading } = Departments
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0 && Stations.list.length > 0 && !Stations.isLoading && !isLoading && !this.state.isDatafetched) {
      this.setState({
        isDatafetched: true
      })
      this.context.setForm(this.PAGE_NAME, { ...selected_record, Stations: selected_record.Stationuuids.map(u => { return u.StationID }) })
    }
  }

  render() {

    const { Departments, Stations, Profile, history } = this.props

    const Stationoptions = (Stations.list || []).filter(u => u.Isactive).map(station => {
      return { key: station.Uuid, text: station.Name, value: station.Uuid }
    })

    return (
      Departments.isLoading || Departments.isDispatching ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Departments"}>
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
              <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.stationstxt[Profile.Language]} name="Stations" multiple options={Stationoptions} formtype="dropdown" modal={StationsCreate} />
              <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Ishavepatients[Profile.Language]} name="Ishavepatients" formtype="checkbox" />
              {this.context.formstates[`${this.PAGE_NAME}/Ishavepatients`] ?
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Isdefaultpatientdepartment[Profile.Language]} name="Isdefaultpatientdepartment" formtype="checkbox" /> : null}
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Departments"}
              buttonText={Literals.Button.Goback[Profile.Language]}
            />
            <Submitbutton
              isLoading={Departments.isLoading}
              buttonText={Literals.Button.Update[Profile.Language]}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()

    const { EditDepartments, history, fillDepartmentnotification, Stations, Departments, Profile } = this.props
    const data = this.context.getForm(this.PAGE_NAME)
    data.Isdefaultpatientdepartment = data.Ishavepatients ? true : false
    data.Stations = (data.Stations || []).map(id => {
      return (Stations.list || []).find(u => u.Uuid === id)
    }) || []

    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Namerequired[Profile.Language] })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillDepartmentnotification(error)
      })
    } else {
      EditDepartments({ data: { ...Departments.selected_record, ...data }, history })
    }
  }
}
DepartmentsEdit.contextType = FormContext