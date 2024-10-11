import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'

export default class EquipmentsDelete extends Component {
  render() {
    const { Profile, Equipments, DeleteEquipments, handleDeletemodal, handleSelectedEquipment } = this.props

    const t = Profile?.i18n?.t

    const { isDeletemodalopen, selected_record } = Equipments
    return (
      <Modal
        onClose={() => handleDeletemodal(false)}
        onOpen={() => handleDeletemodal(true)}
        open={isDeletemodalopen}
      >
        <Modal.Header>{t('Pages.Equipments.Page.DeleteHeader')}</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <p>
              <span className='font-bold'>{selected_record?.Name} </span>
              {t('Pages.Equipments.Delete.Label.Check')}
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => {
            handleDeletemodal(false)
            handleSelectedEquipment({})
          }}>
            {t('Common.Button.Giveup')}
          </Button>
          <Button
            content={t('Common.Button.Delete')}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              DeleteEquipments(selected_record)
              handleDeletemodal(false)
              handleSelectedEquipment({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
