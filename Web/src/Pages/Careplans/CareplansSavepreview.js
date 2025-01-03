import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'

export default function CareplansSavepreview(props) {

  const { Profile, Careplans, SavepreviewCareplans, open, setOpen, record, setRecord } = props
  
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
            {t('Pages.Careplans.Savepreview.Label.Check')}
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
          content={t('Common.Button.Savepreview')}
          labelPosition='right'
          icon='checkmark'
          onClick={() => {
            SavepreviewCareplans(record)
            setOpen(false)
            setRecord(null)
          }}
          positive
        />
      </Modal.Actions>
    </Modal>
  )
}