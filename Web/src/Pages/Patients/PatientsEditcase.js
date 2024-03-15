import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb, Label } from 'semantic-ui-react'
import Literals from './Literals'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { FormInput, Contentwrapper, Footerwrapper, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
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
            GetPatientdefines, GetCases, GetDepartments
        } = this.props
        let Id = PatientID || match?.params?.PatientID
        if (validator.isUUID(Id)) {
            GetPatient(Id)
            GetPatientdefines()
            GetCases()
            GetDepartments()
        } else {
            history.length > 1 ? history.goBack() : history.push(Id ? `/Patients/${Id}` : `/Patients`)
        }
    }

    componentDidUpdate() {
        const { Patients, Patientdefines, Cases } = this.props
        const { selected_record } = Patients

        const isLoadingstatus =
            Patients.isLoading ||
            Patientdefines.isLoading ||
            Cases.isLoading 

        if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0 && !isLoadingstatus && !this.state.isDatafetched) {
            this.setState({ isDatafetched: true })
            this.context.setForm(this.PAGE_NAME, selected_record)
        }
    }

    render() {

        const {
            Patients, Patientdefines, Cases, Profile, history, match, PatientID, Departments
        } = this.props


        const Id = match?.params?.PatientID || PatientID

        const { selected_record } = Patients

        const isLoadingstatus =
            Patients.isLoading ||
            Patientdefines.isLoading ||
            Cases.isLoading ||
            Departments.isLoading

        const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === selected_record?.PatientdefineID)

        const Casesoptions = (Cases.list || []).filter(u => u.Isactive).map(cases => {
            let departments = (cases.Departmentuuids || [])
                .map(u => {
                    const department = (Departments.list || []).find(department => department.Uuid === u.DepartmentID)
                    if (department) {
                        return department
                    } else {
                        return null
                    }
                })
                .filter(u => u !== null);
            let ishavepatients = false;
            (departments || []).forEach(department => {
                if (department?.Ishavepatients) {
                    ishavepatients = true
                }
            });

            if (ishavepatients) {
                return { key: cases.Uuid, text: cases.Name, value: cases.Uuid }
            } else {
                return null
            }
        }).filter(u => u !== null);

        const activecase = (Cases.list || []).find(u => u.Uuid === selected_record?.CaseID)

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
                        <Form>
                            <Label>{`${Literals.Columns.Activecase[Profile.Language]} : ${activecase?.Name}`}</Label>
                            <Form.Group widths='equal'>
                                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Case[Profile.Language]} name="CaseID" options={Casesoptions} formtype='dropdown' modal={CasesCreate} />
                            </Form.Group>
                        </Form>
                    </Contentwrapper>
                    <Footerwrapper>
                        <Gobackbutton
                            history={history}
                            redirectUrl={Id ? `/Patients/${Id}` : `/Patients`}
                            buttonText={Literals.Button.Goback[Profile.Language]}
                        />
                        <Submitbutton
                            isLoading={isLoadingstatus}
                            buttonText={Literals.Button.Update[Profile.Language]}
                            submitFunction={this.handleSubmit}
                        />
                    </Footerwrapper>
                </Pagewrapper >
        )
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const { history, Profile, fillPatientnotification, Editpatientcase, match, PatientID } = this.props
        let Id = PatientID || match?.params?.PatientID
        const data = this.context.getForm(this.PAGE_NAME)
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
