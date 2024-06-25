import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'
import Literals from './Literals'

export default class PurchaseordersDelete extends Component {
  render() {
    const { Profile, Purchaseorders, DeletePurchaseorders, handleDeletemodal, handleSelectedPurchaseorder } = this.props
    const { isDeletemodalopen, selected_record } = Purchaseorders
    return (
      <Modal
        onClose={() => handleDeletemodal(false)}
        onOpen={() => handleDeletemodal(true)}
        open={isDeletemodalopen}
      >
        <Modal.Header>{Literals.Page.Pagedeleteheader[Profile.Language]}</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <p>
              <span className='font-bold'>{selected_record?.Purchaseno} </span>
              {Literals.Messages.Deletecheck[Profile.Language]}
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => {
            handleDeletemodal(false)
            handleSelectedPurchaseorder({})
          }}>
            {Literals.Button.Giveup[Profile.Language]}
          </Button>
          <Button
            content={Literals.Button.Delete[Profile.Language]}
            labelPosition='right'
            icon='checkmark'
            className=' !bg-[#2355a0] !text-white'
            onClick={() => {
              DeletePurchaseorders(selected_record)
              handleDeletemodal(false)
              handleSelectedPurchaseorder({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
