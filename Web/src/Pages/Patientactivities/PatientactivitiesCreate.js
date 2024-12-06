import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Form, } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import {
    Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump,
    Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton
} from '../../Components'
import { FormContext } from '../../Provider/FormProvider'

export default function PatientactivitiesCreate(props) {
    const PAGE_NAME = "PatientactivitiesCreate"

    const { Patientactivities, Users, Patients, Patientdefines, Profile, closeModal, history } = props
    const { GetUsers, GetPatients, GetPatientdefines, AddPatientactivities, fillPatientactivitynotification } = props

    const context = useContext(FormContext)

    const t = Profile?.i18n?.t

    const Usersoptions = (Users?.list || []).filter(u => u.Isactive && u.Isworker).map(user => {
        return { key: user.Uuid, text: `${user.Name} ${user.Surname}`, value: user.Uuid }
    })

    const Patientsoptions = (Patients?.list || []).filter(u => u.Isactive && u.Isalive && !u.Isleft && !u.Ispreregistration).map(patient => {
        const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)
        return { key: patient.Uuid, text: `${patientdefine.Firstname} ${patientdefine.Lastname}`, value: patient.Uuid }
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        const data = context.getForm(PAGE_NAME)
        let errors = []
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
            AddPatientactivities({
                data,
                history,
                redirectUrl: "/Patientactivities",
                closeModal,
            })
        }
    }

    useEffect(() => {
        GetPatientdefines()
        GetPatients()
        GetUsers()
    }, [])

    return (Patientactivities.isLoading || Patients.isLoading || Patientdefines.isLoading || Users.isLoading ? <LoadingPage /> :
        <Pagewrapper>
            <Headerwrapper>
                <Headerbredcrump>
                    <Link to={"/Patientactivities"}>
                        <Breadcrumb.Section >{t('Pages.Patientactivities.Page.Header')}</Breadcrumb.Section>
                    </Link>
                    <Breadcrumb.Divider icon='right chevron' />
                    <Breadcrumb.Section>{t('Pages.Patientactivities.Page.CreateHeader')}</Breadcrumb.Section>
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
                    buttonText={t('Common.Button.Create')}
                    submitFunction={handleSubmit}
                />
            </Footerwrapper>
        </Pagewrapper >
    )
}
