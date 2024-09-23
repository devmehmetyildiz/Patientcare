import React, { useContext, useEffect, useState } from 'react'
import { Button, Checkbox, Form, Label, Modal } from 'semantic-ui-react'
import { Contentwrapper, FormInput } from '../../Components'
import { FormContext } from '../../Provider/FormProvider'
import validator from '../../Utils/Validator'
import { CASE_PATIENT_STATUS_DEATH, CASE_PATIENT_STATUS_LEFT } from '../../Utils/Constants'

export default function PatientsEditcaseModal(props) {
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
        Cases,
        Departments,
        fillPatientnotification,
        GetPatient,
        GetPatients,
        Editpatientcase,
        GetPatientdefines,
        GetCases,
        GetDepartments
    } = props

    const PAGE_NAME = 'PatientsEditcaseModal'
    const t = Profile?.i18n?.t || null
    const context = useContext(FormContext)

    const [ispastdatemovement, setIspastdatemovement] = useState(false)

    const patient = record
    const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)

    useEffect(() => {
        context.clearForm(PAGE_NAME)
        if (open) {
            GetPatientdefines()
            GetCases()
            GetDepartments()

        }
    }, [open])

    const CaseOption = (Cases.list || [])
        .filter(u => u.Isactive)
        .filter(u => u.Patientstatus !== CASE_PATIENT_STATUS_DEATH && u.Patientstatus !== CASE_PATIENT_STATUS_LEFT)
        .map(casedata => {
            const departmentuuids = (casedata?.Departmentuuids || []).map(u => u.DepartmentID);
            let isHavepatients = false
            departmentuuids.forEach(departmentuuid => {
                const department = (Departments.list || []).find(u => u.Uuid === departmentuuid)
                if (department?.Ishavepatients === true || department?.Ishavepatients === 1) {
                    isHavepatients = true
                }
            });
            return isHavepatients === true && casedata?.CaseStatus === 0 ? { key: casedata.Uuid, text: casedata.Name, value: casedata.Uuid } : false
        }).filter(u => u)

    const selectedCase = (Cases.list || []).find(u => u.Uuid === patient?.CaseID)

    const selectedOccureddate = context.formstates[`${PAGE_NAME}/Occureddate`]

    const nextmovements = (ispastdatemovement && validator.isISODate(selectedOccureddate)) ? (patient?.Movements || []).filter(u => new Date(u.Occureddate).getTime() >= new Date(selectedOccureddate).getTime()) : null
    const isNeedEndDate = (ispastdatemovement && validator.isISODate(selectedOccureddate)) ? (nextmovements || []).length > 0 : false

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
            <Modal.Header>{`${t('Pages.Patients.PatientsEditcaseModal.Page.Header')} - ${patientdefine?.Firstname} ${patientdefine?.Lastname} (${patientdefine?.CountryID})`}</Modal.Header>
            <Modal.Header>
                <div className='w-full flex justify-between items-center'>
                    <Label className='!bg-[#2355a0] !text-white' size='big'>{`${t('Pages.Patients.PatientsEditcaseModal.Label.Oldcase')}`}
                        <Label.Detail>
                            {selectedCase?.Name || t('Common.NoDataFound')}
                        </Label.Detail>
                    </Label>
                    <Checkbox
                        toggle
                        className='m-2'
                        id={'ispastdatemovement'}
                        checked={ispastdatemovement}
                        onClick={(e) => {
                            setIspastdatemovement(e.target.checked ? true : false)
                        }}
                        label={t('Pages.Patients.PatientsEditcaseModal.Label.Pastdatemovement')} />
                </div>
            </Modal.Header>
            <Modal.Content>
                <Contentwrapper>
                    <Form>
                        <Form.Group widths={'equal'}>
                            <FormInput page={PAGE_NAME} required placeholder={t('Pages.Patients.PatientsEditcaseModal.Label.Case')} name="CaseID" options={CaseOption} formtype='dropdown' />
                        </Form.Group>
                        {ispastdatemovement ?
                            <Form.Group widths={'equal'}>
                                <FormInput page={PAGE_NAME} required placeholder={t('Pages.Patients.PatientsEditcaseModal.Label.Occureddate')} name="Occureddate" type='datetime-local' />
                                {isNeedEndDate ?
                                    <FormInput page={PAGE_NAME} required placeholder={t('Pages.Patients.PatientsEditcaseModal.Label.Occuredenddate')} name="Occuredenddate" type='datetime-local' />
                                    : null}
                            </Form.Group>
                            : null}
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
                        if (!validator.isUUID(data?.CaseID)) {
                            errors.push({ type: 'Error', code: t('Pages.Patients.PatientsEditcaseModal.Page.Header'), description: t('Pages.Patients.PatientsEditcaseModal.Messages.CaseRequired') })
                        }
                        if (ispastdatemovement && !validator.isISODate(data?.Occureddate)) {
                            errors.push({ type: 'Error', code: t('Pages.Patients.PatientsEditcaseModal.Page.Header'), description: t('Pages.Patients.PatientsEditcaseModal.Messages.OccureddateRequired') })
                        } else {
                            if (isNeedEndDate && !validator.isISODate(data?.Occuredenddate)) {
                                errors.push({ type: 'Error', code: t('Pages.Patients.PatientsEditcaseModal.Page.Header'), description: t('Pages.Patients.PatientsEditcaseModal.Messages.OccureddateendRequired') })
                            } else {
                                if (nextmovements.length > 0) {
                                    const nextmovement = nextmovements[0]

                                    if (new Date(data?.Occuredenddate).getTime() >= new Date(nextmovement?.Occureddate).getTime()) {
                                        errors.push({ type: 'Error', code: t('Pages.Patients.PatientsEditcaseModal.Page.Header'), description: t('Pages.Patients.PatientsEditcaseModal.Messages.Occuredenddatetoobig') })
                                    }
                                }
                            }

                        }
                        if (errors.length > 0) {
                            errors.forEach(error => {
                                fillPatientnotification(error)
                            })
                        } else {
                            let body = {
                                PatientID: patient?.Uuid,
                                CaseID: data?.CaseID,
                                Ispastdate: isNeedEndDate ? true : false
                            }

                            if (ispastdatemovement) {
                                body.Occureddate = data.Occureddate
                                if (isNeedEndDate) {
                                    body.Occuredenddate = data.Occuredenddate
                                }
                            }

                            Editpatientcase({
                                data: body,
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
