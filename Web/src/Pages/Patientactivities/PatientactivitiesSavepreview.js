import React from 'react'
import { Button, Dimmer, DimmerDimmable, Loader, Modal } from 'semantic-ui-react'

export default function PatientactivitiesSavepreview(props) {

    const { open, setOpen, record, setRecord, Patientactivities, Profile, SavepreviewPatientactivities, GetPatientactivities } = props

    const t = Profile?.i18n?.t

    return (
        <DimmerDimmable blurring >
            <Modal
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                open={open}
            >
                <Modal.Header >{t('Pages.Patientactivities.Page.SavepreviewHeader')}</Modal.Header>
                <Modal.Content image>
                    <Dimmer inverted active={Patientactivities.isLoading}>
                        <Loader inverted active />
                    </Dimmer>
                    <Modal.Description>
                        <p>
                            <span className='font-bold'>{record?.Name} </span>
                            {t('Pages.Patientactivities.Savepreview.Label.Check')}
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
                        content={t('Common.Button.Savepreview')}
                        labelPosition='right'
                        icon='checkmark'
                        onClick={() => {
                            SavepreviewPatientactivities({
                                patientactivityID: record?.Uuid || '',
                                onSuccess: () => {
                                    setOpen(false)
                                    setRecord(null)
                                    GetPatientactivities()
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
