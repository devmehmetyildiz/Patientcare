import React from 'react'
import { Button, Dimmer, DimmerDimmable, Loader, Modal } from 'semantic-ui-react'

export default function PatienthealthcasesDelete(props) {

  const { open, setOpen, record, setRecord, Profile } = props
  const { DeletePatienthealthcases, Patienthealthcases, Patients, Patientdefines, Patienthealthcasedefines, GetPatienthealthcases } = props

  const t = Profile?.i18n?.t

  const patient = (Patients.list || []).find(u => u.Uuid === record?.PatientID)
  const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)
  const define = (Patienthealthcasedefines.list || []).find(u => u.Uuid === record?.DefineID)

  const name = `${patientdefine?.Firstname} ${patientdefine?.Lastname} - ${define?.Name}`

  return (
    <DimmerDimmable blurring >
      <Modal
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
      >
        <Modal.Header >{t('Pages.Patienthealthcases.Page.DeleteHeader')}</Modal.Header>
        <Modal.Content image>
          <Dimmer inverted active={Patienthealthcases.isLoading}>
            <Loader inverted active />
          </Dimmer>
          <Modal.Description>
            <p>
              <span className='font-bold'>{name} </span>
              {t('Pages.Patienthealthcases.Delete.Label.Check')}
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
            loading={Patienthealthcases.isLoading}
            content={t('Common.Button.Delete')}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              DeletePatienthealthcases({
                patienthealthcaseID: record?.Uuid || '',
                onSuccess: () => {
                  setOpen(false)
                  setRecord(null)
                  GetPatienthealthcases()
                }
              })
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    </DimmerDimmable>
  )
}
