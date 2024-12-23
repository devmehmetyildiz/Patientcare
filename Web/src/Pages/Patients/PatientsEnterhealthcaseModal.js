import React, { useContext, useEffect } from 'react'
import { Button, Form, Modal } from 'semantic-ui-react'
import { Contentwrapper, FormInput } from '../../Components'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'

export default function PatientsEnterhealthcaseModal(props) {

    const PAGE_NAME = 'PatientsEnterhealthcaseModal'

    const context = useContext(FormContext)

    const { open, setOpen, record, setRecord, Profile, Patientdefines, Patienthealthcases, Patienthealthcasedefines } = props
    const { AddPatienthealthcases, fillPatienthealthcasenotification, GetPatient } = props
    const t = Profile?.i18n?.t || null

    const Uuid = record?.Uuid

    const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === record?.PatientdefineID)
    const patientName = patientdefine ? `${patientdefine?.Firstname} ${patientdefine?.Lastname} - ${patientdefine?.CountryID}` : t('Common.NoDataFound')

    const Patienthealthcasedefinesoptions = (Patienthealthcasedefines?.list || []).filter(u => u.Isactive).map(define => {
        return { key: define.Uuid, text: `${define.Name}`, value: define.Uuid }
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
        <Modal.Header>{t('Pages.Patients.PatientsEnterhealthcaseModal.Page.Header')}</Modal.Header>
        <Modal.Header>{patientName}</Modal.Header>
        <Modal.Content className='w-full' image>
            {open ?
                <Contentwrapper>
                    <Form>
                        <FormInput page={PAGE_NAME} required placeholder={t('Pages.Patients.PatientsEnterhealthcaseModal.Column.Define')} name="DefineID" options={Patienthealthcasedefinesoptions} formtype='dropdown' />
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
                loading={Patienthealthcases.isLoading}
                content={t('Common.Button.Save')}
                labelPosition='right'
                className='!bg-[#2355a0] !text-white'
                icon='checkmark'
                onClick={() => {
                    const data = context.getForm(PAGE_NAME)
                    let errors = []

                    if (!validator.isUUID(data.DefineID)) {
                        errors.push({ type: 'Error', code: t('Pages.PatientsEnterhealthcaseModal.Page.Header'), description: t('Pages.PatientsEnterhealthcaseModal.Messages.DefineRequired') })
                    }

                    if (errors.length > 0) {
                        errors.forEach(error => {
                            fillPatienthealthcasenotification(error)
                        })
                    } else {
                        AddPatienthealthcases({
                            data: { ...data, PatientID: Uuid },
                            onSuccess: () => {
                                setOpen(false)
                                setRecord(null)
                                GetPatient(Uuid)
                            }
                        })

                    }
                }}
                positive
            />
        </Modal.Actions>
    </Modal>
}
