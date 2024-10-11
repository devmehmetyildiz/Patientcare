import React, { Component, useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Dimmer, DimmerDimmable, Dropdown, Form, Header, Icon, Image, Label, Loader, Table } from 'semantic-ui-react'
import validator from "../../Utils/Validator"
import { FormContext } from '../../Provider/FormProvider'
import {
  Contentwrapper, Footerwrapper, FormInput, Gobackbutton,
  Headerbredcrump, Headerwrapper, Pagedivider, Pagewrapper, Profilephoto, Submitbutton
} from '../../Components'
import { CAREPLANPARAMETER_TYPE_CURRENTSITUATIONRATİNG, CAREPLANPARAMETER_TYPE_HELPSTATU, CAREPLANPARAMETER_TYPE_PLANNEDSITUATIONRATİNG, CAREPLANPARAMETER_TYPE_PRESENTATIONMAKINGTYPE, CAREPLANPARAMETER_TYPE_PRESENTATIONPERIOD, CAREPLANPARAMETER_TYPE_PURPOSETARGET, CAREPLANPARAMETER_TYPE_PURPOSETARGETWORKS, CAREPLANPARAMETER_TYPE_RATING, SUPPORTPLAN_TYPE_CAREPLAN, SUPPORTPLAN_TYPE_PSYCHOSOCIAL, SUPPORTPLAN_TYPE_RATING } from '../../Utils/Constants'

export default function CareplansCreate(props) {
  const PAGE_NAME = 'CareplansCreate'
  const { GetSupportplans, GetSupportplanlists, GetCareplanparameters,
    GetPatients, GetPatientdefines, GetFiles, GetUsagetypes } = props

  const { Careplans, Supportplans, Supportplanlists, Files, Patients, Careplanparameters,
    Patientdefines, Usagetypes, Profile, history, closeModal, fillCareplannotification, AddCareplans } = props

  const [isDatafetched, setIsDatafetched] = useState(false)
  const [supportplans, setSupportplans] = useState([])
  const context = useContext(FormContext)
  const t = Profile?.i18n?.t

  const isloadingStatus =
    Supportplans.isLoading ||
    Supportplanlists.isLoading ||
    Patients.isLoading ||
    Files.isLoading ||
    Usagetypes.isLoading ||
    Patientdefines.isLoading;

  const Supportplantypeoptions = [
    { key: 1, text: t('Common.Supportplan.Types.Careplan'), value: SUPPORTPLAN_TYPE_CAREPLAN },
    { key: 2, text: t('Common.Supportplan.Types.Psychosocial'), value: SUPPORTPLAN_TYPE_PSYCHOSOCIAL },
    { key: 3, text: t('Common.Supportplan.Types.Rating'), value: SUPPORTPLAN_TYPE_RATING },
  ]

  const patientID = context.formstates[`${PAGE_NAME}/PatientID`]
  const typeID = context.formstates[`${PAGE_NAME}/Type`]

  const isValid = validator.isUUID(patientID) && validator.isNumber(typeID)

  const patient = (Patients.list || []).find(u => u.Uuid === patientID)
  const type = (Supportplantypeoptions || []).find(u => u.value === typeID)

  const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)

  const Patientoptions = (Patients.list || []).filter(u => u.Isactive).map(patient => {
    const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient.PatientdefineID)
    return { key: patient.Uuid, text: `${patientdefine?.Firstname} ${patientdefine?.Lastname} - ${patientdefine?.CountryID}`, value: patient.Uuid }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = context.getForm(PAGE_NAME)
    data.Careplanservices = supportplans

    let errors = []
    if (!validator.isISODate(data.Startdate)) {
      errors.push({ type: 'Error', code: t('Pages.Careplans.Page.Header'), description: t('Pages.Careplans.Messages.Startdaterequired') })
    }
    if (!validator.isISODate(data.Enddate)) {
      errors.push({ type: 'Error', code: t('Pages.Careplans.Page.Header'), description: t('Pages.Careplans.Messages.Enddaterequired') })
    }
    if (!validator.isISODate(data.Createdate)) {
      errors.push({ type: 'Error', code: t('Pages.Careplans.Page.Header'), description: t('Pages.Careplans.Messages.Createdaterequired') })
    }
    if (!validator.isUUID(data.PatientID)) {
      errors.push({ type: 'Error', code: t('Pages.Careplans.Page.Header'), description: t('Pages.Careplans.Messages.Patientrequired') })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillCareplannotification(error)
      })
    } else {
      AddCareplans({ data: data, history, closeModal })
    }
  }

  useEffect(() => {
    GetSupportplans()
    GetSupportplanlists()
    GetPatients()
    GetPatientdefines()
    GetFiles()
    GetUsagetypes()
    GetCareplanparameters()
  }, [])

  useEffect(() => {
    setIsDatafetched(false)
    setSupportplans([])
  }, [typeID, patientID])

  useEffect(() => {
    if (isValid && !isDatafetched) {
      const plans = ((Patients.list || []).find(u => u.Uuid === patientID)?.Supportplanuuids || []).map(u => {
        const supportplan = (Supportplans.list || []).find(plan => plan?.Uuid === u?.PlanID && plan.Type === typeID)
        if (supportplan) {
          return {
            SupportplanID: supportplan?.Uuid,
            Supportplanname: supportplan?.Name,
            Helpstatus: null,
            Presentationperiod: null,
            Presentationmakingtype: null,
            Rating: null,
            Currentsituationrati̇ng: null,
            Plannedsituationrati̇ng: null,
            Purposetarget: null,
            Purposetargetworks: null,
            key: Math.random()
          }

        } else {
          return null
        }
      }).filter(u => u)
      setSupportplans(plans)
      setIsDatafetched(true)
    }
  }, [typeID, patientID, isDatafetched])

  return (<DimmerDimmable>
    <Pagewrapper>
      <Dimmer active={isloadingStatus} inverted>
        <Loader>Yükleniyor</Loader>
      </Dimmer>
      <Headerwrapper>
        <Headerbredcrump>
          <Link to={"/Careplans"}>
            <Breadcrumb.Section>{t('Pages.Careplans.Page.Header')}</Breadcrumb.Section>
          </Link>
          <Breadcrumb.Divider icon='right chevron' />
          <Breadcrumb.Section>{t('Pages.Careplans.Page.CreateHeader')}</Breadcrumb.Section>
        </Headerbredcrump>
        {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
      </Headerwrapper>
      <Pagedivider />
      <Contentwrapper>
        <Form>
          <Form.Group widths='equal'>
            <FormInput page={PAGE_NAME} required placeholder={t('Pages.Careplans.Columns.Type')} name="Type" formtype='dropdown' options={Supportplantypeoptions} />
            <FormInput page={PAGE_NAME} required placeholder={t('Pages.Careplans.Columns.Patient')} name="PatientID" options={Patientoptions} formtype='dropdown' />
          </Form.Group>
          <Form.Group widths='equal'>
            <FormInput page={PAGE_NAME} required placeholder={t('Pages.Careplans.Columns.Startdate')} name="Startdate" type="date" />
            <FormInput page={PAGE_NAME} required placeholder={t('Pages.Careplans.Columns.Enddate')} name="Enddate" type="date" />
          </Form.Group>
          <Form.Group widths={'equal'}>
            <FormInput page={PAGE_NAME} required placeholder={t('Pages.Careplans.Columns.Createdate')} name="Createdate" type="date" />
          </Form.Group>
          <Form.Group widths={'equal'}>
            <FormInput page={PAGE_NAME} placeholder={t('Pages.Careplans.Columns.Info')} name="Info" />
          </Form.Group>
        </Form>
      </Contentwrapper>
      <CareplansCreatePatientcard
        isValid={isValid}
        Files={Files}
        patient={patient}
        patientdefine={patientdefine}
        Usagetypes={Usagetypes}
        fillnotification={fillCareplannotification}
        Profile={Profile}
      />
      <CareplansCreateSupportplans
        isValid={isValid}
        type={type}
        supportplans={supportplans}
        setSupportplans={setSupportplans}
        Careplanparameters={Careplanparameters}
        fillnotification={fillCareplannotification}
        Profile={Profile}
      />
      <Footerwrapper>
        <Gobackbutton
          history={history}
          redirectUrl={"/Careplans"}
          buttonText={t('Common.Button.Goback')}
        />
        <Submitbutton
          isLoading={Careplans.isLoading}
          buttonText={t('Common.Button.Create')}
          submitFunction={handleSubmit}
        />
      </Footerwrapper>
    </Pagewrapper>
  </DimmerDimmable>
  )
}



function CareplansCreatePatientcard(props) {

  const { isValid, Files, patient, patientdefine, Usagetypes, fillnotification, Profile } = props

  const usagetypePP = (Usagetypes.list || []).find(u => u.Value === 'PP')?.Uuid || null
  const file = (Files.list || []).find(u => u.ParentID === patient?.Uuid && (((u.Usagetype || '').split(',')) || []).includes(usagetypePP) && u.Isactive)

  return (isValid ?
    <React.Fragment>
      <Pagedivider />
      <Contentwrapper>
        <Header as='h2' icon textAlign='center'>
          {file
            ? <Profilephoto
              fileID={file?.Uuid}
              fillnotification={fillnotification}
              Profile={Profile}
            />
            : <Icon name='users' circular />}
          <Header.Content>{`${patientdefine?.Firstname} ${patientdefine?.Lastname} - ${patientdefine?.CountryID}`}</Header.Content>
        </Header>
      </Contentwrapper>
    </React.Fragment>
    : null)
}



function CareplansCreateSupportplans(props) {
  const { isValid, type, supportplans, setSupportplans, Careplanparameters, Profile } = props

  const t = Profile?.i18n?.t

  const isTypeCareplan = (type?.value === SUPPORTPLAN_TYPE_CAREPLAN)
  const isTypePsychosocial = (type?.value === SUPPORTPLAN_TYPE_PSYCHOSOCIAL)
  const isTypeRating = (type?.value === SUPPORTPLAN_TYPE_RATING)

  const Parameteroptions = (Careplanparameters.list || []).filter(u => u.Isactive).map(parameter => {
    return { key: parameter.Uuid, text: parameter.Name, value: parameter.Uuid, type: parameter.Type }
  })

  const changeHandler = (key, property, value) => {
    let supportPlans = supportplans
    const index = supportPlans.findIndex(plan => plan.key === key)
    supportPlans[index][property] = value
    setSupportplans([...supportPlans])
  }

  const renderCell = (props) => {
    const { value, name, placeholder, key, parametertype } = props
    return <Table.Cell>
      <Dropdown
        value={value || ''}
        placeholder={placeholder}
        name={name}
        clearable
        search
        fluid
        selection
        options={Parameteroptions.filter(u => u.type === parametertype)}
        onChange={(e, data) => { changeHandler(key, name, data.value) }}
      />
    </Table.Cell>
  }

  return (isValid ?
    <Contentwrapper>
      <Table celled className='overflow-x-auto' >
        <Table.Header>
          <Table.Row>
            {(isTypeCareplan || isTypePsychosocial || isTypeRating) ? <Table.HeaderCell width={6}>{t('Pages.Careplans.Columns.Suppportplan')}</Table.HeaderCell> : null}
            {(isTypeCareplan || isTypePsychosocial) ? <Table.HeaderCell width={2}>{t('Pages.Careplans.Columns.Helpstatus')}</Table.HeaderCell> : null}
            {(isTypeCareplan) ? <Table.HeaderCell width={2}>{t('Pages.Careplans.Columns.Presentationperiod')}</Table.HeaderCell> : null}
            {(isTypeCareplan) ? <Table.HeaderCell width={2}>{t('Pages.Careplans.Columns.Presentationmakingtype')}</Table.HeaderCell> : null}
            {(isTypePsychosocial) ? <Table.HeaderCell width={2}>{t('Pages.Careplans.Columns.Purposetarget')}</Table.HeaderCell> : null}
            {(isTypePsychosocial) ? <Table.HeaderCell width={2}>{t('Pages.Careplans.Columns.Purposetargetworks')}</Table.HeaderCell> : null}
            {(isTypeRating) ? <Table.HeaderCell width={2}>{t('Pages.Careplans.Columns.Currentsituationrati̇ng')}</Table.HeaderCell> : null}
            {(isTypeRating) ? <Table.HeaderCell width={2}>{t('Pages.Careplans.Columns.Plannedsituationrati̇ng')}</Table.HeaderCell> : null}
            {(isTypeCareplan || isTypePsychosocial) ? <Table.HeaderCell width={2}>{t('Pages.Careplans.Columns.Rating')}</Table.HeaderCell> : null}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {(supportplans || []).map((plan, index) => {
            return <Table.Row key={plan.key}>
              {(isTypeCareplan || isTypePsychosocial || isTypeRating) ? <Table.Cell>{plan.Supportplanname}</Table.Cell> : null}
              {(isTypeCareplan || isTypePsychosocial) ? renderCell({ parametertype: CAREPLANPARAMETER_TYPE_HELPSTATU, key: plan?.key, name: "Helpstatus", value: plan?.Helpstatus, placeholder: t('Pages.Careplans.Columns.Helpstatus'), }) : null}
              {(isTypeCareplan) ? renderCell({ parametertype: CAREPLANPARAMETER_TYPE_PRESENTATIONPERIOD, key: plan?.key, name: "Presentationperiod", value: plan?.Presentationperiod, placeholder: t('Pages.Careplans.Columns.Presentationperiod'), }) : null}
              {(isTypeCareplan) ? renderCell({ parametertype: CAREPLANPARAMETER_TYPE_PRESENTATIONMAKINGTYPE, key: plan?.key, name: "Presentationmakingtype", value: plan?.Presentationmakingtype, placeholder: t('Pages.Careplans.Columns.Presentationmakingtype'), }) : null}
              {(isTypePsychosocial) ? renderCell({ parametertype: CAREPLANPARAMETER_TYPE_PURPOSETARGET, key: plan?.key, name: "Purposetarget", value: plan?.Purposetarget, placeholder: t('Pages.Careplans.Columns.Purposetarget'), }) : null}
              {(isTypePsychosocial) ? renderCell({ parametertype: CAREPLANPARAMETER_TYPE_PURPOSETARGETWORKS, key: plan?.key, name: "Purposetargetworks", value: plan?.Purposetargetworks, placeholder: t('Pages.Careplans.Columns.Purposetargetworks'), }) : null}
              {(isTypeRating) ? renderCell({ parametertype: CAREPLANPARAMETER_TYPE_CURRENTSITUATIONRATİNG, key: plan?.key, name: "Currentsituationrati̇ng", value: plan?.Currentsituationrati̇ng, placeholder: t('Pages.Careplans.Columns.Currentsituationrati̇ng'), }) : null}
              {(isTypeRating) ? renderCell({ parametertype: CAREPLANPARAMETER_TYPE_PLANNEDSITUATIONRATİNG, key: plan?.key, name: "Plannedsituationrati̇ng", value: plan?.Plannedsituationrati̇ng, placeholder: t('Pages.Careplans.Columns.Plannedsituationrati̇ng'), }) : null}
              {(isTypeCareplan || isTypePsychosocial) ? renderCell({ parametertype: CAREPLANPARAMETER_TYPE_RATING, key: plan?.key, name: "Rating", value: plan?.Rating, placeholder: t('Pages.Careplans.Columns.Rating'), }) : null}
            </Table.Row>
          })}
        </Table.Body>
      </Table>
    </Contentwrapper>
    : null)
}
