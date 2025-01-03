import React from 'react'
import { Button, Modal } from 'semantic-ui-react'

export default function CareplansApprove(props) {
  
  const { Profile, Careplans, ApproveCareplans, open, setOpen, record, setRecord } = props

  const t = Profile?.i18n?.t

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
    >
      <Modal.Header>{t('Pages.Careplans.Page.Header')}</Modal.Header>
      <Modal.Content image>
        <Modal.Description>
          <p>
            {t('Pages.Careplans.Approve.Label.Check')}
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
          loading={Careplans.isLoading}
          content={t('Common.Button.Approve')}
          labelPosition='right'
          icon='checkmark'
          onClick={() => {
            ApproveCareplans(record)
            setOpen(false)
            setRecord(null)
          }}
          positive
        />
      </Modal.Actions>
    </Modal>
  )
}