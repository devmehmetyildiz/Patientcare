import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'
export default class CasesDelete extends Component {

    render() {
        const { Profile, Cases, DeleteCases, handleDeletemodal, handleSelectedCase } = this.props
        const t = Profile?.i18n?.t
        const { isDeletemodalopen, selected_record } = Cases
        return (
            <Modal
                onClose={() => handleDeletemodal(false)}
                onOpen={() => handleDeletemodal(true)}
                open={isDeletemodalopen}
            >
                <Modal.Header>{t('Pages.Cases.Page.DeleteHeader')}</Modal.Header>
                <Modal.Content image>
                    <Modal.Description>
                        <p>
                            <span className='font-bold'>{selected_record?.Name} </span>
                            {t('Pages.Cases.Delete.Label.Check')}
                        </p>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='black' onClick={() => {
                        handleDeletemodal(false)
                        handleSelectedCase({})
                    }}>
                        {t('Common.Button.Giveup')}
                    </Button>
                    <Button
                        content={t('Common.Button.Delete')}
                        labelPosition='right'
                        icon='checkmark'
                        onClick={() => {
                            DeleteCases(selected_record)
                            handleDeletemodal(false)
                            handleSelectedCase({})
                        }}
                        positive
                    />
                </Modal.Actions>
            </Modal>
        )
    }
}
