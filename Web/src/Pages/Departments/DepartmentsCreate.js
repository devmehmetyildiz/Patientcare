import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Checkbox, Divider, Dropdown, Form } from 'semantic-ui-react'
import { Breadcrumb, Button, Header } from 'semantic-ui-react'
import formToObject from 'form-to-object'
import LoadingPage from '../../Utils/LoadingPage'
import Notification from '../../Utils/Notification'
import FormInput from '../../Utils/FormInput'
import Literals from './Literals'
import validator from "../../Utils/Validator"
import Pagewrapper from '../../Common/Wrappers/Pagewrapper'
import Headerwrapper from '../../Common/Wrappers/Headerwrapper'
import Headerbredcrump from '../../Common/Wrappers/Headerbredcrump'
import Contentwrapper from '../../Common/Wrappers/Contentwrapper'
import Pagedivider from '../../Common/Styled/Pagedivider'
import Footerwrapper from '../../Common/Wrappers/Footerwrapper'
export class DepartmentsCreate extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedstations: [],
      isHavepatient: false
    }
  }


  componentDidMount() {
    const { GetStations } = this.props
    GetStations()
  }

  componentDidUpdate() {
    const { Departments, Stations, removeDepartmentnotification, removeStationnotification } = this.props
    Notification(Departments.notifications, removeDepartmentnotification)
    Notification(Stations.notifications, removeStationnotification)
  }

  render() {
    const { Departments, Stations, Profile } = this.props

    const Stationoptions = Stations.list.map(station => {
      return { key: station.Uuid, text: station.Name, value: station.Uuid }
    })

    return (
      Departments.isLoading || Departments.isDispatching || Stations.isLoading || Stations.isDispatching ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Departments"}>
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
              <FormInput required placeholder={Literals.Columns.stationstxt[Profile.Language]} clearable search multiple options={Stationoptions} value={this.state.selectedstations} onChange={this.handleChange} formtype="dropdown" />
              <Form.Field>
                <Checkbox toggle className='m-2' checked={this.state.isHavepatient} onClick={() => { this.setState({ isHavepatient: !this.state.isHavepatient }) }} label={Literals.Columns.Ishavepatients[Profile.Language]} />
              </Form.Field>
              <Footerwrapper>
                <Link to="/Departments">
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

    const { AddDepartments, history, fillDepartmentnotification, Stations, Profile } = this.props
    const { list } = Stations
    const data = formToObject(e.target)
    data.Stations = this.state.selectedstations.map(station => {
      return list.find(u => u.Uuid === station)
    })
    data.Ishavepatients = this.state.isHavepatient

    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Namerequired[Profile.Language] })
    }
    if (!validator.isArray(data.Stations)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Stationsrequired[Profile.Language] })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillDepartmentnotification(error)
      })
    } else {
      AddDepartments({ data, history })
    }
  }

  handleChange = (e, { value }) => {
    this.setState({ selectedstations: value })
  }
}
export default DepartmentsCreate