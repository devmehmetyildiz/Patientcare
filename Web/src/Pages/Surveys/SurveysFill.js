import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Button, Dimmer, DimmerDimmable, Loader, Modal } from 'semantic-ui-react'
import { useLazyGetUsersQuery } from '../../Api/Features/Users'
import { SURVEY_TYPE_PATIENT, SURVEY_TYPE_PATIENTCONTACT, SURVEY_TYPE_USER } from '../../Utils/Constants'

export default function SurveysFill(props) {

    const { open, setOpen, record, setRecord } = props
    const Profile = useSelector(state => state.Profile)

    const [GetUsers, { data: Users, isLoading: isUserLoading }] = useLazyGetUsersQuery()

    useEffect(() => {
        if (open) {
            switch (record?.Type) {
                case SURVEY_TYPE_PATIENT:

                    break;
                case SURVEY_TYPE_PATIENTCONTACT:

                    break;
                case SURVEY_TYPE_USER:
                    GetUsers()
                    break;
                default:
                    break;
            }
        }
    }, [open])

    const t = Profile?.i18n?.t

    return (
        <DimmerDimmable blurring >
            <Modal
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                open={open}
            >
                <Modal.Header >{t('Pages.Surveys.Page.FillHeader')}</Modal.Header>
                <Modal.Content image>
                    <Dimmer inverted active={isUserLoading}>
                        <Loader inverted active />
                    </Dimmer>
                    <Modal.Description>
                        <p>
                            <span className='font-bold'>{record?.Name} </span>
                            {t('Pages.Surveys.Approve.Label.Check')}
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
                        content={t('Common.Button.Fill')}
                        labelPosition='right'
                        icon='checkmark'
                        onClick={() => {

                        }}
                        positive
                    />
                </Modal.Actions>
            </Modal>
        </DimmerDimmable>
    )
}
