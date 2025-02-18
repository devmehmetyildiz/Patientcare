import React from 'react'
import { Button, Modal } from 'semantic-ui-react'

export default function ClaimpaymentsSavepreview(props) {
  const { Profile, Claimpayments, SavepreviewClaimpayments, open, setOpen, record, setRecord } = props

  const t = Profile?.i18n?.t

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
    >
      <Modal.Header>{t('Pages.Claimpayments.Page.SavepreviewHeader')}</Modal.Header>
      <Modal.Content image>
        <Modal.Description>
          <p>
            <span className='font-bold'>{record?.Name} </span>
            {t('Pages.Claimpayments.Savepreview.Label.Check')}
          </p>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color='black' onClick={() => {
          setOpen(false)
          setRecord()
        }}>
          {t('Common.Button.Giveup')}
        </Button>
        <Button
          loading={Claimpayments.isLoading}
          content={t('Common.Button.Savepreview')}
          labelPosition='right'
          icon='checkmark'
          onClick={() => {
            SavepreviewClaimpayments({ data: record })
            setOpen(false)
            setRecord(null)
          }}
          positive
        />
      </Modal.Actions>
    </Modal>
  )
}
