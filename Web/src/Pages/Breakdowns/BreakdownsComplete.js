import React, { useState } from 'react'
import { Button, Form, Modal } from 'semantic-ui-react'

export default function BreakdownsComplete(props) {
  const [closeInfo, setcloseInfo] = useState('')

  const { Profile, Breakdowns, CompleteBreakdowns, handleCompletemodal, handleSelectedBreakdown } = props

  const t = Profile?.i18n?.t

  const { isCompletemodalopen, selected_record } = Breakdowns

  return (
    <Modal
      onClose={() => {
        handleCompletemodal(false)
        setcloseInfo('')
      }}
      onOpen={() => {
        handleCompletemodal(true)
        setcloseInfo('')
      }}
      open={isCompletemodalopen}
    >
      <Modal.Header>{t('Pages.Breakdowns.Page.CompleteHeader')}</Modal.Header>
      <Modal.Content image>
        <Modal.Description>
          <p>
            {t('Pages.Breakdowns.Complete.Label.Check')}
          </p>
          <Form>
            <Form.Input
              fluid
              label={t('Pages.Breakdowns.Column.Closeinfo')}
              placeholder={t('Pages.Breakdowns.Column.Closeinfo')}
              value={closeInfo}
              onChange={(e) => { setcloseInfo(e.target.value) }}
            />
          </Form>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color='black' onClick={() => {
          handleCompletemodal(false)
          handleSelectedBreakdown({})
          setcloseInfo('')
        }}>
          {t('Common.Button.Giveup')}
        </Button>
        <Button
          content={t('Common.Button.Complete')}
          labelPosition='right'
          icon='checkmark'
          onClick={() => {
            CompleteBreakdowns({ Uuid: selected_record?.Uuid, Closeinfo: closeInfo })
            handleCompletemodal(false)
            setcloseInfo('')
            handleSelectedBreakdown({})
          }}
          positive
        />
      </Modal.Actions>
    </Modal>
  )
}
