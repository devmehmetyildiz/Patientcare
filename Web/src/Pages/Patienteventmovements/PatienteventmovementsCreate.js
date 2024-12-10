import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Form, } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import {
    Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump,
    Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton
} from '../../Components'
import { PATIENTEVENT_MOVEMENT_TYPE_INDOOR, PATIENTEVENT_MOVEMENT_TYPE_OUTDOOR, } from '../../Utils/Constants'
import { FormContext } from '../../Provider/FormProvider'

export default function PatienteventmovementsCreate(props) {
    const PAGE_NAME = "PatienteventmovementsCreate"

    const { Patienteventmovements, Patienteventdefines, Patients, Patientdefines, Users, Floors, Profile, closeModal, history } = props
    const { AddPatienteventmovements, fillPatienteventmovementnotification, GetPatienteventdefines, GetPatients, GetPatientdefines, GetUsers, GetFloors } = props

    const context = useContext(FormContext)

    const t = Profile?.i18n?.t

    const Patientevenetmovementtypes = [
        { key: 1, text: t('Option.Patienteventmovement.TypeIndoor'), value: PATIENTEVENT_MOVEMENT_TYPE_INDOOR },
        { key: 2, text: t('Option.Patienteventmovement.TypeOutdoor'), value: PATIENTEVENT_MOVEMENT_TYPE_OUTDOOR },
    ]

    const Usersoptions = (Users?.list || []).filter(u => u.Isactive && u.Isworker && u.Isworking).map(user => {
        return { key: user.Uuid, text: `${user.Name} ${user.Surname}`, value: user.Uuid }
    })

    const Patientsoptions = (Patients?.list || []).filter(u => u.Isactive && u.Isalive && !u.Isleft && !u.Ispreregistration).map(patient => {
        const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)
        return { key: patient.Uuid, text: `${patientdefine.Firstname} ${patientdefine.Lastname}`, value: patient.Uuid }
    })

    const Floorsoptions = (Floors.list || []).filter(u => u.Isactive).map(Floor => {
        return { key: Floor.Uuid, text: Floor.Name, value: Floor.Uuid }
    })

    const Patientevenetdefinesoptions = (Patienteventdefines.list || []).filter(u => u.Isactive).map(define => {
        return { key: define.Uuid, text: define.Eventname, value: define.Uuid }
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        const data = context.getForm(PAGE_NAME)
        let errors = []
        if (!validator.isNumber(data.Type)) {
            errors.push({ type: 'Error', code: t('Pages.Patienteventmovements.Page.Header'), description: t('Pages.Patienteventmovements.Messages.TypeRequired') })
        }
        if (!validator.isUUID(data.PatientID)) {
            errors.push({ type: 'Error', code: t('Pages.Patienteventmovements.Page.Header'), description: t('Pages.Patienteventmovements.Messages.PatientRequired') })
        }
        if (!validator.isUUID(data.EventID)) {
            errors.push({ type: 'Error', code: t('Pages.Patienteventmovements.Page.Header'), description: t('Pages.Patienteventmovements.Messages.EventRequired') })
        }
        if (!validator.isUUID(data.UserID)) {
            errors.push({ type: 'Error', code: t('Pages.Patienteventmovements.Page.Header'), description: t('Pages.Patienteventmovements.Messages.UserRequired') })
        }
        if (!validator.isISODate(data.Occureddate)) {
            errors.push({ type: 'Error', code: t('Pages.Patienteventmovements.Page.Header'), description: t('Pages.Patienteventmovements.Messages.OccureddateRequired') })
        }
        if (!validator.isNumber(data.Solutionsecond)) {
            errors.push({ type: 'Error', code: t('Pages.Patienteventmovements.Page.Header'), description: t('Pages.Patienteventmovements.Messages.SolutiontimeRequired') })
        }

        if (errors.length > 0) {
            errors.forEach(error => {
                fillPatienteventmovementnotification(error)
            })
        } else {
            AddPatienteventmovements({
                data,
                history,
                redirectUrl: "/Patienteventmovements",
                closeModal,
            })
        }
    }

    useEffect(() => {
        GetPatienteventdefines()
        GetPatients()
        GetPatientdefines()
        GetUsers()
        GetFloors()
    }, [])

    const isLoading =
        Patienteventmovements.isLoading ||
        Patienteventdefines.isLoading ||
        Patients.isLoading ||
        Patientdefines.isLoading ||
        Users.isLoading ||
        Floors.isLoading

    return (isLoading ? <LoadingPage /> :
        <Pagewrapper>
            <Headerwrapper>
                <Headerbredcrump>
                    <Link to={"/Patienteventmovements"}>
                        <Breadcrumb.Section >{t('Pages.Patienteventmovements.Page.Header')}</Breadcrumb.Section>
                    </Link>
                    <Breadcrumb.Divider icon='right chevron' />
                    <Breadcrumb.Section>{t('Pages.Patienteventmovements.Page.CreateHeader')}</Breadcrumb.Section>
                </Headerbredcrump>
                {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
            </Headerwrapper>
            <Pagedivider />
            <Contentwrapper>
                <Form>
                    <Form.Group widths={'equal'}>
                        <FormInput page={PAGE_NAME} required placeholder={t('Pages.Patienteventmovements.Column.Type')} name="Type" options={Patientevenetmovementtypes} formtype='dropdown' />
                        <FormInput page={PAGE_NAME} required placeholder={t('Pages.Patienteventmovements.Column.Patient')} name="PatientID" options={Patientsoptions} formtype='dropdown' />
                    </Form.Group>
                    <Form.Group widths={'equal'}>
                        <FormInput page={PAGE_NAME} required placeholder={t('Pages.Patienteventmovements.Column.Event')} name="EventID" options={Patientevenetdefinesoptions} formtype='dropdown' />
                        <FormInput page={PAGE_NAME} required placeholder={t('Pages.Patienteventmovements.Column.User')} name="UserID" options={Usersoptions} formtype='dropdown' />
                    </Form.Group>
                    <Form.Group widths={'equal'}>
                        <FormInput page={PAGE_NAME} required placeholder={t('Pages.Patienteventmovements.Column.Occureddate')} name="Occureddate" type="datetime-local" />
                        <FormInput page={PAGE_NAME} placeholder={t('Pages.Patienteventmovements.Column.Relatedpersons')} name="Relatedpersons" />
                    </Form.Group>
                    <Form.Group widths={'equal'}>
                        <FormInput page={PAGE_NAME} required placeholder={t('Pages.Patienteventmovements.Column.Solutionsecond')} name="Solutionsecond" type="number" min="0" max="9999" />
                        <FormInput page={PAGE_NAME} placeholder={t('Pages.Patienteventmovements.Column.Eventdetail')} name="Eventdetail" />
                    </Form.Group>
                    <Form.Group widths={'equal'}>
                        <FormInput page={PAGE_NAME} placeholder={t('Pages.Patienteventmovements.Column.OccuredFloor')} name="OccuredFloorID" options={Floorsoptions} formtype='dropdown' />
                        <FormInput page={PAGE_NAME} placeholder={t('Pages.Patienteventmovements.Column.OccuredPlace')} name="Occuredplace" />
                    </Form.Group>
                    <Form.Group widths={'equal'}>
                        <FormInput page={PAGE_NAME} placeholder={t('Pages.Patienteventmovements.Column.Result')} name="Result" />
                        <FormInput page={PAGE_NAME} placeholder={t('Pages.Patienteventmovements.Column.Witnesses')} name="Witnesses" />
                    </Form.Group>
                    <Form.Group widths={'equal'}>
                        <FormInput page={PAGE_NAME} placeholder={t('Pages.Patienteventmovements.Column.Info')} name="Info" />
                    </Form.Group>
                </Form>
            </Contentwrapper>
            <Footerwrapper>
                <Gobackbutton
                    history={history}
                    redirectUrl={"/Patienteventmovements"}
                    buttonText={t('Common.Button.Goback')}
                />
                <Submitbutton
                    isLoading={Patienteventmovements.isLoading}
                    buttonText={t('Common.Button.Create')}
                    submitFunction={handleSubmit}
                />
            </Footerwrapper>
        </Pagewrapper >
    )
}
