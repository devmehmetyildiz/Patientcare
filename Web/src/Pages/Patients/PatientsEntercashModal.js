import React, { useContext, useEffect } from 'react'
import { Button, Form, Label, Modal } from 'semantic-ui-react'
import { CASH_TYPE_INCOME, CASH_TYPE_OUTCOME } from '../../Utils/Constants'
import { Contentwrapper, FormInput } from '../../Components'
import { FormContext } from '../../Provider/FormProvider'
import validator from '../../Utils/Validator'

export default function PatientsEntercashModal(props) {
    const {
        isPatientspage,
        isPatientdetailpage,
        open,
        setOpen,
        record,
        setRecord,
        Profile,
        Patientdefines,
        Patientcashmovements,
        Patientcashregisters,
        GetPatientcashmovements,
        AddPatientcashmovements,
        GetPatientcashregisters,
        GetPatientdefines,
        fillPatientcashmovementnotification,
        GetPatients,
        GetPatient
    } = props

    const PAGE_NAME = 'PatientsEntercashModal'
    const t = Profile?.i18n?.t || null
    const context = useContext(FormContext)

    useEffect(() => {
        if (open) {
            GetPatientcashmovements()
            GetPatientcashregisters()
            GetPatientdefines()
        }
        context.clearForm(PAGE_NAME)
    }, [open])

    const patient = record
    const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)

    let patientCash = 0.0;
    (Patientcashmovements.list || []).filter(u => u.PatientID === patient?.Uuid && u.Isactive).forEach(cash => {
        patientCash += cash.Movementtype * cash.Movementvalue
    })
    const [integerPart, decimalPart] = patientCash.toFixed(2).split('.')

    const CASH_OPTION = [
        { key: 1, text: t('Option.Cashtypes.Outcome'), value: CASH_TYPE_OUTCOME },
        { key: 2, text: t('Option.Cashtypes.Income'), value: CASH_TYPE_INCOME }
    ]

    const Patientcashregisteroptions = (Patientcashregisters.list || []).filter(u => u.Isactive).map(register => {
        return { key: register.Uuid, text: register.Name, value: register.Uuid }
    })

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
            <Modal.Header>{`${t('Pages.Patients.PatientsEntercashModal.Page.Header')} - ${patientdefine?.Firstname} ${patientdefine?.Lastname} (${patientdefine?.CountryID})`}</Modal.Header>
            <Modal.Header>
                <div className='w-full flex justify-start items-center'>
                    <Label className='!bg-[#2355a0] !text-white' size='big'>Cüzdan : {integerPart}.{decimalPart}₺</Label>
                </div>
            </Modal.Header>
            <Modal.Content>
                <Contentwrapper>
                    <Form>
                        <Form.Group widths={'equal'}>
                            <FormInput page={PAGE_NAME} required placeholder={t('Pages.Patients.PatientsEntercashModal.Label.Register')} name="RegisterID" options={Patientcashregisteroptions} formtype='dropdown' />
                        </Form.Group>
                        <Form.Group widths={'equal'}>
                            <FormInput page={PAGE_NAME} required placeholder={t('Pages.Patients.PatientsEntercashModal.Label.Movementtype')} name="Movementtype" options={CASH_OPTION} formtype='dropdown' />
                            <FormInput page={PAGE_NAME} required placeholder={t('Pages.Patients.PatientsEntercashModal.Label.Movementvalue')} name="Movementvalue" type='number' min={0} max={999999} step='0.01' />
                        </Form.Group>
                        <Form.Group widths={'equal'}>
                            <FormInput page={PAGE_NAME} placeholder={t('Pages.Patients.PatientsEntercashModal.Label.Info')} name="Info" />
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
                    content={t('Common.Button.Entercash')}
                    labelPosition='right'
                    className='!bg-[#2355a0] !text-white'
                    icon='checkmark'
                    onClick={() => {
                        const data = context.getForm(PAGE_NAME)
                        !validator.isNumber(data.Movementvalue) && (data.Movementvalue = 0)
                        let errors = []
                        if (!validator.isUUID(patient?.Uuid)) {
                            errors.push({ type: 'Error', code: t('Pages.Patients.PatientsEntercashModal.Page.Header'), description: t('Pages.Patients.PatientsEntercashModal.Messages.PatientRequired') })
                        }
                        if (!validator.isUUID(data.RegisterID)) {
                            errors.push({ type: 'Error', code: t('Pages.Patients.PatientsEntercashModal.Page.Header'), description: t('Pages.Patients.PatientsEntercashModal.Messages.RegisterRequired') })
                        }
                        if (!validator.isNumber(data.Movementtype)) {
                            errors.push({ type: 'Error', code: t('Pages.Patients.PatientsEntercashModal.Page.Header'), description: t('Pages.Patients.PatientsEntercashModal.Messages.TypeRequired') })
                        }
                        if (!validator.isNumber(data.Movementvalue)) {
                            errors.push({ type: 'Error', code: t('Pages.Patients.PatientsEntercashModal.Page.Header'), description: t('Pages.Patients.PatientsEntercashModal.Messages.ValueRequired') })
                        }
                        if (errors.length > 0) {
                            errors.forEach(error => {
                                fillPatientcashmovementnotification(error)
                            })
                        } else {

                            let body = {
                                data: {
                                    PatientID: patient?.Uuid,
                                    RegisterID: data?.RegisterID,
                                    Movementtype: data?.Movementtype,
                                    Movementvalue: data?.Movementvalue,
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
                            }

                            AddPatientcashmovements(body)
                        }
                    }}
                    positive
                />
            </Modal.Actions>
        </Modal>
        : null
}
