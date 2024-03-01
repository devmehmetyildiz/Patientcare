import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb, Button } from 'semantic-ui-react'
import Literals from './Literals'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
import { CASHYPES } from '../../Utils/Constants'

export default class PatientcashmovementsEdit extends Component {

  PAGE_NAME = "PatientcashmovementsEdit"

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false
    }
  }

  componentDidMount() {
    const { GetPatients, GetPatientdefines, GetPatientcashmovement, GetPatientcashregisters, match, history, PatientcashmovementID } = this.props
    let Id = PatientcashmovementID || match?.params?.PatientcashmovementID
    if (validator.isUUID(Id)) {
      GetPatientcashmovement(Id)
      GetPatients()
      GetPatientdefines()
      GetPatientcashregisters()
    } else {
      history.push("/Patientcashmovements")
    }
  }

  componentDidUpdate() {
    const { Patientcashmovements, Patients, Patientdefines, Patientcashregisters } = this.props
    const { selected_record, isLoading } = Patientcashmovements
    const isLoadingstatus =
      isLoading &&
      Patients.isLoading &&
      Patientdefines.isLoading &&
      Patientcashregisters.isLoading
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0 && !isLoadingstatus && !this.state.isDatafetched) {
      this.setState({
        isDatafetched: true
      })
      this.context.setForm(this.PAGE_NAME, selected_record)
    }
  }

  render() {

    const { Patientcashmovements, Profile, history, closeModal, Patients, Patientdefines, Patientcashregisters, location } = this.props
    const { isLoading, isDispatching } = Patientcashmovements

    const Patientoptions = (Patients.list || []).filter(u => u.Isactive).map(patient => {
      const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient.PatientdefineID)
      return { key: patient.Uuid, text: `${patientdefine?.Firstname} ${patientdefine?.Lastname} - ${patientdefine?.CountryID}`, value: patient.Uuid }
    })

    const Patientcashregisteroptions = (Patientcashregisters.list || []).filter(u => u.Isactive).map(register => {
      return { key: register.Uuid, text: register.Name, value: register.Uuid }
    })

    const patientID = this.context.formstates[`${this.PAGE_NAME}/PatientID`]
    const search = new URLSearchParams(location.search)
    const patientIDparam = search.get('PatientID') ? search.get('PatientID') : ''
    const IshaveparamId = validator.isUUID(patientID) && validator.isUUID(patientIDparam)

    const patient = (Patients.list || []).find(u => u.Uuid === patientID)
    const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)

    const Movementoptions = [
      { key: CASHYPES[0]?.value, text: CASHYPES[0]?.Name, value: CASHYPES[0]?.value },
      { key: CASHYPES[1]?.value, text: CASHYPES[1]?.Name, value: CASHYPES[1]?.value },
      { key: CASHYPES[2]?.value, text: CASHYPES[2]?.Name, value: CASHYPES[2]?.value },
    ]

    return (
      isLoading || isDispatching ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Patientcashmovements"}>
                <Breadcrumb.Section >{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
              </Link>
              {IshaveparamId && <React.Fragment>
                <Breadcrumb.Divider icon='right chevron' />
                <Link to={"/Patients/" + patientID}>
                  <Breadcrumb.Section>{`${patientdefine?.Firstname} ${patientdefine?.Lastname}`}</Breadcrumb.Section>
                </Link>
              </React.Fragment>}
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{Literals.Page.Pageeditheader[Profile.Language]}</Breadcrumb.Section>
            </Headerbredcrump>
            {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <Form.Group widths={'equal'}>
                {!IshaveparamId && <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Patient[Profile.Language]} name="PatientID" options={Patientoptions} formtype='dropdown' />}
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Register[Profile.Language]} name="RegisterID" options={Patientcashregisteroptions} formtype='dropdown' />
              </Form.Group>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Movementtype[Profile.Language]} name="Movementtype" options={Movementoptions} formtype='dropdown' />
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Movementvalue[Profile.Language]} name="Movementvalue" type='number' step='0.01'/>
              </Form.Group>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Info[Profile.Language]} name="Info" />
              </Form.Group>
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Patientcashmovements"}
              buttonText={Literals.Button.Goback[Profile.Language]}
            />
            <Submitbutton
              isLoading={Patientcashmovements.isLoading}
              buttonText={Literals.Button.Update[Profile.Language]}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const { EditPatientcashmovements, history, fillPatientcashmovementnotification, Patientcashmovements, Profile, location } = this.props
    const data = this.context.getForm(this.PAGE_NAME)
    !validator.isNumber(data.Movementvalue) && (data.Movementvalue = 0)
    let errors = []
    if (!validator.isUUID(data.PatientID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Patientrequired[Profile.Language] })
    }
    if (!validator.isUUID(data.RegisterID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Registerrequired[Profile.Language] })
    }
    if (!validator.isNumber(data.Movementtype)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Typerequired[Profile.Language] })
    }
    if (!validator.isNumber(data.Movementvalue)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Valuerequired[Profile.Language] })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillPatientcashmovementnotification(error)
      })
    } else {

      const patientID = this.context.formstates[`${this.PAGE_NAME}/PatientID`]
      const search = new URLSearchParams(location.search)
      const patientIDparam = search.get('PatientID') ? search.get('PatientID') : ''
      const IshaveparamId = validator.isUUID(patientID) && validator.isUUID(patientIDparam)

      let body = {
        data: { ...Patientcashmovements.selected_record, ...data }, history
      }
      if (IshaveparamId) {
        body.redirectUrl = `/Patients/${patientID}`
      }

      EditPatientcashmovements(body)
    }

  }
}
PatientcashmovementsEdit.contextType = FormContext