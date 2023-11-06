import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Divider, Dropdown, Form, Label } from 'semantic-ui-react'
import { Breadcrumb, Button, Header } from 'semantic-ui-react'
import formToObject from 'form-to-object'
import Notification from '../../Utils/Notification'
import LoadingPage from '../../Utils/LoadingPage'
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
import Gobackbutton from '../../Common/Gobackbutton'
import Submitbutton from '../../Common/Submitbutton'

export default class PatientmedicinesEdit extends Component {

  PAGE_NAME = 'PatientmedicinesEdit'

  constructor(props) {
    super(props)
    this.state = {
      isInprepatients: false,
      isDatafetched: false
    }
  }

  componentDidMount() {
    const { GetPatientstock, match, history, GetDepartments, GetStockdefines, PatientstockID, GetPatientdefines, GetPatients } = this.props
    const ID = match?.params?.PatientstockID || PatientstockID
    if (validator.isUUID(ID)) {
      GetPatientstock(ID)
      GetDepartments()
      GetStockdefines()
      GetPatientdefines()
      GetPatients()
    } else {
      history.push("/Patientmedicines")
    }
  }

  componentDidUpdate() {
    const { Departments, Stockdefines, Patientstocks, Patients, Patientdefines } = this.props
    const { selected_record, isLoading } = Patientstocks

    const isLoadingstatus =
      Stockdefines.isLoading ||
      Patientstocks.isLoading ||
      Departments.isLoading ||
      Patients.isLoading ||
      Patientdefines.isLoading

    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0 &&
      !isLoadingstatus && !isLoading && !this.state.isDatafetched) {
      const patient = (Patients.list || []).find(u => u.Uuid === selected_record?.PatientID)
      this.setState({
        isDatafetched: true,
        isInprepatients: patient?.iswaitingactivation
      })
      const currentDate = new Date(selected_record?.Skt || '');
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      this.context.setForm(this.PAGE_NAME, { ...selected_record, [`Skt`]: formattedDate })
    }
  }


  render() {
    const { Patientstocks, Patients, Departments, Stockdefines, Profile, Patientdefines, history } = this.props

    const { selected_record } = Patientstocks

    const Departmentoptions = Departments.list.map(department => {
      return { key: department.Uuid, text: department.Name, value: department.Uuid }
    })

    const Stockdefineoptions = (Stockdefines.list || []).filter(u => u.Ismedicine && !u.Issupply).map(define => {
      return { key: define.Uuid, text: define.Name, value: define.Uuid }
    })

    const patient = (Patients.list || []).find(u => u.Uuid === selected_record?.PatientID)
    const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)

    const isLoadingstatus =
      Stockdefines.isLoading ||
      Patientstocks.isLoading ||
      Departments.isLoading ||
      Patients.isLoading ||
      Patientdefines.isLoading

    return (
      isLoadingstatus ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Patientmedicines"}>
                <Breadcrumb.Section >{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{Literals.Page.Pageeditheader[Profile.Language]}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Label>{`${patientdefine?.Firstname} ${patientdefine?.Lastname} - ${patientdefine?.CountryID}`}</Label>
            <Form>
              <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Stockdefine[Profile.Language]} name="StockdefineID" options={Stockdefineoptions} formtype="dropdown" />
              <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Barcodeno[Profile.Language]} name="Barcodeno" />
              <Form.Group widths='equal'>
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Skt[Profile.Language]} name="Skt" type='date' />
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Department[Profile.Language]} name="DepartmentID" options={Departmentoptions} formtype="dropdown" />
              </Form.Group>
              <Footerwrapper>
                <Gobackbutton
                  history={history}
                  redirectUrl={"/Patientmedicines"}
                  buttonText={Literals.Button.Goback[Profile.Language]}
                />
                <Submitbutton
                  isLoading={Patientstocks.isLoading}
                  buttonText={Literals.Button.Update[Profile.Language]}
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
    const { EditPatientstocks, history, fillPatientstocknotification, Patientstocks, Profile } = this.props
    const data = formToObject(e.target)
    data.DepartmentID = this.context.formstates[`${this.PAGE_NAME}/DepartmentID`]
    data.StockdefineID = this.context.formstates[`${this.PAGE_NAME}/StockdefineID`]
    data.PatientID = this.context.formstates[`${this.PAGE_NAME}/PatientID`]
    let errors = []
    if (!validator.isUUID(data.DepartmentID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.DepartmentRequired[Profile.Language] })
    }
    if (!validator.isUUID(data.PatientID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.PatientRequired[Profile.Language] })
    }
    if (!validator.isUUID(data.StockdefineID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.StokdefineRequired[Profile.Language] })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillPatientstocknotification(error)
      })
    } else {
      EditPatientstocks({ data: { ...Patientstocks.selected_record, ...data }, history })
    }
  }


  getLocalDate = (inputdate) => {
    if (inputdate) {
      let res = inputdate.split('T')
      return res[0]
    }
  }
}
PatientmedicinesEdit.contextType = FormContext