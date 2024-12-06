import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Form, } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import {
    Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump,
    Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton
} from '../../Components'
import { FormContext } from '../../Provider/FormProvider'


export default function PatientactivitiesEdit(props) {

    const PAGE_NAME = "PatientactivitiesEdit"

    const { Patientactivities, Users, Patients, Patientdefines, Profile, closeModal, history, match, PatientactivityID } = props
    const { GetUsers, GetPatientdefines, GetPatients, EditPatientactivities, GetPatientactivity, fillPatientactivitynotification } = props

    const context = useContext(FormContext)

    const Id = PatientactivityID || match?.params?.PatientactivityID
    const t = Profile?.i18n?.t

    const Usersoptions = (Users?.list || []).filter(u => u.Isactive).map(user => {
        return { key: user.Uuid, text: `${user.Name} ${user.Surname}`, value: user.Uuid }
    })

    const Patientsoptions = (Patients?.list || []).filter(u => u.Isactive).map(patient => {
        const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)
        return { key: patient.Uuid, text: `${patientdefine.Firstname} ${patientdefine.Lastname}`, value: patient.Uuid }
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        const data = context.getForm(PAGE_NAME)
        let errors = []
        console.log('data.Budget: ', data.Budget);
        console.log('validator.isNumber(data.Budget): ', validator.isNumber(data.Budget));
        console.log('data.Budget: ', typeof data.Budget);
        data.Budget = validator.isNumber(data.Budget) ? parseFloat(data.Budget) : data.Budget

        if (!validator.isString(data.Name)) {
            errors.push({ type: 'Error', code: t('Pages.Patientactivities.Page.Header'), description: t('Pages.Patientactivities.Messages.NameRequired') })
        }
        if (!validator.isString(data.Place)) {
            errors.push({ type: 'Error', code: t('Pages.Patientactivities.Page.Header'), description: t('Pages.Patientactivities.Messages.PlaceRequired') })
        }
        if (!validator.isISODate(data.Starttime)) {
            errors.push({ type: 'Error', code: t('Pages.Patientactivities.Page.Header'), description: t('Pages.Patientactivities.Messages.StarttimeRequired') })
        }
        if (!validator.isISODate(data.Endtime)) {
            errors.push({ type: 'Error', code: t('Pages.Patientactivities.Page.Header'), description: t('Pages.Patientactivities.Messages.EndtimeRequired') })
        }
        if (!validator.isNumber(data.Budget)) {
            errors.push({ type: 'Error', code: t('Pages.Patientactivities.Page.Header'), description: t('Pages.Patientactivities.Messages.BudgetRequired') })
        }
        if (!validator.isArray(data.Participatedpatients)) {
            errors.push({ type: 'Error', code: t('Pages.Patientactivities.Page.Header'), description: t('Pages.Patientactivities.Messages.ParticipatedpatientsRequired') })
        }
        if (!validator.isArray(data.Participatedusers)) {
            errors.push({ type: 'Error', code: t('Pages.Patientactivities.Page.Header'), description: t('Pages.Patientactivities.Messages.ParticipatedusersRequired') })
        }
        if (errors.length > 0) {
            errors.forEach(error => {
                fillPatientactivitynotification(error)
            })
        } else {
            EditPatientactivities({
                data: { ...Patientactivities.selected_record, ...data },
                history,
                redirectUrl: "/Patientactivities",
                closeModal
            })
        }
    }


    useEffect(() => {
        GetUsers()
        GetPatients()
        GetPatientdefines()
        GetUsers()
        if (validator.isUUID(Id)) {
            GetPatientactivity(Id)
        } else {
            fillPatientactivitynotification({
                type: 'Error',
                code: t('Pages.Patientactivities.Page.Header'),
                description: t('Pages.Patientactivities.Messages.UnsupportedPatientactivity'),
            });
        }
    }, [])

    useEffect(() => {
        if (!Patientactivities.isLoading && validator.isObject(Patientactivities.selected_record)) {
            const record = Patientactivities.selected_record

            const Participatedpatients = record?.Participatedpatients
            const Participatedusers = record?.Participatedusers

            context.setForm(PAGE_NAME, {
                ...Patientactivities.selected_record,
                Participatedpatients: Participatedpatients.map(u => u.PatientID),
                Participatedusers: Participatedusers.map(u => u.UserID)
            })
        }
    }, [Patientactivities.selected_record])

    return (Patientactivities.isLoading || Patients.isLoading || Patientdefines.isLoading || Users.isLoading ? <LoadingPage /> :
        <Pagewrapper>
            <Headerwrapper>
                <Headerbredcrump>
                    <Link to={"/Patientactivities"}>
                        <Breadcrumb.Section >{t('Pages.Patientactivities.Page.Header')}</Breadcrumb.Section>
                    </Link>
                    <Breadcrumb.Divider icon='right chevron' />
                    <Breadcrumb.Section>{t('Pages.Patientactivities.Page.EditHeader')}</Breadcrumb.Section>
                </Headerbredcrump>
                {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
            </Headerwrapper>
            <Pagedivider />
            <Contentwrapper>
                <Form>
                    <Form.Group widths={'equal'}>
                        <FormInput page={PAGE_NAME} required placeholder={t('Pages.Patientactivities.Column.Name')} name="Name" />
                        <FormInput page={PAGE_NAME} required placeholder={t('Pages.Patientactivities.Column.Place')} name="Place" />
                    </Form.Group>
                    <Form.Group widths={'equal'}>
                        <FormInput page={PAGE_NAME} required placeholder={t('Pages.Patientactivities.Column.Starttime')} name="Starttime" type="datetime-local" />
                        <FormInput page={PAGE_NAME} required placeholder={t('Pages.Patientactivities.Column.Endtime')} name="Endtime" type="datetime-local" />
                    </Form.Group>
                    <Form.Group widths={'equal'}>
                        <FormInput page={PAGE_NAME} required placeholder={t('Pages.Patientactivities.Column.Budget')} name="Budget" type="number" step="0.01" />
                        <FormInput page={PAGE_NAME} placeholder={t('Pages.Patientactivities.Column.Description')} name="Description" />
                    </Form.Group>
                    <Form.Group widths={'equal'}>
                        <FormInput page={PAGE_NAME} required placeholder={t('Pages.Patientactivities.Column.Participatedpatients')} name="Participatedpatients" multiple options={Patientsoptions} formtype='dropdown' />
                        <FormInput page={PAGE_NAME} required placeholder={t('Pages.Patientactivities.Column.Participatedusers')} name="Participatedusers" multiple options={Usersoptions} formtype='dropdown' />
                    </Form.Group>
                </Form>
            </Contentwrapper>
            <Footerwrapper>
                <Gobackbutton
                    history={history}
                    redirectUrl={"/Patientactivities"}
                    buttonText={t('Common.Button.Goback')}
                />
                <Submitbutton
                    isLoading={Patientactivities.isLoading}
                    buttonText={t('Common.Button.Update')}
                    submitFunction={handleSubmit}
                />
            </Footerwrapper>
        </Pagewrapper >
    )
}
