import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'

export default class StockdefinesDelete extends Component {
  render() {
    const { Profile, Stockdefines, DeleteStockdefines, handleDeletemodal, handleSelectedStockdefine } = this.props

    const t = Profile?.i18n?.t

    const { isDeletemodalopen, selected_record } = Stockdefines
    return (
      <Modal
        onClose={() => handleDeletemodal(false)}
        onOpen={() => handleDeletemodal(true)}
        open={isDeletemodalopen}
      >
        <Modal.Header>{t('Pages.Stockdefines.Page.DeleteHeader')}</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <p>
              <span className='font-bold'>{selected_record?.Name} </span>
              {t('Pages.Stockdefines.Delete.Label.Check')}
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => {
            handleDeletemodal(false)
            handleSelectedStockdefine({})
          }}>
            {t('Common.Button.Giveup')}
          </Button>
          <Button
            content={t('Common.Button.Delete')}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              DeleteStockdefines(selected_record)
              handleDeletemodal(false)
              handleSelectedStockdefine({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
