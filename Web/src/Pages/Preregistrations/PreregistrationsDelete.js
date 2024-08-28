import React from 'react'
import { Button, Modal } from 'semantic-ui-react'

export default function PreregistrationsDelete(props) {
  const { Profile, Patients, DeletePreregisrations, handleDeletemodal, handleSelectedPatient, Patientdefines } = props
  const { isDeletemodalopen, selected_record } = Patients

  const t = Profile?.i18n?.t
  const patient = selected_record
  const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)
  const patientName = `${patientdefine?.Firstname} ${patientdefine?.Lastname} - ${patientdefine?.CountryID}`

  return (
    <Modal
      onClose={() => handleDeletemodal(false)}
      onOpen={() => handleDeletemodal(true)}
      open={isDeletemodalopen}
    >
      <Modal.Header>{t('Pages.Preregistrations.Delete.Page.Header')}</Modal.Header>
      <Modal.Content image>
        <Modal.Description>
          <p>
            <span className='font-bold'>{patientName} </span>
            {t('Pages.Preregistrations.Delete.Messages.DeleteCheck')}
          </p>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color='black' onClick={() => {
          handleDeletemodal(false)
          handleSelectedPatient({})
        }}>
          {t('Common.Button.Giveup')}
        </Button>
        <Button
          content={t('Common.Button.Delete')}
          labelPosition='right'
          icon='checkmark'
          onClick={() => {
            DeletePreregisrations(selected_record)
            handleDeletemodal(false)
            handleSelectedPatient({})
          }}
          positive
        />
      </Modal.Actions>
    </Modal>
  )
}
