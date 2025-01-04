import React from 'react'
import { Button, Modal } from 'semantic-ui-react'

export default function PreregistrationsDelete(props) {
 
  const { Profile, Patients, DeletePreregisrations, Patientdefines, open, setOpen, record, setRecord } = props

  const t = Profile?.i18n?.t
  const patient = record
  const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)
  const patientName = `${patientdefine?.Firstname} ${patientdefine?.Lastname} - ${patientdefine?.CountryID}`

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
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
          setOpen(false)
          setRecord(null)
        }}>
          {t('Common.Button.Giveup')}
        </Button>
        <Button
          loading={Patients.isLoading}
          content={t('Common.Button.Delete')}
          labelPosition='right'
          icon='checkmark'
          onClick={() => {
            DeletePreregisrations(record)
            setOpen(false)
            setRecord(null)
          }}
          positive
        />
      </Modal.Actions>
    </Modal>
  )
}
