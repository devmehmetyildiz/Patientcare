import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'

export default class PatientcashmovementsDelete extends Component {
  render() {
    const { Profile, Patientcashmovements, DeletePatientcashmovements, handleDeletemodal, handleSelectedPatientcashmovement } = this.props

    const t = Profile?.i18n?.t

    const { isDeletemodalopen, selected_record } = Patientcashmovements
    return (
      <Modal
        onClose={() => handleDeletemodal(false)}
        onOpen={() => handleDeletemodal(true)}
        open={isDeletemodalopen}
      >
        <Modal.Header>{t('Pages.Patientcashmovements.Page.DeleteHeader')}</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <p>
              {t('Pages.Patientcashmovements.Delete.Label.Check')}
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => {
            handleDeletemodal(false)
            handleSelectedPatientcashmovement({})
          }}>
            {t('Common.Button.Giveup')}
          </Button>
          <Button
            content={t('Common.Button.Delete')}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              DeletePatientcashmovements(selected_record)
              handleDeletemodal(false)
              handleSelectedPatientcashmovement({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
