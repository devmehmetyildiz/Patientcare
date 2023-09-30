import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, } from 'semantic-ui-react'
import { Breadcrumb, Button } from 'semantic-ui-react'
import formToObject from 'form-to-object'
import Notification from '../../Utils/Notification'
import LoadingPage from '../../Utils/LoadingPage'
import validator from "../../Utils/Validator"
import Literals from './Literals'
import Pagewrapper from '../../Common/Wrappers/Pagewrapper'
import Headerwrapper from '../../Common/Wrappers/Headerwrapper'
import Headerbredcrump from '../../Common/Wrappers/Headerbredcrump'
import Contentwrapper from '../../Common/Wrappers/Contentwrapper'
import Pagedivider from '../../Common/Styled/Pagedivider'
import Footerwrapper from '../../Common/Wrappers/Footerwrapper'
import FormInput from '../../Utils/FormInput'
import { FormContext } from '../../Provider/FormProvider'
export default class PatientdefinesEdit extends Component {

  PAGE_NAME = "PatientdefinesEdit"

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false
    }
  }

  componentDidMount() {
    const { GetPatientdefine, match, history, GetCostumertypes, GetPatienttypes, PatientdefineID } = this.props
    let Id = PatientdefineID || match?.params?.PatientdefineID
    if (validator.isUUID(Id)) {
      GetPatientdefine(Id)
      GetCostumertypes()
      GetPatienttypes()
    } else {
      history.push("/Patientdefines")
    }
  }

  componentDidUpdate() {
    const { Patientdefines, Costumertypes, removeCostumertypenotification, removePatienttypenotification, Patienttypes, removePatientdefinenotification } = this.props
    const { selected_record, isLoading } = Patientdefines
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0 && Costumertypes.list.length > 0 && !Costumertypes.isLoading && Patienttypes.list.length > 0 && !Patienttypes.isLoading && !isLoading && !this.state.isDatafetched) {
      this.setState({
        isDatafetched: true
      })
      this.context.setForm(this.PAGE_NAME, selected_record)
    }
    Notification(Patientdefines.notifications, removePatientdefinenotification)
    Notification(Costumertypes.notifications, removeCostumertypenotification)
    Notification(Patienttypes.notifications, removePatienttypenotification)
  }

  render() {
    const { Costumertypes, Patienttypes, Patientdefines, Profile, history } = this.props

    const Costumertypeoptions = (Costumertypes.list || []).filter(u => u.Isactive).map(costumertype => {
      return { key: costumertype.Uuid, text: costumertype.Name, value: costumertype.Uuid }
    })

    const Patienttypeoptions = (Patienttypes.list || []).filter(u => u.Isactive).map(patienttype => {
      return { key: patienttype.Uuid, text: patienttype.Name, value: patienttype.Uuid }
    })

    const Liveoptions = [
      { key: 0, text: Literals.Options.Liveoptions.value0[Profile.Language], value: false },
      { key: 1, text: Literals.Options.Liveoptions.value1[Profile.Language], value: true }
    ]
    const Genderoptions = [
      { key: 0, text: Literals.Options.Genderoptions.value0[Profile.Language], value: "0" },
      { key: 1, text: Literals.Options.Genderoptions.value1[Profile.Language], value: "1" }
    ]
    const Affinityoptions = [
      { key: 0, text: Literals.Options.Affinityoptions.value0[Profile.Language], value: "0" },
      { key: 1, text: Literals.Options.Affinityoptions.value1[Profile.Language], value: "1" }
    ]

    return (
      Patientdefines.isLoading || Patientdefines.isDispatching || Patienttypes.isLoading
        || Patienttypes.isDispatching || Costumertypes.isLoading || Costumertypes.isDispatching ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Patientdefines"}>
                <Breadcrumb.Section >{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{Literals.Page.Pageeditheader[Profile.Language]}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form onSubmit={this.handleSubmit}>
              <Form.Group widths='equal'>
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Firstname[Profile.Language]} name="Firstname" />
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Lastname[Profile.Language]} name="Lastname" />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Fathername[Profile.Language]} name="Fathername" />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Mothername[Profile.Language]} name="Mothername" />
              </Form.Group>
              <Form.Group widths='equal'>
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Motherbiologicalaffinity[Profile.Language]} name="Motherbiologicalaffinity" options={Affinityoptions} formtype="dropdown" />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Fatherbiologicalaffinity[Profile.Language]} name="Fatherbiologicalaffinity" options={Affinityoptions} formtype="dropdown" />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Ismotheralive[Profile.Language]} name="Ismotheralive" options={Liveoptions} formtype="dropdown" />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Isfatheralive[Profile.Language]} name="Isfatheralive" options={Liveoptions} formtype="dropdown" />
              </Form.Group>
              <Form.Group widths='equal'>
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.CountryID[Profile.Language]} name="CountryID" />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Dateofbirth[Profile.Language]} name="Dateofbirth" type='date' />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Placeofbirth[Profile.Language]} name="Placeofbirth" />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Dateofdeath[Profile.Language]} name="Dateofdeath" type='date' />
              </Form.Group>
              <Form.Group widths='equal'>
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Placeofbirth[Profile.Language]} name="Placeofdeath" />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Deathinfo[Profile.Language]} name="Deathinfo" />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Gender[Profile.Language]} name="Gender" options={Genderoptions} formtype="dropdown" />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Marialstatus[Profile.Language]} name="Marialstatus" />
              </Form.Group>
              <Form.Group widths='equal'>
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Childnumber[Profile.Language]} name="Childnumber" type='number' />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Disabledchildnumber[Profile.Language]} name="Disabledchildnumber" type='number' />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Siblingstatus[Profile.Language]} name="Siblingstatus" />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Sgkstatus[Profile.Language]} name="Sgkstatus" />
              </Form.Group>
              <Form.Group widths='equal'>
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Budgetstatus[Profile.Language]} name="Budgetstatus" />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.City[Profile.Language]} name="City" />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Town[Profile.Language]} name="Town" />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Address1[Profile.Language]} name="Address1" />
              </Form.Group>
              <Form.Group widths='equal'>
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Address2[Profile.Language]} name="Address2" />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Country[Profile.Language]} name="Country" />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Contactnumber1[Profile.Language]} name="Contactnumber1" />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Contactnumber2[Profile.Language]} name="Contactnumber2" />
              </Form.Group>
              <Form.Group widths='equal'>
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Contactname1[Profile.Language]} name="Contactname1" />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Contactname2[Profile.Language]} name="Contactname2" />
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.CostumertypeName[Profile.Language]} name="CostumertypeID" options={Costumertypeoptions} formtype="dropdown" />
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.PatienttypeName[Profile.Language]} name="PatienttypeID" options={Patienttypeoptions} formtype="dropdown" />
              </Form.Group>
              <Footerwrapper>
                {history && <Link to="/Patientdefines">
                  <Button floated="left" color='grey'>{Literals.Button.Goback[Profile.Language]}</Button>
                </Link>}
                <Button floated="right" type='submit' color='blue'>{Literals.Button.Update[Profile.Language]}</Button>
              </Footerwrapper>
            </Form>
          </Contentwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()
    const { EditPatientdefines, history, fillPatientdefinenotification, Patientdefines, Profile } = this.props
    const data = formToObject(e.target)
    data.PatienttypeID = this.context.formstates[`${this.PAGE_NAME}/PatienttypeID`]
    data.CostumertypeID = this.context.formstates[`${this.PAGE_NAME}/CostumertypeID`]
    data.Ismotheralive = this.context.formstates[`${this.PAGE_NAME}/Ismotheralive`]
    data.Isfatheralive = this.context.formstates[`${this.PAGE_NAME}/Isfatheralive`]
    data.Gender = this.context.formstates[`${this.PAGE_NAME}/Gender`]
    data.Motherbiologicalaffinity = this.context.formstates[`${this.PAGE_NAME}/Motherbiologicalaffinity`]
    data.Fatherbiologicalaffinity = this.context.formstates[`${this.PAGE_NAME}/selectedFatheralaffinity`]

    if (!data.Dateofbirth || data.Dateofbirth === '') {
      data.Dateofbirth = null
    }
    if (!data.Dateofdeath || data.Dateofdeath === '') {
      data.Dateofdeath = null
    }
    if (!data.Childnumber || data.Childnumber === '') {
      data.Childnumber = 0
    }
    if (!data.Disabledchildnumber || data.Disabledchildnumber === '') {
      data.Disabledchildnumber = 0
    }
    data.Childnumber && (data.Childnumber = parseInt(data.Childnumber))
    data.Disabledchildnumber && (data.Disabledchildnumber = parseInt(data.Disabledchildnumber))
    data.Childnumber && (data.Childnumber = parseInt(data.Childnumber))
    let errors = []
    if (!validator.isString(data.Firstname)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Firstnamerequired[Profile.Language] })
    }
    if (!validator.isString(data.Lastname)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Lastnamerequired[Profile.Language] })
    }
    if (!validator.isUUID(data.CostumertypeID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Costumertyperequired[Profile.Language] })
    }
    if (!validator.isUUID(data.PatienttypeID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Patienttyperequired[Profile.Language] })
    }
    if (!validator.isString(data.CountryID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.CountryIDrequired[Profile.Language] })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillPatientdefinenotification(error)
      })
    } else {
      EditPatientdefines({ data: { ...Patientdefines.selected_record, ...data }, history })
    }
  }
}
PatientdefinesEdit.contextType = FormContext