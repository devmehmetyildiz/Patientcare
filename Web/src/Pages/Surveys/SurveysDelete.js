import React from 'react'
import { Button, Dimmer, DimmerDimmable, Loader, Modal } from 'semantic-ui-react'

export default function SurveysDelete(props) {

    const { open, setOpen, record, setRecord, Surveys, Profile, DeleteSurveys, GetSurveys } = props

    const t = Profile?.i18n?.t

    return (
        <DimmerDimmable blurring >
            <Modal
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                open={open}
            >
                <Modal.Header >{t('Pages.Surveys.Page.DeleteHeader')}</Modal.Header>
                <Modal.Content image>
                    <Dimmer inverted active={Surveys.isLoading}>
                        <Loader inverted active />
                    </Dimmer>
                    <Modal.Description>
                        <p>
                            <span className='font-bold'>{record?.Name} </span>
                            {t('Pages.Surveys.Delete.Label.Check')}
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
                        content={t('Common.Button.Delete')}
                        labelPosition='right'
                        icon='checkmark'
                        onClick={() => {
                            DeleteSurveys({
                                surveyID: record?.Uuid || '',
                                onSuccess: () => {
                                    setOpen(false)
                                    setRecord(null)
                                    GetSurveys()
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
