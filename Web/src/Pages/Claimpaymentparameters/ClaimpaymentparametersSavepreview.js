import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'
import { CLAIMPAYMENT_TYPE_BHKS, CLAIMPAYMENT_TYPE_KYS, CLAIMPAYMENT_TYPE_PATIENT } from '../../Utils/Constants'

export default class ClaimpaymentparametersSavepreview extends Component {
    render() {
        const { Profile, Claimpaymentparameters, SavepreviewClaimpaymentparameters, handleSavepreviewmodal, handleSelectedClaimpaymentparameter, } = this.props

        const t = Profile?.i18n?.t

        const { isSavepreviewmodalopen, selected_record } = Claimpaymentparameters

        const Claimpaymenttypes = [
            { key: 1, text: t('Common.Claimpayments.Type.Patient'), value: CLAIMPAYMENT_TYPE_PATIENT },
            { key: 2, text: t('Common.Claimpayments.Type.Bhks'), value: CLAIMPAYMENT_TYPE_BHKS },
            { key: 3, text: t('Common.Claimpayments.Type.Kys'), value: CLAIMPAYMENT_TYPE_KYS },
        ]

        const type = Claimpaymenttypes.find(u => u.value === selected_record?.Type)?.text || t('Common.NoDataFound')

        return (
            <Modal
                onClose={() => handleSavepreviewmodal(false)}
                onOpen={() => handleSavepreviewmodal(true)}
                open={isSavepreviewmodalopen}
            >
                <Modal.Header>{t('Pages.Claimpaymentparameters.Page.SavepreviewHeader')}</Modal.Header>
                <Modal.Content image>
                    <Modal.Description>
                        <p>
                            <span className='font-bold'>{type} </span>
                            {t('Pages.Claimpaymentparameters.Savepreview.Label.Check')}
                        </p>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='black' onClick={() => {
                        handleSavepreviewmodal(false)
                        handleSelectedClaimpaymentparameter({})
                    }}>
                        {t('Common.Button.Giveup')}
                    </Button>
                    <Button
                        content={t('Common.Button.Save')}
                        labelPosition='right'
                        icon='checkmark'
                        onClick={() => {
                            SavepreviewClaimpaymentparameters(selected_record)
                            handleSavepreviewmodal(false)
                            handleSelectedClaimpaymentparameter({})
                        }}
                        positive
                    />
                </Modal.Actions>
            </Modal>
        )
    }
}
