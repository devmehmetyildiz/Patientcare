import React, { useContext, useEffect } from 'react'
import { Button, Form, Modal } from 'semantic-ui-react'
import { Contentwrapper, FormInput } from '../../Components'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { PATIENTEVENT_MOVEMENT_TYPE_INDOOR, PATIENTEVENT_MOVEMENT_TYPE_OUTDOOR } from '../../Utils/Constants'
import { useParams } from 'react-router-dom'

export default function PatientsEntereventModal(props) {

    const PAGE_NAME = 'PatientsEntereventModal'

    const context = useContext(FormContext)

    const { open, setOpen, record, setRecord, Profile, Patientdefines, Patienteventdefines, Users, Floors } = props
    const { AddPatienteventmovements, fillPatienteventmovementnotification, GetPatient } = props
    const t = Profile?.i18n?.t || null
    const params = useParams()
    const Id = params?.PatientID || null

    const Uuid = record?.Uuid
    const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === record?.PatientdefineID)
    const patientName = patientdefine ? `${patientdefine?.Firstname} ${patientdefine?.Lastname} - ${patientdefine?.CountryID}` : t('Common.NoDataFound')

    const Patientevenetmovementtypes = [
        { key: 1, text: t('Option.Patienteventmovement.TypeIndoor'), value: PATIENTEVENT_MOVEMENT_TYPE_INDOOR },
        { key: 2, text: t('Option.Patienteventmovement.TypeOutdoor'), value: PATIENTEVENT_MOVEMENT_TYPE_OUTDOOR },
    ]

    const Usersoptions = (Users?.list || []).filter(u => u.Isactive && u.Isworker && u.Isworking).map(user => {
        return { key: user.Uuid, text: `${user.Name} ${user.Surname}`, value: user.Uuid }
    })

    const Floorsoptions = (Floors.list || []).filter(u => u.Isactive).map(Floor => {
        return { key: Floor.Uuid, text: Floor.Name, value: Floor.Uuid }
    })

    const Patientevenetdefinesoptions = (Patienteventdefines.list || []).filter(u => u.Isactive).map(define => {
        return { key: define.Uuid, text: define.Eventname, value: define.Uuid }
    })

    useEffect(() => {
        if (!open) {
            context.clearForm(PAGE_NAME)
        }
    }, [open])

    return <Modal
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
    >
        <Modal.Header>{t('Pages.Patients.PatientEntereventModal.Page.Header')}</Modal.Header>
        <Modal.Header>{patientName}</Modal.Header>
        <Modal.Content className='w-full' image>
            {open ?
                <Contentwrapper>
                    <Form>
                        <Form.Group widths={'equal'}>
                            <FormInput page={PAGE_NAME} required placeholder={t('Pages.Patienteventmovements.Column.Type')} name="Type" options={Patientevenetmovementtypes} formtype='dropdown' />
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
                : null}
        </Modal.Content>
        <Modal.Actions>
            <Button color='black' onClick={() => {
                setOpen(false)
                setRecord(null)
            }}>
                {t('Common.Button.Giveup')}
            </Button>
            <Button
                content={t('Common.Button.Save')}
                labelPosition='right'
                className='!bg-[#2355a0] !text-white'
                icon='checkmark'
                onClick={() => {
                    const data = context.getForm(PAGE_NAME)
                    let errors = []
                    if (!validator.isNumber(data.Type)) {
                        errors.push({ type: 'Error', code: t('Pages.Patienteventmovements.Page.Header'), description: t('Pages.Patienteventmovements.Messages.TypeRequired') })
                    }
                    if (!validator.isUUID(Uuid)) {
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
                            data: { ...data, PatientID: Uuid },
                            onSuccess: () => {
                                setOpen(false)
                                setRecord(null)
                                GetPatient(Id)
                            }
                        })

                    }
                }}
                positive
            />
        </Modal.Actions>
    </Modal>
}
