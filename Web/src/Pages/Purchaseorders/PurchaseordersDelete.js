import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'

export default class PurchaseordersDelete extends Component {
  render() {
    const { Profile, Purchaseorders, DeletePurchaseorders, handleDeletemodal, handleSelectedPurchaseorder } = this.props

    const t = Profile?.i18n?.t

    const { isDeletemodalopen, selected_record } = Purchaseorders
    return (
      <Modal
        onClose={() => handleDeletemodal(false)}
        onOpen={() => handleDeletemodal(true)}
        open={isDeletemodalopen}
      >
        <Modal.Header>{t('Pages.Purchaseorder.Page.DeleteHeader')}</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <p>
              <span className='font-bold'>{selected_record?.Purchaseno} </span>
              {t('Pages.Purchaseorder.Messages.Deletecheck')}
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => {
            handleDeletemodal(false)
            handleSelectedPurchaseorder({})
          }}>
            {t('Common.Button.Giveup')}
          </Button>
          <Button
            content={t('Common.Button.Delete')}
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
