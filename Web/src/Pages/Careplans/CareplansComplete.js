import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'

export default class CareplansComplete extends Component {
  render() {
    const { Profile, Careplans, CompleteCareplans, handleCompletemodal, handleSelectedCareplan, } = this.props
    const t = Profile?.i18n?.t
    const { isCompletemodalopen, selected_record } = Careplans

    return (
      <Modal
        onClose={() => handleCompletemodal(false)}
        onOpen={() => handleCompletemodal(true)}
        open={isCompletemodalopen}
      >
        <Modal.Header>{t('Pages.Careplans.Page.Header')}</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <p>
              {t('Pages.Careplans.Complete.Label.Check')}
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => {
            handleCompletemodal(false)
            handleSelectedCareplan({})
          }}>
            {t('Common.Button.Giveup')}
          </Button>
          <Button
            content={t('Common.Button.Complete')}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              CompleteCareplans(selected_record)
              handleCompletemodal(false)
              handleSelectedCareplan({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
