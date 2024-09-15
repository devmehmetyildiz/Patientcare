import React, { useContext, useEffect } from 'react'
import { Button, Form, Label, Modal } from 'semantic-ui-react'
import { Contentwrapper, FormInput } from '../../Components'
import { FormContext } from '../../Provider/FormProvider'
import validator from '../../Utils/Validator'
import Formatdate from '../../Utils/Formatdate'

export default function PatientsEditstatus(props) {
    const {
        isPatientspage,
        isPatientdetailpage,
        open,
        setOpen,
        record,
        setRecord,
        Profile,
        Patients,
        Patientdefines,
        EditPatientdates,
        fillPatientnotification,
        GetPatient,
        GetPatients,
        GetPatientdefines

    } = props

    const PAGE_NAME = 'PatientsEditstatus'
    const t = Profile?.i18n?.t || null
    const context = useContext(FormContext)

    const patient = record
    const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)

    useEffect(() => {
        context.clearForm(PAGE_NAME)
        if (open) {
            GetPatientdefines()
            context.setForm(PAGE_NAME,
                {
                    ...patient,
                    [`Happensdate`]: Formatdate(patient?.Happensdate),
                    [`Approvaldate`]: Formatdate(patient?.Approvaldate),
                    [`Registerdate`]: Formatdate(patient?.Registerdate),
                })
        }
    }, [open])


    return open
        ? <Modal
            onClose={() => {
                setOpen(false)
                setRecord(null)
            }}
            onOpen={() => {
                setOpen(true)
            }}
            open={open}
        >
            <Modal.Header>{`${t('Pages.Patients.PatientsEditstatus.Page.Header')} - ${patientdefine?.Firstname} ${patientdefine?.Lastname} (${patientdefine?.CountryID})`}</Modal.Header>
            <Modal.Content>
                <Contentwrapper>
                    <Form>
                        <Form.Group widths={'equal'}>
                            <FormInput page={PAGE_NAME} required placeholder={t('Pages.Patients.PatientsEditstatus.Label.Registerdate')} name="Registerdate" type="date" />
                            <FormInput page={PAGE_NAME} placeholder={t('Pages.Patients.PatientsEditstatus.Label.Approvaldate')} name="Approvaldate" type="date" />
                        </Form.Group>
                        <Form.Group widths={'equal'}>
                            <FormInput page={PAGE_NAME} placeholder={t('Pages.Patients.PatientsEditstatus.Label.Happensdate')} name="Happensdate" type="date" />
                        </Form.Group>
                        <Form.Group widths={'equal'}>
                            <FormInput page={PAGE_NAME} placeholder={t('Pages.Patients.PatientsEditstatus.Label.Info')} name="Info" />
                            <FormInput page={PAGE_NAME} placeholder={t('Pages.Patients.PatientsEditstatus.Label.Guardiannote')} name="Guardiannote" />
                        </Form.Group>
                    </Form>
                </Contentwrapper>
            </Modal.Content>
            <Modal.Actions>
                <Button color='black' onClick={() => {
                    setOpen(false)
                    setRecord(null)
                }}>
                    {t('Common.Button.Goback')}
                </Button>
                <Button
                    content={t('Common.Button.Update')}
                    labelPosition='right'
                    className='!bg-[#2355a0] !text-white'
                    icon='checkmark'
                    onClick={() => {
                        const data = context.getForm(PAGE_NAME)

                        let errors = []
                        if (!validator.isISODate(patient?.Registerdate)) {
                            errors.push({ type: 'Error', code: t('Pages.Patients.PatientsEditstatus.Page.Header'), description: t('Pages.Patients.PatientsEditstatus.Messages.RegisterdateRequired') })
                        }
                        if (errors.length > 0) {
                            errors.forEach(error => {
                                fillPatientnotification(error)
                            })
                        } else {
                            EditPatientdates({
                                data: {
                                    Uuid: patient?.Uuid,
                                    Registerdate: data?.Registerdate,
                                    Approvaldate: data?.Approvaldate,
                                    Happensdate: data?.Happensdate,
                                    Info: data?.Info,
                                    Guardiannote: data?.Guardiannote
                                },
                                onSuccess: () => {
                                    if (isPatientspage) {
                                        GetPatients()
                                    }
                                    if (isPatientdetailpage) {
                                        GetPatient(patient?.Uuid)
                                    }
                                    setOpen(false)
                                    setRecord(null)
                                }
                            })
                        }
                    }}
                    positive
                />
            </Modal.Actions>
        </Modal>
        : null
}
