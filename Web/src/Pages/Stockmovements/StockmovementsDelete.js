import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'

export default class StockmovementsDelete extends Component {
  render() {
    const { Profile, Stockmovements, DeleteStockmovements, handleDeletemodal, handleSelectedStockmovement } = this.props

    const t = Profile?.i18n?.t
    const { isDeletemodalopen, selected_record } = Stockmovements
    return (
      <Modal
        onClose={() => handleDeletemodal(false)}
        onOpen={() => handleDeletemodal(true)}
        open={isDeletemodalopen}
      >
        <Modal.Header>{t('Pages.Stockmovements.Page.DeleteHeader')}</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <p>
              {t('Pages.Stockmovements.Delete.Label.Check')}
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => {
            handleDeletemodal(false)
            handleSelectedStockmovement({})
          }}>
            {t('Common.Button.Giveup')}
          </Button>
          <Button
            content={t('Common.Button.Delete')}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              DeleteStockmovements(selected_record)
              handleDeletemodal(false)
              handleSelectedStockmovement({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
