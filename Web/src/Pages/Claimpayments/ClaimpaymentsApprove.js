import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'

export default class ClaimpaymentsApprove extends Component {
    render() {
        const { Profile, Claimpayments, ApproveClaimpayments, handleApprovemodal, handleSelectedClaimpayment } = this.props

        const t = Profile?.i18n?.t

        const { isApprovemodalopen, selected_record } = Claimpayments

        return (
            <Modal
                onClose={() => handleApprovemodal(false)}
                onOpen={() => handleApprovemodal(true)}
                open={isApprovemodalopen}
            >
                <Modal.Header>{t('Pages.Claimpayments.Page.ApproveHeader')}</Modal.Header>
                <Modal.Content image>
                    <Modal.Description>
                        <p>
                            <span className='font-bold'>{selected_record?.Name || t('Common.NoDataFound')} </span>
                            {t('Pages.Claimpayments.Approve.Label.Check')}
                        </p>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='black' onClick={() => {
                        handleApprovemodal(false)
                        handleSelectedClaimpayment({})
                    }}>
                        {t('Common.Button.Giveup')}
                    </Button>
                    <Button
                        content={t('Common.Button.Approve')}
                        labelPosition='right'
                        icon='checkmark'
                        onClick={() => {
                            ApproveClaimpayments(selected_record)
                            handleApprovemodal(false)
                            handleSelectedClaimpayment({})
                        }}
                        positive
                    />
                </Modal.Actions>
            </Modal>
        )
    }
}
