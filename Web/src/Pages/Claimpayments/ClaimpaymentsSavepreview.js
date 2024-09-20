import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'

export default class ClaimpaymentsSavepreview extends Component {
    render() {
        const { Profile, Claimpayments, SavepreviewClaimpayments, handleSavepreviewmodal, handleSelectedClaimpayment } = this.props

        const t = Profile?.i18n?.t

        const { isSavepreviewmodalopen, selected_record } = Claimpayments

        return (
            <Modal
                onClose={() => handleSavepreviewmodal(false)}
                onOpen={() => handleSavepreviewmodal(true)}
                open={isSavepreviewmodalopen}
            >
                <Modal.Header>{t('Pages.Claimpayments.Page.SavepreviewHeader')}</Modal.Header>
                <Modal.Content image>
                    <Modal.Description>
                        <p>
                            <span className='font-bold'>{selected_record?.Name || t('Common.NoDataFound')} </span>
                            {t('Pages.Claimpayments.Savepreview.Label.Check')}
                        </p>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='black' onClick={() => {
                        handleSavepreviewmodal(false)
                        handleSelectedClaimpayment({})
                    }}>
                        {t('Common.Button.Giveup')}
                    </Button>
                    <Button
                        content={t('Common.Button.Save')}
                        labelPosition='right'
                        icon='checkmark'
                        onClick={() => {
                            SavepreviewClaimpayments(selected_record)
                            handleSavepreviewmodal(false)
                            handleSelectedClaimpayment({})
                        }}
                        positive
                    />
                </Modal.Actions>
            </Modal>
        )
    }
}
