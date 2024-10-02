import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'

export default class CareplansSavepreview extends Component {
  render() {
    const { Profile, Careplans, SavepreviewCareplans, handleSavepreviewmodal, handleSelectedCareplan, } = this.props
    const t = Profile?.i18n?.t
    const { isSavepreviewmodalopen, selected_record } = Careplans

    return (
      <Modal
        onClose={() => handleSavepreviewmodal(false)}
        onOpen={() => handleSavepreviewmodal(true)}
        open={isSavepreviewmodalopen}
      >
        <Modal.Header>{t('Pages.Careplans.Page.Header')}</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <p>
              {t('Pages.Careplans.Savepreview.Label.Check')}
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => {
            handleSavepreviewmodal(false)
            handleSelectedCareplan({})
          }}>
            {t('Common.Button.Giveup')}
          </Button>
          <Button
            content={t('Common.Button.Savepreview')}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              SavepreviewCareplans(selected_record)
              handleSavepreviewmodal(false)
              handleSelectedCareplan({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
