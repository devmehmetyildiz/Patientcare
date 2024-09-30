import React, { useContext, useEffect } from 'react'
import { Button, Form, Modal } from 'semantic-ui-react'
import { Contentwrapper, FormInput } from '../../Components'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'

export default function PatientsEntereventModal(props) {

    const PAGE_NAME = 'PatientsEntereventModal'

    const context = useContext(FormContext)

    const { open, setOpen, record, setRecord, Profile, Patientdefines, Patienteventdefines, AddPatienteventmovements, fillPatientnotification, GetPatienteventdefines } = props
    const t = Profile?.i18n?.t || null

    const Uuid = record?.Uuid
    const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === record?.PatientdefineID)
    const patientName = patientdefine ? `${patientdefine?.Firstname} ${patientdefine?.Lastname} - ${patientdefine?.CountryID}` : t('Common.NoDataFound')

    const Patienteventdefinesoptions = (Patienteventdefines.list || []).filter(u => u.Isactive).map(event => {
        return { key: event.Uuid, text: event.Eventname, value: event.Uuid }
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
                        <Form.Group widths='equal'>
                            <FormInput page={PAGE_NAME} required placeholder={t('Pages.Patients.PatientEntereventModal.Column.Event')} name="EventID" options={Patienteventdefinesoptions} formtype='dropdown' />
                            <FormInput page={PAGE_NAME} placeholder={t('Pages.Patients.PatientEntereventModal.Column.Occureddate')} name="Occureddate" type='datetime-local' />
                        </Form.Group>
                        <Form.Group widths='equal'>
                            <FormInput page={PAGE_NAME} placeholder={t('Pages.Patients.PatientEntereventModal.Column.Info')} name="Info" />
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
                    if (!validator.isUUID(data.EventID)) {
                        errors.push({ type: 'Error', code: t('Pages.Patients.PatientEntereventModal.Page.Header'), description: t('Pages.Patients.PatientEntereventModal.Messages.EventRequired') })
                    }
                    if (!validator.isISODate(data.Occureddate)) {
                        errors.push({ type: 'Error', code: t('Pages.Patients.PatientEntereventModal.Page.Header'), description: t('Pages.Patients.PatientEntereventModal.Messages.OccureddateRequired') })
                    }

                    if (errors.length > 0) {
                        errors.forEach(error => {
                            fillPatientnotification(error)
                        })
                    } else {
                        AddPatienteventmovements({
                            data: {
                                PatientID: Uuid,
                                EventID: data?.EventID,
                                Info: data?.Info,
                                Occureddate: data?.Occureddate,
                            }
                        })
                        setOpen(false)
                        setRecord(null)
                    }
                }}
                positive
            />
        </Modal.Actions>
    </Modal>
}
