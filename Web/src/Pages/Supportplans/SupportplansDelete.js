import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'
export default class SupportplansDelete extends Component {
  render() {
    const { Profile, Supportplans, DeleteSupportplans, handleDeletemodal, handleSelectedSupportplan } = this.props

    const t = Profile?.i18n?.t

    const { isDeletemodalopen, selected_record } = Supportplans
    return (
      <Modal
        onClose={() => handleDeletemodal(false)}
        onOpen={() => handleDeletemodal(true)}
        open={isDeletemodalopen}
      >
        <Modal.Header>{t('Pages.Supportplans.Page.DeleteHeader')}</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <p>
              <span className='font-bold'>{selected_record?.Name} </span>
              {t('Pages.Supportplans.Delete.Label.Check')}
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => {
            handleDeletemodal(false)
            handleSelectedSupportplan({})
          }}>
            {t('Common.Button.Giveup')}
          </Button>
          <Button
            content={t('Common.Button.Delete')}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              DeleteSupportplans(selected_record)
              handleDeletemodal(false)
              handleSelectedSupportplan({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
