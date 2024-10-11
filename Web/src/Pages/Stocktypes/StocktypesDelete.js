import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'

export default class StocktypesDelete extends Component {
  render() {
    const { Profile, Stocktypes, DeleteStocktypes, handleDeletemodal, handleSelectedStocktype } = this.props

    const t = Profile?.i18n?.t

    const { isDeletemodalopen, selected_record } = Stocktypes
    return (
      <Modal
        onClose={() => handleDeletemodal(false)}
        onOpen={() => handleDeletemodal(true)}
        open={isDeletemodalopen}
      >
        <Modal.Header>{t('Pages.Stocktypes.Page.Header')}</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <p>
              <span className='font-bold'>{selected_record?.Name} </span>
              {t('Pages.Stocktypes.Delete.Label.Check')}
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => {
            handleDeletemodal(false)
            handleSelectedStocktype({})
          }}>
            {t('Common.Button.Giveup')}
          </Button>
          <Button
            content={t('Common.Button.Delete')}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              DeleteStocktypes(selected_record)
              handleDeletemodal(false)
              handleSelectedStocktype({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
