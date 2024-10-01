import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'

export default class SupportplanlistsDelete extends Component {

  render() {
    const { Profile, Supportplanlists, DeleteSupportplanlists, handleDeletemodal, handleSelectedSupportplanlist } = this.props

    const t = Profile?.i18n?.t

    const { isDeletemodalopen, selected_record } = Supportplanlists
    return (
      <Modal
        onClose={() => handleDeletemodal(false)}
        onOpen={() => handleDeletemodal(true)}
        open={isDeletemodalopen}
      >
        <Modal.Header>{t('Pages.Supportplanlists.Page.DeleteHeader')}</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <p>
              <span className='font-bold'>{selected_record?.Name} </span>
              {t('Pages.Supportplanlists.Delete.Label.Check')}
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => {
            handleDeletemodal(false)
            handleSelectedSupportplanlist({})
          }}>
            {t('Common.Button.Giveup')}
          </Button>
          <Button
            content={t('Common.Button.Delete')}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              DeleteSupportplanlists(selected_record)
              handleDeletemodal(false)
              handleSelectedSupportplanlist({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
