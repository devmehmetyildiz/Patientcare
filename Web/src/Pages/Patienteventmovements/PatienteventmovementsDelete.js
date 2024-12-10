import React from 'react'
import { Button, Dimmer, DimmerDimmable, Loader, Modal } from 'semantic-ui-react'

export default function PatienteventmovementsDelete(props) {

    const { open, setOpen, record, setRecord, Patienteventmovements, Patienteventdefines, Patients, Patientdefines, Profile, DeletePatienteventmovements, GetPatienteventmovements, afterSuccess } = props

    const t = Profile?.i18n?.t

    const patient = (Patients.list || []).find(u => u.Uuid === record?.PatientID)
    const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)
    const eventdefine = (Patienteventdefines.list || []).find(u => u.Uuid === record?.EventID)

    const name = `${patientdefine?.Firstname} ${patientdefine?.Lastname} - ${eventdefine?.Eventname}`

    return (
        <DimmerDimmable blurring >
            <Modal
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                open={open}
            >
                <Modal.Header >{t('Pages.Patienteventmovements.Page.DeleteHeader')}</Modal.Header>
                <Modal.Content image>
                    <Dimmer inverted active={Patienteventmovements.isLoading}>
                        <Loader inverted active />
                    </Dimmer>
                    <Modal.Description>
                        <p>
                            <span className='font-bold'>{name} </span>
                            {t('Pages.Patienteventmovements.Delete.Label.Check')}
                        </p>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='black' onClick={() => {
                        setOpen(false)
                        setRecord(null)
                    }}>
                        {t('Common.Button.Giveup')}
                    </Button>
                    <Button
                        loading={Patienteventmovements.isLoading}
                        content={t('Common.Button.Delete')}
                        labelPosition='right'
                        icon='checkmark'
                        onClick={() => {
                            DeletePatienteventmovements({
                                patienteventmovementID: record?.Uuid || '',
                                onSuccess: () => {
                                    setOpen(false)
                                    setRecord(null)
                                    GetPatienteventmovements()

                                    afterSuccess && afterSuccess()
                                }
                            })
                        }}
                        positive
                    />
                </Modal.Actions>
            </Modal>
        </DimmerDimmable>
    )
}
