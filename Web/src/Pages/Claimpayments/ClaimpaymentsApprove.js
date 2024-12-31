import React from 'react'
import { Button, Modal } from 'semantic-ui-react'

export default function ClaimpaymentsApprove(props) {

    const { Profile, Claimpayments, ApproveClaimpayments, open, setOpen, record, setRecord } = props

    const t = Profile?.i18n?.t

    return (
        <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
        >
            <Modal.Header>{t('Pages.Claimpayments.Page.ApproveHeader')}</Modal.Header>
            <Modal.Content image>
                <Modal.Description>
                    <p>
                        <span className='font-bold'>{record?.Name || t('Common.NoDataFound')} </span>
                        {t('Pages.Claimpayments.Approve.Label.Check')}
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
                    loading={Claimpayments.isLoading}
                    content={t('Common.Button.Approve')}
                    labelPosition='right'
                    icon='checkmark'
                    onClick={() => {
                        ApproveClaimpayments(record)
                        setOpen(false)
                        setRecord(null)
                    }}
                    positive
                />
            </Modal.Actions>
        </Modal>
    )
}
