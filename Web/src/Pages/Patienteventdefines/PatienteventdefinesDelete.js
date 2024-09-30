import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'

export default class PatienteventdefinesDelete extends Component {
  render() {
    const { Profile, Patienteventdefines, DeletePatienteventdefines, handleDeletemodal, handleSelectedPatienteventdefine } = this.props
    
    const t = Profile?.i18n?.t

    const { isDeletemodalopen, selected_record } = Patienteventdefines
    return (
      <Modal
        onClose={() => handleDeletemodal(false)}
        onOpen={() => handleDeletemodal(true)}
        open={isDeletemodalopen}
      >
        <Modal.Header>{t('Pages.Patienteventdefines.Page.Header')}</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <p>
              <span className='font-bold'>{selected_record?.Eventname} </span>
              {t('Pages.Patienteventdefines.Delete.Label.Check')}
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => {
            handleDeletemodal(false)
            handleSelectedPatienteventdefine({})
          }}>
            {t('Common.Button.Giveup')}
          </Button>
          <Button
            content={t('Common.Button.Delete')}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              DeletePatienteventdefines(selected_record)
              handleDeletemodal(false)
              handleSelectedPatienteventdefine({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
