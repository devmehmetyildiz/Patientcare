import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'

export default class EquipmentgroupsDelete extends Component {
  render() {
    const { Profile, Equipmentgroups, DeleteEquipmentgroups, handleDeletemodal, handleSelectedEquipmentgroup } = this.props

    const t = Profile?.i18n?.t

    const { isDeletemodalopen, selected_record } = Equipmentgroups
    return (
      <Modal
        onClose={() => handleDeletemodal(false)}
        onOpen={() => handleDeletemodal(true)}
        open={isDeletemodalopen}
      >
        <Modal.Header>{t('Pages.Equipmentgroups.Page.DeleteHeader')}</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <p>
              <span className='font-bold'>{selected_record?.Name} </span>
              {t('Pages.Equipmentgroups.Delete.Label.Check')}
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => {
            handleDeletemodal(false)
            handleSelectedEquipmentgroup({})
          }}>
            {t('Common.Button.Giveup')}
          </Button>
          <Button
            content={t('Common.Button.Delete')}

            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              DeleteEquipmentgroups(selected_record)
              handleDeletemodal(false)
              handleSelectedEquipmentgroup({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
