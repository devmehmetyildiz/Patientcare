import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form } from 'semantic-ui-react'
import { Breadcrumb, Button } from 'semantic-ui-react'
import formToObject from 'form-to-object'
import Notification from '../../Utils/Notification'
import LoadingPage from '../../Utils/LoadingPage'
import Literals from './Literals'
import validator from "../../Utils/Validator"
import Pagewrapper from '../../Common/Wrappers/Pagewrapper'
import Headerwrapper from '../../Common/Wrappers/Headerwrapper'
import Headerbredcrump from '../../Common/Wrappers/Headerbredcrump'
import Contentwrapper from '../../Common/Wrappers/Contentwrapper'
import Pagedivider from '../../Common/Styled/Pagedivider'
import Footerwrapper from '../../Common/Wrappers/Footerwrapper'
import FormInput from '../../Utils/FormInput'
export default class PatientdefinesCreate extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedpatienttype: "",
      selectedcostumertype: "",
      selectedMotherstatus: 0,
      selectedFatherstatus: 0,
      selectedGenderstatus: "",
      selectedFatheralaffinity: "",
      selectedMotheralaffinity: "",
    }
  }


  componentDidMount() {
    const { GetCostumertypes, GetPatienttypes } = this.props
    GetCostumertypes()
    GetPatienttypes()
  }

  componentDidUpdate() {
    const { Patientdefines, Costumertypes, removeCostumertypenotification, removePatienttypenotification, Patienttypes, removePatientdefinenotification } = this.props
    Notification(Patientdefines.notifications, removePatientdefinenotification)
    Notification(Costumertypes.notifications, removeCostumertypenotification)
    Notification(Patienttypes.notifications, removePatienttypenotification)
  }


  render() {
    const { Costumertypes, Patienttypes, Patientdefines, Profile } = this.props

    const Costumertypeoptions = Costumertypes.list.map(costumertype => {
      return { key: costumertype.Uuid, text: costumertype.Name, value: costumertype.Uuid }
    })

    const Patienttypeoptions = Patienttypes.list.map(patienttype => {
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
              <Breadcrumb.Section>{Literals.Page.Pagecreateheader[Profile.Language]}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form onSubmit={this.handleSubmit}>
              <Form.Group widths='equal'>
                <FormInput required placeholder={Literals.Columns.Firstname[Profile.Language]} name="Firstname" />
                <FormInput required placeholder={Literals.Columns.Lastname[Profile.Language]} name="Lastname" />
                <FormInput placeholder={Literals.Columns.Fathername[Profile.Language]} name="Fathername" />
                <FormInput placeholder={Literals.Columns.Mothername[Profile.Language]} name="Mothername" />
              </Form.Group>
              <Form.Group widths='equal'>
                <FormInput placeholder={Literals.Columns.Motherbiologicalaffinity[Profile.Language]} options={Affinityoptions} value={this.state.selectedMotheralaffinity} onChange={(e, { value }) => { this.setState({ selectedMotheralaffinity: value }) }} formtype="dropdown" />
                <FormInput placeholder={Literals.Columns.Fatherbiologicalaffinity[Profile.Language]} options={Affinityoptions} value={this.state.selectedFatheralaffinity} onChange={(e, { value }) => { this.setState({ selectedFatheralaffinity: value }) }} formtype="dropdown" />
                <FormInput placeholder={Literals.Columns.Ismotheralive[Profile.Language]} options={Liveoptions} value={this.state.selectedMotherstatus} onChange={(e, { value }) => { this.setState({ selectedMotherstatus: value }) }} formtype="dropdown" />
                <FormInput placeholder={Literals.Columns.Isfatheralive[Profile.Language]} options={Liveoptions} value={this.state.selectedFatherstatus} onChange={(e, { value }) => { this.setState({ selectedFatherstatus: value }) }} formtype="dropdown" />
              </Form.Group>
              <Form.Group widths='equal'>
                <FormInput required placeholder={Literals.Columns.CountryID[Profile.Language]} name="CountryID" />
                <FormInput placeholder={Literals.Columns.Dateofbirth[Profile.Language]} name="Dateofbirth" type='date' />
                <FormInput placeholder={Literals.Columns.Placeofbirth[Profile.Language]} name="Placeofbirth" />
                <FormInput placeholder={Literals.Columns.Dateofdeath[Profile.Language]} name="Dateofdeath" type='date' />
              </Form.Group>
              <Form.Group widths='equal'>
                <FormInput placeholder={Literals.Columns.Placeofbirth[Profile.Language]} name="Placeofdeath" />
                <FormInput placeholder={Literals.Columns.Deathinfo[Profile.Language]} name="Deathinfo" />
                <FormInput placeholder={Literals.Columns.Gender[Profile.Language]} options={Genderoptions} value={this.state.selectedGenderstatus} onChange={(e, { value }) => { this.setState({ selectedGenderstatus: value }) }} formtype="dropdown" />
                <FormInput placeholder={Literals.Columns.Marialstatus[Profile.Language]} name="Marialstatus" />
              </Form.Group>
              <Form.Group widths='equal'>
                <FormInput placeholder={Literals.Columns.Childnumber[Profile.Language]} name="Childnumber" type='number' />
                <FormInput placeholder={Literals.Columns.Disabledchildnumber[Profile.Language]} name="Disabledchildnumber" type='number' />
                <FormInput placeholder={Literals.Columns.Siblingstatus[Profile.Language]} name="Siblingstatus" />
                <FormInput placeholder={Literals.Columns.Sgkstatus[Profile.Language]} name="Sgkstatus" />
              </Form.Group>
              <Form.Group widths='equal'>
                <FormInput placeholder={Literals.Columns.Budgetstatus[Profile.Language]} name="Budgetstatus" />
                <FormInput placeholder={Literals.Columns.City[Profile.Language]} name="City" />
                <FormInput placeholder={Literals.Columns.Town[Profile.Language]} name="Town" />
                <FormInput placeholder={Literals.Columns.Address1[Profile.Language]} name="Address1" />
              </Form.Group>
              <Form.Group widths='equal'>
                <FormInput placeholder={Literals.Columns.Address2[Profile.Language]} name="Address2" />
                <FormInput placeholder={Literals.Columns.Country[Profile.Language]} name="Country" />
                <FormInput placeholder={Literals.Columns.Contactnumber1[Profile.Language]} name="Contactnumber1" />
                <FormInput placeholder={Literals.Columns.Contactnumber2[Profile.Language]} name="Contactnumber2" />
              </Form.Group>
              <Form.Group widths='equal'>
                <FormInput placeholder={Literals.Columns.Contactname1[Profile.Language]} name="Contactname1" />
                <FormInput placeholder={Literals.Columns.Contactname2[Profile.Language]} name="Contactname2" />
                <FormInput required placeholder={Literals.Columns.CostumertypeName[Profile.Language]} options={Costumertypeoptions} value={this.state.selectedcostumertype} onChange={(e, { value }) => { this.setState({ selectedcostumertype: value }) }} formtype="dropdown" />
                <FormInput required placeholder={Literals.Columns.PatienttypeName[Profile.Language]} options={Patienttypeoptions} value={this.state.selectedpatienttype} onChange={(e, { value }) => { this.setState({ selectedpatienttype: value }) }} formtype="dropdown" />
              </Form.Group>
              <Footerwrapper>
                <Link to="/Patientdefines">
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
    const { AddPatientdefines, history, fillPatientdefinenotification, Profile } = this.props
    const data = formToObject(e.target)
    data.PatienttypeID = this.state.selectedpatienttype
    data.CostumertypeID = this.state.selectedcostumertype
    data.Ismotheralive = this.state.selectedMotherstatus
    data.Isfatheralive = this.state.selectedFatherstatus
    data.Gender = this.state.selectedGenderstatus
    data.Motherbiologicalaffinity = this.state.selectedMotheralaffinity
    data.Fatherbiologicalaffinity = this.state.selectedFatheralaffinity

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
      AddPatientdefines({ data, history })
    }
  }
}