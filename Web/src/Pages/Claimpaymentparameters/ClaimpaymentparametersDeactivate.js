import React from 'react'
import { Button, Modal } from 'semantic-ui-react'
import { CLAIMPAYMENT_TYPE_BHKS, CLAIMPAYMENT_TYPE_KYS, CLAIMPAYMENT_TYPE_PATIENT } from '../../Utils/Constants'

export default function ClaimpaymentparametersDeactivate(props) {
    const { Profile, Claimpaymentparameters, DeactivateClaimpaymentparameters, open, setOpen, record, setRecord } = props

    const t = Profile?.i18n?.t

    const Claimpaymenttypes = [
        { key: 1, text: t('Common.Claimpayments.Type.Patient'), value: CLAIMPAYMENT_TYPE_PATIENT },
        { key: 2, text: t('Common.Claimpayments.Type.Bhks'), value: CLAIMPAYMENT_TYPE_BHKS },
        { key: 3, text: t('Common.Claimpayments.Type.Kys'), value: CLAIMPAYMENT_TYPE_KYS },
    ]

    const type = Claimpaymenttypes.find(u => u.value === record?.Type)?.text || t('Common.NoDataFound')

    return (
        <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
        >
            <Modal.Header>{t('Pages.Claimpaymentparameters.Page.DeactivateHeader')}</Modal.Header>
            <Modal.Content image>
                <Modal.Description>
                    <p>
                        <span className='font-bold'>{type} </span>
                        {t('Pages.Claimpaymentparameters.Deactivate.Label.Check')}
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
                    loading={Claimpaymentparameters.isLoading}
                    content={t('Common.Button.Deactivate')}
                    labelPosition='right'
                    icon='checkmark'
                    onClick={() => {
                        DeactivateClaimpaymentparameters(record)
                        setOpen(false)
                        setRecord(null)
                    }}
                    positive
                />
            </Modal.Actions>
        </Modal>
    )
}