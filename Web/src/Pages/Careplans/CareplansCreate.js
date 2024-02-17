import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Card, Dropdown, Form, Icon, Image, Label, Table } from 'semantic-ui-react'
import Literals from './Literals'
import validator from "../../Utils/Validator"
import { FormContext } from '../../Provider/FormProvider'
import { ROUTES } from '../../Utils/Constants'
import {
  Contentwrapper, Footerwrapper, FormInput, Gobackbutton,
  Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton
} from '../../Components'
import config from '../../Config'
import Formatdate from '../../Utils/Formatdate'
export default class CareplansCreate extends Component {

  PAGE_NAME = 'CareplansCreate'

  constructor(props) {
    super(props)
    this.state = {
      PatientID: '',
      Supportplans: [],
      isDatafetched: false
    }
  }

  componentDidMount() {
    const { GetSupportplans, GetSupportplanlists, GetHelpstatus, GetMakingtypes, GetRatings, GetRequiredperiods,
      GetPatients, GetPatientdefines, GetFiles, GetUsagetypes } = this.props
    GetSupportplans()
    GetSupportplanlists()
    GetPatients()
    GetPatientdefines()
    GetFiles()
    GetUsagetypes()
    GetHelpstatus()
    GetMakingtypes()
    GetRatings()
    GetRequiredperiods()

  }

  componentDidUpdate() {
    const { Supportplans, Supportplanlists, Files, Usagetypes, Helpstatus, Makingtypes, Ratings, Requiredperiods, Patientdefines, Patients } = this.props
    const selectedPatient = this.context.formstates[`${this.PAGE_NAME}/PatientID`]

    const isloadingStatus =
      Supportplans.isLoading ||
      Supportplanlists.isLoading ||
      Patients.isLoading ||
      Files.isLoading ||
      Usagetypes.isLoading ||
      Helpstatus.isLoading ||
      Makingtypes.isLoading ||
      Ratings.isLoading ||
      Requiredperiods.isLoading ||
      Patientdefines.isLoading;

    if (!isloadingStatus && !this.state.isDatafetched) {
      this.context.setForm(this.PAGE_NAME, { ... this.context.formstates, [`Createdate`]: Formatdate(), [`Startdate`]: Formatdate() })
      this.setState({ isDatafetched: true })
    }

    if (this.state.PatientID !== selectedPatient) {
      const plans = ((Patients.list || []).find(u => u.Uuid === selectedPatient)?.Supportplanuuids || []).map(u => {
        const supportplan = (Supportplans.list || []).find(plan => plan?.Uuid === u?.PlanID)
        return {
          SupportplanID: supportplan?.Uuid,
          Supportplanname: supportplan?.Name,
          Helpstatus: '',
          Requiredperiod: '',
          Makingtype: '',
          Rating: '',
          key: Math.random()
        }
      })
      this.setState({ PatientID: selectedPatient, Supportplans: plans })
    }
  }
  render() {
    const {
      Careplans, Supportplans, Supportplanlists, Files, Patients, Helpstatus, Makingtypes, Ratings, Requiredperiods,
      Patientdefines, Usagetypes, Profile, history, closeModal } = this.props
    const Patientoptions = (Patients.list || []).filter(u => u.Isactive).map(patient => {
      const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient.PatientdefineID)
      return { key: patient.Uuid, text: `${patientdefine?.Firstname} ${patientdefine?.Lastname} - ${patientdefine?.CountryID}`, value: patient.Uuid }
    })

    const isloadingStatus =
      Supportplans.isLoading ||
      Supportplanlists.isLoading ||
      Patients.isLoading ||
      Files.isLoading ||
      Usagetypes.isLoading ||
      Helpstatus.isLoading ||
      Makingtypes.isLoading ||
      Ratings.isLoading ||
      Requiredperiods.isLoading ||
      Patientdefines.isLoading;

    const selectedPatient = this.context.formstates[`${this.PAGE_NAME}/PatientID`]
    const selectedPatientmodel = (Patients.list || []).find(u => u.Uuid === selectedPatient)
    const isPatientselected = validator.isUUID(selectedPatient)
    const patientDefine = (Patientdefines.list || []).find(u => u.Uuid === selectedPatientmodel?.PatientdefineID)
    let usagetypePP = (Usagetypes.list || []).find(u => u.Value === 'PP')?.Uuid || null
    const patientPP = (Files.list || []).find(u => u.ParentID === selectedPatient && (((u.Usagetype || '').split(',')) || []).includes(usagetypePP) && u.Isactive)

    const Helpstatusoption = (Helpstatus.list || []).filter(u => u.Isactive).map(helpstatu => {
      return { key: helpstatu.Uuid, text: helpstatu.Name, value: helpstatu.Uuid }
    })

    const Requiredperiodoption = (Requiredperiods.list || []).filter(u => u.Isactive).map(period => {
      return { key: period.Uuid, text: period.Name, value: period.Uuid }
    })

    const Makingtypeoptions = (Makingtypes.list || []).filter(u => u.Isactive).map(makingtype => {
      return { key: makingtype.Uuid, text: makingtype.Name, value: makingtype.Uuid }
    })

    const Ratingoptions = (Ratings.list || []).filter(u => u.Isactive).map(rating => {
      return { key: rating.Uuid, text: rating.Name, value: rating.Uuid }
    })

    return (
      isloadingStatus ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Careplans"}>
                <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{Literals.Page.Pagecreateheader[Profile.Language]}</Breadcrumb.Section>
            </Headerbredcrump>
            {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <Form.Group widths='equal'>
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Startdate[Profile.Language]} name="Startdate" type="date" />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Enddate[Profile.Language]} name="Enddate" type="date" />
              </Form.Group>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Createdate[Profile.Language]} name="Createdate" type="date" />
              </Form.Group>
              <Form.Group widths='equal'>
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.PatientID[Profile.Language]} name="PatientID" options={Patientoptions} formtype='dropdown' />
              </Form.Group>
              {isPatientselected && <React.Fragment>
                <Pagedivider />
                <Card fluid>
                  <div className='p-4 flex flex-col-reverse justify-center md:flex-row md:justify-between items-start'>
                    <div>
                      <div className='my-2'>
                        <Label
                          image
                          color='blue'
                          size='medium'
                        >
                          {`${Literals.Columns.Name[Profile.Language]} :`}
                          <Label.Detail>
                            {`${patientDefine?.Firstname || 'Tanımsız'} ${patientDefine?.Lastname || 'Tanımsız'}`}
                          </Label.Detail>
                        </Label>
                      </div>
                      <div className='my-2'>
                        <Label
                          image
                          color='blue'
                          size='medium'
                        >
                          {`${Literals.Columns.CountryID[Profile.Language]} :`}
                          <Label.Detail>
                            {`${patientDefine?.CountryID || ''}`}
                          </Label.Detail>
                        </Label>
                      </div>
                      <div className='my-2'>
                        <Label
                          image
                          color='blue'
                          size='medium'
                        >
                          {`${Literals.Columns.Dateofbirth[Profile.Language]} :`}
                          <Label.Detail>
                            {`${this.dateCellhandler(patientDefine?.Dateofbirth) || ''}`}
                          </Label.Detail>
                        </Label>
                      </div>

                    </div>
                    <div>
                      <div className='my-2'>
                        <Label
                          image
                          color='blue'
                          size='medium'
                        >
                          {`${Literals.Columns.Gender[Profile.Language]} :`}
                          <Label.Detail>
                            {`${patientDefine?.Gender || ''}`}
                          </Label.Detail>
                        </Label>
                      </div>
                      <div className='my-2'>
                        <Label
                          image
                          color='blue'
                          size='medium'
                        >
                          {`${Literals.Columns.Fathername[Profile.Language]} :`}
                          <Label.Detail>
                            {`${patientDefine?.Fathername || ''}`}
                          </Label.Detail>
                        </Label>
                      </div>
                    </div>
                    {patientPP
                      ? <Image
                        alt='pp'
                        floated='right'
                        size='tiny'
                        rounded
                        src={`${config.services.File}${ROUTES.FILE}/Downloadfile/${patientPP?.Uuid}`}
                      />
                      : <Image
                        floated='right'
                        size='tiny'
                        rounded
                        src={`https://react.semantic-ui.com/images/avatar/large/${patientDefine?.Gender === '1' ? 'molly' : 'steve'}.jpg`}
                      />
                    }
                  </div>
                </Card>
                <Pagedivider />
              </React.Fragment>
              }
              {isPatientselected && <React.Fragment>
                <Table celled className='overflow-x-auto' >
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell width={4}>{Literals.Columns.SupportplanID[Profile.Language]}</Table.HeaderCell>
                      <Table.HeaderCell width={1}>{Literals.Columns.Helpstatus[Profile.Language]}</Table.HeaderCell>
                      <Table.HeaderCell width={1}>{Literals.Columns.Requiredperiod[Profile.Language]}</Table.HeaderCell>
                      <Table.HeaderCell width={1}>{Literals.Columns.Makingtype[Profile.Language]}</Table.HeaderCell>
                      <Table.HeaderCell width={1}>{Literals.Columns.Rating[Profile.Language]}</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {this.state.Supportplans.map((plan, index) => {
                      return <Table.Row key={plan.key}>
                        <Table.Cell>
                          <Label>{plan.Supportplanname}</Label>
                        </Table.Cell>
                        <Table.Cell>
                          <Dropdown
                            value={plan.Helpstatus}
                            placeholder={Literals.Columns.Helpstatus[Profile.Language]}
                            name="Helpstatus"
                            clearable
                            search
                            fluid
                            selection
                            options={Helpstatusoption}
                            onChange={(e, data) => { this.changeHandler(plan.key, 'Helpstatus', data.value) }}
                          />
                        </Table.Cell>
                        <Table.Cell>
                          <Dropdown
                            value={plan.Requiredperiod}
                            placeholder={Literals.Columns.Requiredperiod[Profile.Language]}
                            name="Requiredperiod"
                            clearable
                            search
                            fluid
                            selection
                            options={Requiredperiodoption}
                            onChange={(e, data) => { this.changeHandler(plan.key, 'Requiredperiod', data.value) }}
                          />
                        </Table.Cell>
                        <Table.Cell>
                          <Dropdown
                            value={plan.Makingtype}
                            placeholder={Literals.Columns.Makingtype[Profile.Language]}
                            name="Makingtype"
                            clearable
                            search
                            fluid
                            selection
                            options={Makingtypeoptions}
                            onChange={(e, data) => { this.changeHandler(plan.key, 'Makingtype', data.value) }}
                          />
                        </Table.Cell>
                        <Table.Cell>
                          <Dropdown
                            value={plan.Rating}
                            placeholder={Literals.Columns.Rating[Profile.Language]}
                            name="Rating"
                            clearable
                            search
                            fluid
                            selection
                            options={Ratingoptions}
                            onChange={(e, data) => { this.changeHandler(plan.key, 'Rating', data.value) }}
                          />
                        </Table.Cell>
                      </Table.Row>
                    })}
                  </Table.Body>
                </Table>
              </React.Fragment>}
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Careplans"}
              buttonText={Literals.Button.Goback[Profile.Language]}
            />
            <Submitbutton
              isLoading={Careplans.isLoading}
              buttonText={Literals.Button.Create[Profile.Language]}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { AddCareplans, history, fillCareplannotification, Profile, closeModal, Supportplans } = this.props
    const data = this.context.getForm(this.PAGE_NAME)
    data.Careplanservices = this.state.Supportplans

    let errors = []
    if (!validator.isISODate(data.Startdate)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Startdaterequired[Profile.Language] })
    }
    if (!validator.isISODate(data.Enddate)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Enddaterequired[Profile.Language] })
    }
    if (!validator.isISODate(data.Createdate)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Createdaterequired[Profile.Language] })
    }
    if (!validator.isUUID(data.PatientID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Patientrequired[Profile.Language] })
    }
    data.Careplanservices.forEach((service => {
      if (!validator.isUUID(service.Helpstatus)) {
        errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Helpstatusrequired[Profile.Language] })
      }
      if (!validator.isUUID(service.Requiredperiod)) {
        errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Requiredperiodrequired[Profile.Language] })
      }
      if (!validator.isUUID(service.Makingtype)) {
        errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Makingtyperequired[Profile.Language] })
      }
      if (!validator.isUUID(service.Rating)) {
        errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Ratingrequired[Profile.Language] })
      }
    }))
    if (errors.length > 0) {
      errors.forEach(error => {
        fillCareplannotification(error)
      })
    } else {

      let willapprove = (data.Careplanservices || []).map(u => {
        return (Supportplans.list || []).find(plan => plan.Uuid === u?.SupportplanID)?.IsRequired
      }).filter(u => u === true || u === 1).length > 0
      
      let isRequired = (data.Careplanservices || []).map(u => {
        return (Supportplans.list || []).find(plan => plan.Uuid === u?.SupportplanID)?.IsNeedactivation
      }).filter(u => u === true || u === 1).length > 0
      
      console.log('isRequired: ', isRequired);
      console.log('willapprove: ', willapprove);
      AddCareplans({ data: { ...data, Needapprove: willapprove || isRequired, Isapproved: false }, history, closeModal })
    }
  }

  dateCellhandler = (value) => {
    if (value) {
      return value.split('T').length > 0 ? value.split('T')[0] : value
    }
    return null
  }

  changeHandler = (key, property, value) => {
    let supportPlans = this.state.Supportplans
    const index = supportPlans.findIndex(plan => plan.key === key)
    supportPlans[index][property] = value
    this.setState({ Supportplans: supportPlans })
  }

}
CareplansCreate.contextType = FormContext