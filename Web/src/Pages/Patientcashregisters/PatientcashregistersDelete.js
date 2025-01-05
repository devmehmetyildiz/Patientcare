import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'

export default class PatientcashregistersDelete extends Component {
  render() {
    const { Profile, Patientcashregisters, DeletePatientcashregisters, handleDeletemodal, handleSelectedPatientcashregister } = this.props

    const t = Profile?.i18n?.t

    const { isDeletemodalopen, selected_record } = Patientcashregisters
    return (
      <Modal
        onClose={() => handleDeletemodal(false)}
        onOpen={() => handleDeletemodal(true)}
        open={isDeletemodalopen}
      >
        <Modal.Header>{t('Pages.Patientcashregisters.Page.Header')}</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <p>
              <span className='font-bold'>{selected_record?.Name} </span>
              {t('Pages.Patientcashregisters.Delete.Label.Check')}
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => {
            handleDeletemodal(false)
            handleSelectedPatientcashregister({})
          }}>
            {t('Common.Button.Giveup')}
          </Button>
          <Button
            loading={Patientcashregisters.isLoading}
            content={t('Common.Button.Delete')}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              DeletePatientcashregisters(selected_record)
              handleDeletemodal(false)
              handleSelectedPatientcashregister({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
