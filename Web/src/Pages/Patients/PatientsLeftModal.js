import React, { useContext, useEffect } from 'react'
import { Button, Form, Modal } from 'semantic-ui-react'
import { Contentwrapper, FormInput } from '../../Components'
import { CASE_PATIENT_STATUS_LEFT } from '../../Utils/Constants'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'

export default function PatientsLeftModal(props) {
    const PAGE_NAME = 'PatientsLeftModal'
    const context = useContext(FormContext)
    const { open, setOpen, record, setRecord, Profile, Patientdefines, Cases, RemovePatients, fillPatientnotification } = props
    const t = Profile?.i18n?.t || null

    const Uuid = record?.Uuid
    const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === record?.PatientdefineID)
    const patientName = patientdefine ? `${patientdefine?.Firstname} ${patientdefine?.Lastname} - ${patientdefine?.CountryID}` : t('Common.NoDataFound')

    const Caseoptions = (Cases.list || []).filter(u => u.Isactive && u.Patientstatus === CASE_PATIENT_STATUS_LEFT).map(casedata => {
        return { key: casedata.Uuid, text: casedata.Name, value: casedata.Uuid }
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
        <Modal.Header>{t('Pages.Patients.PatientsLeftModal.Page.Header')}</Modal.Header>
        <Modal.Header>{patientName}</Modal.Header>
        <Modal.Content className='w-full' image>
            {open ?
                <Contentwrapper>
                    <Form>
                        <Form.Group widths='equal'>
                            <FormInput page={PAGE_NAME} required placeholder={t('Pages.Patients.PatientsLeftModal.Column.Case')} name="CaseID" options={Caseoptions} formtype='dropdown' />
                            <FormInput page={PAGE_NAME} required placeholder={t('Pages.Patients.PatientsLeftModal.Column.Leavedate')} name="Leavedate" type='datetime-local' />
                        </Form.Group>
                        <FormInput page={PAGE_NAME} placeholder={t('Pages.Patients.PatientsLeftModal.Column.Leftinfo')} name="Leftinfo" />
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
                content={t('Common.Button.RemoveOrganization')}
                labelPosition='right'
                className='!bg-[#2355a0] !text-white'
                icon='checkmark'
                onClick={() => {
                    const data = context.getForm(PAGE_NAME)
                    let errors = []
                    if (!validator.isUUID(data.CaseID)) {
                        errors.push({ type: 'Error', code: t('Pages.Patients.PatientsLeftModal.Page.Header'), description: t('Pages.Patients.PatientsLeftModal.Messages.CaseRequired') })
                    }
                    if (!validator.isISODate(data.Leavedate)) {
                        errors.push({ type: 'Error', code: t('Pages.Patients.PatientsLeftModal.Page.Header'), description: t('Pages.Patients.PatientsLeftModal.Messages.LeavedateRequired') })
                    }

                    if (errors.length > 0) {
                        errors.forEach(error => {
                            fillPatientnotification(error)
                        })
                    } else {
                        RemovePatients({
                            Uuid: Uuid,
                            CaseID: data.CaseID,
                            Leftinfo: data.Leftinfo,
                            Leavedate: data.Leavedate
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
