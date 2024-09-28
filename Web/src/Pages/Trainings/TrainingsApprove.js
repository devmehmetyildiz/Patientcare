import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'

export default class TrainingsApprove extends Component {
    render() {
        const { Profile, Trainings, ApproveTrainings, handleApprovemodal, handleSelectedTraining } = this.props

        const t = Profile?.i18n?.t

        const { isApprovemodalopen, selected_record } = Trainings

        return (
            <Modal
                onClose={() => handleApprovemodal(false)}
                onOpen={() => handleApprovemodal(true)}
                open={isApprovemodalopen}
            >
                <Modal.Header>{t('Pages.Trainings.Page.ApproveHeader')}</Modal.Header>
                <Modal.Content image>
                    <Modal.Description>
                        <p>
                            <span className='font-bold'>{selected_record?.Name || t('Common.NoDataFound')} </span>
                            {t('Pages.Trainings.Approve.Label.Check')}
                        </p>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='black' onClick={() => {
                        handleApprovemodal(false)
                        handleSelectedTraining({})
                    }}>
                        {t('Common.Button.Giveup')}
                    </Button>
                    <Button
                        content={t('Common.Button.Approve')}
                        labelPosition='right'
                        icon='checkmark'
                        onClick={() => {
                            ApproveTrainings(selected_record)
                            handleApprovemodal(false)
                            handleSelectedTraining({})
                        }}
                        positive
                    />
                </Modal.Actions>
            </Modal>
        )
    }
}
