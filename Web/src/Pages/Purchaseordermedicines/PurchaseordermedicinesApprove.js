import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'
import Literals from './Literals'

export default class PurchaseordermedicinesApprove extends Component {
  render() {
    const { Profile, Purchaseorderstocks, ApprovePurchaseorderstocks, handleApprovemodal, handleSelectedPurchaseorderstock, Stockdefines } = this.props
    const { isApprovemodalopen, selected_record } = Purchaseorderstocks

    const stockdefine = (Stockdefines.list || []).find(u => u.Uuid === selected_record.StockdefineID)
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
            handleSelectedPurchaseorderstock({})
          }}>
            {Literals.Button.Giveup[Profile.Language]}
          </Button>
          <Button
            content={Literals.Button.Approve[Profile.Language]}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              ApprovePurchaseorderstocks(selected_record)
              handleApprovemodal(false)
              handleSelectedPurchaseorderstock({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
