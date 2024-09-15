import React, { useContext, useEffect } from 'react'
import { Button, Form, Modal } from 'semantic-ui-react'
import { Contentwrapper, FormInput } from '../../Components'
import { CASE_PATIENT_STATUS_DEATH, CASE_PATIENT_STATUS_LEFT } from '../../Utils/Constants'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'

export default function PatientsMakeactiveModal(props) {
    const PAGE_NAME = 'PatientsMakeactiveModal'
    const context = useContext(FormContext)
    const { open, setOpen, record, setRecord, Profile, Patientdefines, Cases, Departments, MakeactivePatients, fillPatientnotification, GetCases, GetDepartments } = props
    const t = Profile?.i18n?.t || null

    const Uuid = record?.Uuid
    const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === record?.PatientdefineID)
    const patientName = patientdefine ? `${patientdefine?.Firstname} ${patientdefine?.Lastname} - ${patientdefine?.CountryID}` : t('Common.NoDataFound')

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


    useEffect(() => {
        if (!open) {
            context.clearForm(PAGE_NAME)
            GetDepartments()
            GetCases()
        }
    }, [open])

    return <Modal
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
    >
        <Modal.Header>{t('Pages.Patients.PatientsMakeactiveModal.Page.Header')}</Modal.Header>
        <Modal.Header>{patientName}</Modal.Header>
        <Modal.Content className='w-full' image>
            {open ?
                <Contentwrapper>
                    <Form>
                        <Form.Group widths='equal'>
                            <FormInput page={PAGE_NAME} required placeholder={t('Pages.Patients.PatientsMakeactiveModal.Column.Case')} name="CaseID" options={CaseOption} formtype='dropdown' />
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
                content={t('Common.Button.Activate')}
                labelPosition='right'
                className='!bg-[#2355a0] !text-white'
                icon='checkmark'
                onClick={() => {
                    const data = context.getForm(PAGE_NAME)
                    let errors = []
                    if (!validator.isUUID(data.CaseID)) {
                        errors.push({ type: 'Error', code: t('Pages.Patients.PatientsMakeactiveModal.Page.Header'), description: t('Pages.Patients.PatientsMakeactiveModal.Messages.CaseRequired') })
                    }

                    if (errors.length > 0) {
                        errors.forEach(error => {
                            fillPatientnotification(error)
                        })
                    } else {
                        MakeactivePatients({
                            Uuid: Uuid,
                            CaseID: data.CaseID,
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
