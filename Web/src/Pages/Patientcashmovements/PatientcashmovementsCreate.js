import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb, Button } from 'semantic-ui-react'
import Literals from './Literals'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
import { CASHYPES } from '../../Utils/Constants'

export default class PatientcashmovementsCreate extends Component {

  PAGE_NAME = "PatientcashmovementsCreate"

  componentDidMount() {
    const { GetPatients, GetPatientdefines, GetPatientcashregisters } = this.props
    GetPatients()
    GetPatientdefines()
    GetPatientcashregisters()
  }

  componentDidUpdate() {

    const { Patients, location } = this.props

    if (!validator.isUUID(this.context.formstates[`${this.PAGE_NAME}/PatientID`])) {
      const search = new URLSearchParams(location.search)
      const PatientID = search.get('PatientID') ? search.get('PatientID') : ''
      if (validator.isUUID(PatientID) && (Patients.list || []).find(u => u.Uuid === PatientID)) {
        this.context.setFormstates({
          ...this.context.formstates,
          [`${this.PAGE_NAME}/PatientID`]: PatientID ? PatientID : '',
        })
      }
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
              <Breadcrumb.Section>{Literals.Page.Pagecreateheader[Profile.Language]}</Breadcrumb.Section>
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
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Movementvalue[Profile.Language]} name="Movementvalue" type='number' />
              </Form.Group>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Report[Profile.Language]} name="ReportID" />
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Info[Profile.Language]} name="Info" />
              </Form.Group>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Includecompany[Profile.Language]} name="Includecompany" formtype='checkbox' />
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
              buttonText={Literals.Button.Create[Profile.Language]}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const { AddPatientcashmovements, history, fillPatientcashmovementnotification, Profile, closeModal, location } = this.props

    const data = this.context.getForm(this.PAGE_NAME)
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
    if (!validator.isString(data.ReportID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Reportnorequired[Profile.Language] })
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
        data, history, closeModal
      }
      if (IshaveparamId) {
        body.redirectUrl = `/Patients/${patientID}`
      }

      AddPatientcashmovements(body)
    }
  }
}
PatientcashmovementsCreate.contextType = FormContext
