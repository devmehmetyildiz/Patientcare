import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Form, Icon, Label, Modal } from 'semantic-ui-react'
import Notification from '../../Utils/Notification'
import formToObject from 'form-to-object'
import LoadingPage from '../../Utils/LoadingPage'
import FormInput from '../../Utils/FormInput'
import Literals from './Literals'
import validator from "../../Utils/Validator"
import { FormContext } from '../../Provider/FormProvider'
import Pagewrapper from '../../Common/Wrappers/Pagewrapper'
import Contentwrapper from '../../Common/Wrappers/Contentwrapper'
import Pagedivider from '../../Common/Styled/Pagedivider'
import Headerbredcrump from '../../Common/Wrappers/Headerbredcrump'
import Headerwrapper from '../../Common/Wrappers/Headerwrapper'
import Footerwrapper from '../../Common/Wrappers/Footerwrapper'
import CasesCreate from '../../Containers/Cases/CasesCreate'

export default class PatientsEditcase extends Component {

    PAGE_NAME = 'PatientsEditcase'

    constructor(props) {
        super(props)
        this.state = {
            isDatafetched: false,
            modelOpened: false
        }
    }

    componentDidMount() {
        const {
            GetPatient, match, history, PatientID,
            GetPatientdefines, GetCases
        } = this.props
        let Id = PatientID || match?.params?.PatientID
        if (validator.isUUID(Id)) {
            GetPatient(Id)
            GetPatientdefines()
            GetCases()
        } else {
            history.length > 1 ? history.goBack() : history.push(Id ? `/Patients/${Id}` : `/Patients`)
        }
    }

    componentDidUpdate() {
        const {
            Patients, removePatientnotification, Patientdefines,
            removePatientdefinenotification, Cases, removeCasenotification
        } = this.props
        const { selected_record } = Patients

        const isLoadingstatus =
            Patients.isLoading &&
            Patientdefines.isLoading &&
            Cases.isLoading

        if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0 && isLoadingstatus && !this.state.isDatafetched) {
            this.setState({ isDatafetched: true })
            this.context.setForm(this.PAGE_NAME, selected_record)
        }
        Notification(Patients.notifications, removePatientnotification)
        Notification(Patientdefines.notifications, removePatientdefinenotification)
        Notification(Cases.notifications, removeCasenotification)
    }

    render() {

        const {
            Patients, Patientdefines, Cases, Profile, history, match, PatientID
        } = this.props


        const Id = match.params.PatientID || PatientID

        const { selected_record } = Patients

        const isLoadingstatus =
            Patients.isLoading &&
            Patientdefines.isLoading &&
            Cases.isLoading

        const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === selected_record?.PatientdefineID)

        const Casesoption = (Cases.list || []).filter(u => u.Isactive).map(casedata => {
            return { key: casedata.Uuid, text: casedata.Name, value: casedata.Uuid }
        })

        const activecase = (Cases.list || []).find(u => u.Uuid === selected_record?.CaseID)

        const addModal = (content) => {
            return <Modal
                onClose={() => { this.setState({ modelOpened: false }) }}
                onOpen={() => { this.setState({ modelOpened: true }) }}
                trigger={<Icon link name='plus' />}
                content={content}
            />
        }

        return (
            isLoadingstatus ? <LoadingPage /> :
                <Pagewrapper >
                    <Headerwrapper>
                        <Headerbredcrump>
                            <Link to={"/Patients"}>
                                <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                            </Link>
                            <Breadcrumb.Divider icon='right chevron' />
                            <Link to={"/Patients/" + Id}>
                                <Breadcrumb.Section>{`${patientdefine?.Firstname} ${patientdefine?.Lastname}`}</Breadcrumb.Section>
                            </Link>
                            <Breadcrumb.Divider icon='right chevron' />
                            <Breadcrumb.Section>{Literals.Page.Pageeditcaseheader[Profile.Language]}</Breadcrumb.Section>
                        </Headerbredcrump>
                    </Headerwrapper>
                    <Pagedivider />
                    <Contentwrapper>
                        <Form onSubmit={this.handleSubmit}>
                            <Label>{`${Literals.Columns.Activecase[Profile.Language]} : ${activecase?.Name}`}</Label>
                            <Form.Group widths='equal'>
                                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Case[Profile.Language]} name="CaseID" options={Casesoption} formtype='dropdown' modal={CasesCreate} />
                            </Form.Group>
                            <Footerwrapper>
                                {history && <Button onClick={(e) => {
                                    e.preventDefault()
                                    history.length > 1 ? history.goBack() : history.push(Id ? `/Patients/${Id}` : `/Patients`)
                                }} floated="left" color='grey'>{Literals.Button.Goback[Profile.Language]}</Button>}
                                <Button floated="right" type='submit' color='blue'>{Literals.Button.Update[Profile.Language]}</Button>
                            </Footerwrapper>
                        </Form>
                    </Contentwrapper>
                </Pagewrapper >
        )
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const { history, Profile, fillPatientnotification, Editpatientcase, match, PatientID } = this.props
        let Id = PatientID || match?.params?.PatientID
        const data = formToObject(e.target)
        data.CaseID = this.context.formstates[`${this.PAGE_NAME}/CaseID`]
        let errors = []
        if (!validator.isUUID(data.CaseID)) {
            errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.WarehouseReuired[Profile.Language] })
        }

        if (errors.length > 0) {
            errors.forEach(error => {
                fillPatientnotification(error)
            })
        } else {
            Editpatientcase({
                data: {
                    PatientID: Id,
                    CaseID: data.CaseID
                }, history, redirectID: Id
            })
        }
    }
}
PatientsEditcase.contextType = FormContext
