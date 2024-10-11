import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'

export default class WarehousesDelete extends Component {
  render() {
    const { Profile, Warehouses, DeleteWarehouses, handleDeletemodal, handleSelectedWarehouse } = this.props
  
    const t = Profile?.i18n?.t
  
    const { isDeletemodalopen, selected_record } = Warehouses
    return (
      <Modal
        onClose={() => handleDeletemodal(false)}
        onOpen={() => handleDeletemodal(true)}
        open={isDeletemodalopen}
      >
        <Modal.Header>{t('Pages.Warehouses.Page.DeleteHeader')}</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <p>
              <span className='font-bold'>{selected_record?.Name} </span>
              {t('Pages.Warehouses.Delete.Label.Check')}
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => {
            handleDeletemodal(false)
            handleSelectedWarehouse({})
          }}>
            {t('Common.Button.Giveup')}
          </Button>
          <Button
            content={t('Common.Button.Delete')}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              DeleteWarehouses(selected_record)
              handleDeletemodal(false)
              handleSelectedWarehouse({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
