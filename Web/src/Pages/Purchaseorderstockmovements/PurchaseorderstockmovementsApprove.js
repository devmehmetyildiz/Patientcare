import React, { Component } from 'react'
import Literals from './Literals'
import { Button, Modal } from 'semantic-ui-react'

export default class PurchaseorderstockmovementsApprove extends Component {
  render() {
    const { Profile, Purchaseorderstockmovements, ApprovePurchaseorderstockmovements, handleApprovemodal, handleSelectedPurchaseorderstockmovement, Stockdefines, Purchaseorderstocks } = this.props
    const { isApprovemodalopen, selected_record } = Purchaseorderstockmovements

    const stock = (Purchaseorderstocks.list || []).find(u => u.Uuid === selected_record.StockID)
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
            handleSelectedPurchaseorderstockmovement({})
          }}>
            {Literals.Button.Giveup[Profile.Language]}
          </Button>
          <Button
            content={Literals.Button.Approve[Profile.Language]}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              ApprovePurchaseorderstockmovements(selected_record)
              handleApprovemodal(false)
              handleSelectedPurchaseorderstockmovement({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
