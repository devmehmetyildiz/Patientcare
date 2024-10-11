import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'

export default class PrinttemplatesDelete extends Component {
  render() {
    const { Profile, Printtemplates, DeletePrinttemplates, handleDeletemodal, handleSelectedPrinttemplate } = this.props

    const t = Profile?.i18n?.t

    const { isDeletemodalopen, selected_record } = Printtemplates
    return (
      <Modal
        onClose={() => handleDeletemodal(false)}
        onOpen={() => handleDeletemodal(true)}
        open={isDeletemodalopen}
      >
        <Modal.Header>{t('Pages.Printtemplates.Page.DeleteHeader')}</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <p>
              <span className='font-bold'>{selected_record?.Name} </span>
              {t('Pages.Printtemplates.Delete.Label.Check')}
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => {
            handleDeletemodal(false)
            handleSelectedPrinttemplate({})
          }}>
            {t('Common.Button.Giveup')}
          </Button>
          <Button
            content={t('Common.Button.Delete')}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              DeletePrinttemplates(selected_record)
              handleDeletemodal(false)
              handleSelectedPrinttemplate({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
