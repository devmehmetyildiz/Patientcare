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
import TodogroupdefinesCreate from '../../Containers/Todogroupdefines/TodogroupdefinesCreate'
import Gobackbutton from '../../Common/Gobackbutton'
import Submitbutton from '../../Common/Submitbutton'

export default class PatientsEditroutine extends Component {

    PAGE_NAME = 'PatientsEditroutine'

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
            GetPatientdefines, GetTodogroupdefines
        } = this.props
        let Id = PatientID || match?.params?.PatientID
        if (validator.isUUID(Id)) {
            GetPatient(Id)
            GetPatientdefines()
            GetTodogroupdefines()
        } else {
            history.length > 1 ? history.goBack() : history.push(Id ? `/Patients/${Id}` : `/Patients`)
        }
    }

    componentDidUpdate() {
        const { Patients, Patientdefines, Todogroupdefines } = this.props
        const { selected_record } = Patients

        const isLoadingstatus =
            Patients.isLoading &&
            Patientdefines.isLoading &&
            Todogroupdefines.isLoading

        if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0 && isLoadingstatus && !this.state.isDatafetched) {
            this.setState({ isDatafetched: true })
            this.context.setForm(this.PAGE_NAME, selected_record)
        }
    }

    render() {

        const {
            Patients, Patientdefines, Todogroupdefines, Profile, history, match, PatientID
        } = this.props


        const Id = match.params.PatientID || PatientID

        const { selected_record } = Patients

        const isLoadingstatus =
            Patients.isLoading &&
            Patientdefines.isLoading &&
            Todogroupdefines.isLoading

        const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === selected_record?.PatientdefineID)

        const Todogroupdefinessoption = (Todogroupdefines.list || []).filter(u => u.Isactive).map(todogroupdefine => {
            return { key: todogroupdefine.Uuid, text: todogroupdefine.Name, value: todogroupdefine.Uuid }
        })

        const activetodogroupdefine = (Todogroupdefines.list || []).find(u => u.Uuid === selected_record?.TodogroupdefineID)

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
                            <Breadcrumb.Section>{Literals.Page.Pageeditroutineheader[Profile.Language]}</Breadcrumb.Section>
                        </Headerbredcrump>
                    </Headerwrapper>
                    <Pagedivider />
                    <Contentwrapper>
                        <Form>
                            <Label>{`${Literals.Columns.Activetodogroupdefine[Profile.Language]} : ${activetodogroupdefine?.Name}`}</Label>
                            <Form.Group widths='equal'>
                                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Todogroupdefine[Profile.Language]} name="TodogroupdefineID" options={Todogroupdefinessoption} formtype='dropdown' modal={TodogroupdefinesCreate} />
                            </Form.Group>
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
                        </Form>
                    </Contentwrapper>
                </Pagewrapper >
        )
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const { history, Profile, fillPatientnotification, Editpatienttodogroupdefine, match, PatientID } = this.props
        let Id = PatientID || match?.params?.PatientID
        const data = this.context.getForm(this.PAGE_NAME)
        let errors = []
        if (!validator.isUUID(data.TodogroupdefineID)) {
            errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.TodogroupdefineReuired[Profile.Language] })
        }

        if (errors.length > 0) {
            errors.forEach(error => {
                fillPatientnotification(error)
            })
        } else {
            Editpatienttodogroupdefine({
                data: {
                    PatientID: Id,
                    TodogroupdefineID: data.TodogroupdefineID
                }, history, redirectID: Id
            })
        }
    }
}
PatientsEditroutine.contextType = FormContext
