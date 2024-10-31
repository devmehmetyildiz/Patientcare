import React from 'react'
import { useSelector } from 'react-redux'
import { Button, Dimmer, DimmerDimmable, Loader, Modal } from 'semantic-ui-react'
import { useSavePreviewSurveyMutation } from '../../Api/Features/Survey'

export default function SurveysSavepreview(props) {

    const { open, setOpen, record, setRecord } = props
    const Profile = useSelector(state => state.Profile)

    const t = Profile?.i18n?.t

    const [SavepreviewSurvey, { isLoading }] = useSavePreviewSurveyMutation()

    return (
        <DimmerDimmable blurring >
            <Modal
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                open={open}
            >
                <Modal.Header >{t('Pages.Surveys.Page.SavepreviewHeader')}</Modal.Header>
                <Modal.Content image>
                    <Dimmer inverted active={isLoading}>
                        <Loader inverted active />
                    </Dimmer>
                    <Modal.Description>
                        <p>
                            <span className='font-bold'>{record?.Name} </span>
                            {t('Pages.Surveys.Savepreview.Label.Check')}
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
                            SavepreviewSurvey({
                                surveyID: record?.Uuid || '',
                                onSuccess: () => {
                                    setOpen(false)
                                    setRecord(null)
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
