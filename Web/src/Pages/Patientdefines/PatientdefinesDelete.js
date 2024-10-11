import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'

export default class PatientdefinesDelete extends Component {
  render() {
    const { Profile, Patientdefines, DeletePatientdefines, handleDeletemodal, handleSelectedPatientdefine } = this.props

    const t = Profile?.i18n?.t

    const { isDeletemodalopen, selected_record } = Patientdefines
    return (
      <Modal
        onClose={() => handleDeletemodal(false)}
        onOpen={() => handleDeletemodal(true)}
        open={isDeletemodalopen}
      >
        <Modal.Header>{t('Pages.Patientdefines.Page.DeleteHeader')}</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <p>
              <span className='font-bold'>{selected_record?.Name} </span>
              {t('Pages.Patientdefines.Delete.Label.Check')}
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => {
            handleDeletemodal(false)
            handleSelectedPatientdefine({})
          }}>
            {t('Common.Button.Giveup')}
          </Button>
          <Button
            content={t('Common.Button.Delete')}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              DeletePatientdefines(selected_record)
              handleDeletemodal(false)
              handleSelectedPatientdefine({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
