import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'
import Literals from './Literals'

export default class CareplansDelete extends Component {

    render() {
        const { Profile, Careplans, DeleteCareplans, handleDeletemodal, handleSelectedCareplan } = this.props
        const t = Profile?.i18n?.t
        const { isDeletemodalopen, selected_record } = Careplans
        return (
            <Modal
                onClose={() => handleDeletemodal(false)}
                onOpen={() => handleDeletemodal(true)}
                open={isDeletemodalopen}
            >
                <Modal.Header>{t('Pages.Careplans.Page.Header')}</Modal.Header>
                <Modal.Content image>
                    <Modal.Description>
                        <p>
                            <span className='font-bold'>{selected_record?.Name} </span>
                            {t('Pages.Careplans.Delete.Label.Check')}
                        </p>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='black' onClick={() => {
                        handleDeletemodal(false)
                        handleSelectedCareplan({})
                    }}>
                        {t('Common.Button.Giveup')}
                    </Button>
                    <Button
                        content={t('Common.Button.Delete')}
                        labelPosition='right'
                        icon='checkmark'
                        onClick={() => {
                            DeleteCareplans(selected_record)
                            handleDeletemodal(false)
                            handleSelectedCareplan({})
                        }}
                        positive
                    />
                </Modal.Actions>
            </Modal>
        )
    }
}
