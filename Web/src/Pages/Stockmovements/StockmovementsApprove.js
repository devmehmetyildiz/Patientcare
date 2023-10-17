import React, { Component } from 'react'
import Literals from './Literals'
import { Button, Modal } from 'semantic-ui-react'

export default class StockmovementsApprove extends Component {
  render() {
    const { Profile, Stockmovements, ApproveStockmovements, handleApprovemodal, handleSelectedStockmovement, Stockdefines, Stocks } = this.props
    const { isApprovemodalopen, selected_record } = Stockmovements

    const stock = (Stocks.list || []).find(u => u.Uuid === selected_record.StockID)
    const stockdefine = (Stockdefines.list || []).find(u => u.Uuid === stock?.StockdefineID)

    return (
      <Modal
        onClose={() => handleApprovemodal(false)}
        onOpen={() => handleApprovemodal(true)}
        open={isApprovemodalopen}
      >
        <Modal.Header>{Literals.Page.Pageapproveheader[Profile.Language]}</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <p>
              <span className='font-bold'>{stockdefine?.Name} </span>
              {Literals.Messages.Approvecheck[Profile.Language]}
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => {
            handleApprovemodal(false)
            handleSelectedStockmovement({})
          }}>
            {Literals.Button.Giveup[Profile.Language]}
          </Button>
          <Button
            content={Literals.Button.Approve[Profile.Language]}
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
