import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'

export default class StockmovementsApprove extends Component {
  render() {
    const { Profile, Stockmovements, ApproveStockmovements, handleApprovemodal, handleSelectedStockmovement, Stockdefines, Stocks } = this.props
    const { isApprovemodalopen, selected_record } = Stockmovements
    const t = Profile?.i18n?.t

    const stock = (Stocks.list || []).find(u => u.Uuid === selected_record.StockID)
    const stockdefine = (Stockdefines.list || []).find(u => u.Uuid === stock?.StockdefineID)

    return (
      <Modal
        onClose={() => handleApprovemodal(false)}
        onOpen={() => handleApprovemodal(true)}
        open={isApprovemodalopen}
      >
        <Modal.Header>{t('Pages.Stockmovements.Page.ApproveHeader')}</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <p>
              <span className='font-bold'>{stockdefine?.Name} </span>
              {t('Pages.Stockmovements.Approve.Label.Check')}
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => {
            handleApprovemodal(false)
            handleSelectedStockmovement({})
          }}>
            {t('Common.Button.Giveup')}
          </Button>
          <Button
            content={t('Common.Button.Approve')}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              ApproveStockmovements(selected_record)
              handleApprovemodal(false)
              handleSelectedStockmovement({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
