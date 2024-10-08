import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'

export default class CareplansApprove extends Component {
  render() {
    const { Profile, Careplans, ApproveCareplans, handleApprovemodal, handleSelectedCareplan, } = this.props
    const t = Profile?.i18n?.t
    const { isApprovemodalopen, selected_record } = Careplans

    return (
      <Modal
        onClose={() => handleApprovemodal(false)}
        onOpen={() => handleApprovemodal(true)}
        open={isApprovemodalopen}
      >
        <Modal.Header>{t('Pages.Careplans.Page.Header')}</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <p>
              {t('Pages.Careplans.Approve.Label.Check')}
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => {
            handleApprovemodal(false)
            handleSelectedCareplan({})
          }}>
            {t('Common.Button.Giveup')}
          </Button>
          <Button
            content={t('Common.Button.Approve')}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              ApproveCareplans(selected_record)
              handleApprovemodal(false)
              handleSelectedCareplan({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
