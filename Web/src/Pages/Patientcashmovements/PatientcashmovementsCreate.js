import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb, Button } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
import { CASH_TYPE_INCOME, CASH_TYPE_OUTCOME } from '../../Utils/Constants'

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

    const t = Profile?.i18n?.t

    const { isLoading } = Patientcashmovements

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

    const CASH_OPTION = [
      { key: 1, text: t('Option.Cashtypes.Outcome'), value: CASH_TYPE_OUTCOME },
      { key: 2, text: t('Option.Cashtypes.Income'), value: CASH_TYPE_INCOME }
    ]

    return (
      isLoading ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Patientcashmovements"}>
                <Breadcrumb.Section >{t('Pages.Patientcashmovements.Page.Header')}</Breadcrumb.Section>
              </Link>
              {IshaveparamId && <React.Fragment>
                <Breadcrumb.Divider icon='right chevron' />
                <Link to={"/Patients/" + patientID}>
                  <Breadcrumb.Section>{`${patientdefine?.Firstname} ${patientdefine?.Lastname}`}</Breadcrumb.Section>
                </Link>
              </React.Fragment>}
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{t('Pages.Patientcashmovements.Page.CreateHeader')}</Breadcrumb.Section>
            </Headerbredcrump>
            {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <Form.Group widths={'equal'}>
                {!IshaveparamId && <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Patientcashmovements.Column.Patient')} name="PatientID" options={Patientoptions} formtype='dropdown' />}
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Patientcashmovements.Column.Register')} name="RegisterID" options={Patientcashregisteroptions} formtype='dropdown' />
              </Form.Group>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Patientcashmovements.Column.Movementtype')} name="Movementtype" options={CASH_OPTION} formtype='dropdown' />
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Patientcashmovements.Column.Movementvalue')} name="Movementvalue" type='number' min={0} max={999999} step='0.01' />
              </Form.Group>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} placeholder={t('Pages.Patientcashmovements.Column.Info')} name="Info" />
              </Form.Group>
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Patientcashmovements"}
              buttonText={t('Common.Button.Goback')}
            />
            <Submitbutton
              isLoading={Patientcashmovements.isLoading}
              buttonText={t('Common.Button.Create')}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const { AddPatientcashmovements, history, fillPatientcashmovementnotification, Profile, closeModal, location } = this.props

    const t = Profile?.i18n?.t

    const data = this.context.getForm(this.PAGE_NAME)
    !validator.isNumber(data.Movementvalue) && (data.Movementvalue = 0)
    let errors = []
    if (!validator.isUUID(data.PatientID)) {
      errors.push({ type: 'Error', code: t('Pages.Patientcashmovements.Page.Header'), description: t('Pages.Patientcashmovements.Messages.PatientRequired') })
    }
    if (!validator.isUUID(data.RegisterID)) {
      errors.push({ type: 'Error', code: t('Pages.Patientcashmovements.Page.Header'), description: t('Pages.Patientcashmovements.Messages.RegisterRequired') })
    }
    if (!validator.isNumber(data.Movementtype)) {
      errors.push({ type: 'Error', code: t('Pages.Patientcashmovements.Page.Header'), description: t('Pages.Patientcashmovements.Messages.TypeRequired') })
    }
    if (!validator.isNumber(data.Movementvalue)) {
      errors.push({ type: 'Error', code: t('Pages.Patientcashmovements.Page.Header'), description: t('Pages.Patientcashmovements.Messages.ValueRequired') })
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
