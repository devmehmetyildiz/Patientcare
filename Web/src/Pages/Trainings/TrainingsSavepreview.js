import React from 'react'
import { Button, Modal } from 'semantic-ui-react'

export default function TrainingsSavepreview(props) {
  
  const { Profile, Trainings, SavepreviewTrainings, open, setOpen, record, setRecord } = props

  const t = Profile?.i18n?.t

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
    >
      <Modal.Header>{t('Pages.Trainings.Page.SavepreviewHeader')}</Modal.Header>
      <Modal.Content image>
        <Modal.Description>
          <p>
            <span className='font-bold'>{record?.Name || t('Common.NoDataFound')} </span>
            {t('Pages.Trainings.Savepreview.Label.Check')}
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
          loading={Trainings.isLoading}
          content={t('Common.Button.Save')}
          labelPosition='right'
          icon='checkmark'
          onClick={() => {
            SavepreviewTrainings({ data: record })
            setOpen(false)
            setRecord(null)
          }}
          positive
        />
      </Modal.Actions>
    </Modal>
  )
}