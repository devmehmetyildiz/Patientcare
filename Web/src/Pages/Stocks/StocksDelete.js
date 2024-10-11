import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'

export default class StocksDelete extends Component {
  render() {
    const { Profile, Stocks, DeleteStocks, handleDeletemodal, handleSelectedStock, Stockdefines } = this.props
    const { isDeletemodalopen, selected_record } = Stocks
    const t = Profile?.i18n?.t

    const stockdefine = (Stockdefines.list || []).find(u => u.Uuid === selected_record.StockdefineID)
    return (
      <Modal
        onClose={() => handleDeletemodal(false)}
        onOpen={() => handleDeletemodal(true)}
        open={isDeletemodalopen}
      >
        <Modal.Header>{t('Pages.Stocks.Page.DeleteHeader')}</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <p>
              <span className='font-bold'>{stockdefine?.Name} </span>
              {t('Pages.Stocks.Delete.Label.Check')}
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => {
            handleDeletemodal(false)
            handleSelectedStock({})
          }}>
            {t('Common.Button.Giveup')}
          </Button>
          <Button
            content={t('Common.Button.Delete')}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              DeleteStocks(selected_record)
              handleDeletemodal(false)
              handleSelectedStock({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
