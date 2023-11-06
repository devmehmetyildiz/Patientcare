import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Checkbox, Divider, Dropdown, Form, Icon, Modal } from 'semantic-ui-react'
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
import { FormContext } from '../../Provider/FormProvider'
import StationsCreate from '../../Containers/Stations/StationsCreate'
import AddModal from '../../Utils/AddModal'
import Gobackbutton from '../../Common/Gobackbutton'
import Submitbutton from '../../Common/Submitbutton'
export default class DepartmentsCreate extends Component {

  PAGE_NAME = "DepartmentsCreate"

  constructor(props) {
    super(props)
    this.state = {
      modelOpened: false
    }
  }

  componentDidMount() {
    const { GetStations } = this.props
    GetStations()
  }

  render() {
    const { Departments, Stations, Profile, history, closeModal } = this.props

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
              <Breadcrumb.Section>{Literals.Page.Pagecreateheader[Profile.Language]}</Breadcrumb.Section>
            </Headerbredcrump>
            {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Name[Profile.Language]} name="Name" />
              <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.stationstxt[Profile.Language]} name="Stations" multiple options={Stationoptions} formtype="dropdown" modal={StationsCreate} />
              <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Ishavepatients[Profile.Language]} name="Ishavepatients" formtype="checkbox" />
              <Footerwrapper>
                <Gobackbutton
                  history={history}
                  redirectUrl={"/Departments"}
                  buttonText={Literals.Button.Goback[Profile.Language]}
                />
                <Submitbutton
                  isLoading={Departments.isLoading}
                  buttonText={Literals.Button.Create[Profile.Language]}
                  submitFunction={this.handleSubmit}
                />
              </Footerwrapper>
            </Form>
          </Contentwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()

    const { AddDepartments, history, fillDepartmentnotification, Stations, Profile, closeModal } = this.props
    const data = this.context.getForm(this.PAGE_NAME)
    data.Stations = (data.Stations || []).map(id => {
      return (Stations.list || []).find(u => u.Uuid === id)
    }) || []

    let errors = []
    if (!validator.isArray(data.Stations)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Stationsrequired[Profile.Language] })
    }
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Namerequired[Profile.Language] })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillDepartmentnotification(error)
      })
    } else {
      AddDepartments({ data, history, closeModal })
    }
  }
}
DepartmentsCreate.contextType = FormContext