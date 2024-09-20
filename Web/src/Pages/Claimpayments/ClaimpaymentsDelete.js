import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'

export default class ClaimpaymentsDelete extends Component {
  render() {
    const { Profile, Claimpayments, DeleteClaimpayments, handleDeletemodal, handleSelectedClaimpayment } = this.props

    const t = Profile?.i18n?.t

    const { isDeletemodalopen, selected_record } = Claimpayments

    return (
      <Modal
        onClose={() => handleDeletemodal(false)}
        onOpen={() => handleDeletemodal(true)}
        open={isDeletemodalopen}
      >
        <Modal.Header>{t('Pages.Claimpayments.Page.DeleteHeader')}</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <p>
              <span className='font-bold'>{selected_record?.Name} </span>
              {t('Pages.Claimpayments.Delete.Label.Check')}
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => {
            handleDeletemodal(false)
            handleSelectedClaimpayment({})
          }}>
            {t('Common.Button.Giveup')}
          </Button>
          <Button
            content={t('Common.Button.Delete')}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              DeleteClaimpayments(selected_record)
              handleDeletemodal(false)
              handleSelectedClaimpayment({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
