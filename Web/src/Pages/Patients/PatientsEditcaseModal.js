import React, { useContext, useEffect } from 'react'
import { Button, Form, Label, Modal } from 'semantic-ui-react'
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
                <div className='w-full flex justify-start items-center'>
                    <Label className='!bg-[#2355a0] !text-white' size='big'>{`${t('Pages.Patients.PatientsEditcaseModal.Label.Oldcase')}`}
                        <Label.Detail>
                            {selectedCase?.Name || t('Common.NoDataFound')}
                        </Label.Detail>
                    </Label>
                </div>
            </Modal.Header>
            <Modal.Content>
                <Contentwrapper>
                    <Form>
                        <Form.Group widths={'equal'}>
                            <FormInput page={PAGE_NAME} required placeholder={t('Pages.Patients.PatientsEditcaseModal.Label.Case')} name="CaseID" options={CaseOption} formtype='dropdown' />
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
                        if (!validator.isUUID(data?.CaseID)) {
                            errors.push({ type: 'Error', code: t('Pages.Patients.PatientsEditcaseModal.Page.Header'), description: t('Pages.Patients.PatientsEditcaseModal.Messages.CaseRequired') })
                        }
                        if (errors.length > 0) {
                            errors.forEach(error => {
                                fillPatientnotification(error)
                            })
                        } else {
                            Editpatientcase({
                                data: {
                                    PatientID: patient?.Uuid,
                                    CaseID: data?.CaseID,
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
