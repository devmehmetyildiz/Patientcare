import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'
export default class MailsettingsDelete extends Component {
  render() {
    const { Profile, Mailsettings, DeleteMailsettings, handleDeletemodal, handleSelectedMailsetting } = this.props

    const t = Profile?.i18n?.t

    const { isDeletemodalopen, selected_record } = Mailsettings
    return (
      <Modal
        onClose={() => handleDeletemodal(false)}
        onOpen={() => handleDeletemodal(true)}
        open={isDeletemodalopen}
      >
        <Modal.Header>{t('Pages.Mailsettings.Page.DeleteHeader')}</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <p>
              <span className='font-bold'>{selected_record?.Name} </span>
              {t('Pages.Mailsettings.Delete.Label.Check')}
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => {
            handleDeletemodal(false)
            handleSelectedMailsetting({})
          }}>
            {t('Common.Button.Giveup')}
          </Button>
          <Button
            content={t('Common.Button.Delete')}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              DeleteMailsettings(selected_record)
              handleDeletemodal(false)
              handleSelectedMailsetting({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
