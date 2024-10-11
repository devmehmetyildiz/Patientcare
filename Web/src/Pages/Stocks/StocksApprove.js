import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'
export default class StocksApprove extends Component {
  render() {
    const { Profile, Stocks, ApproveStocks, handleApprovemodal, handleSelectedStock, Stockdefines } = this.props
    const t = Profile?.i18n?.t

    const { isApprovemodalopen, selected_record } = Stocks

    const stockdefine = (Stockdefines.list || []).find(u => u.Uuid === selected_record.StockdefineID)
    return (
      <Modal
        onClose={() => handleApprovemodal(false)}
        onOpen={() => handleApprovemodal(true)}
        open={isApprovemodalopen}
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
            handleApprovemodal(false)
            handleSelectedStock({})
          }}>
            {t('Common.Button.Giveup')}
          </Button>
          <Button
            content={t('Common.Button.Approve')}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              ApproveStocks(selected_record)
              handleApprovemodal(false)
              handleSelectedStock({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
