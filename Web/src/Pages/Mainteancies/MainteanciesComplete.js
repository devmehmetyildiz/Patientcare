import React, { useState } from 'react'
import { Button, Form, Modal } from 'semantic-ui-react'


export default function MainteanciesComplete(props) {
  const [closeInfo, setcloseInfo] = useState('')

  const { Profile, Mainteancies, CompleteMainteancies, handleCompletemodal, handleSelectedMainteance } = props

  const t = Profile?.i18n?.t

  const { isCompletemodalopen, selected_record } = Mainteancies

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
      <Modal.Header>{t('Pages.Mainteancies.Page.CompleteHeader')}</Modal.Header>
      <Modal.Content image>
        <Modal.Description>
          <p>
            {t('Pages.Mainteancies.Complete.Label.Check')}
          </p>
          <Form>
            <Form.Input
              fluid
              label={t('Pages.Mainteancies.Column.Closeinfo')}
              placeholder={t('Pages.Mainteancies.Column.Closeinfo')}
              value={closeInfo}
              onChange={(e) => { setcloseInfo(e.target.value) }}
            />
          </Form>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color='black' onClick={() => {
          handleCompletemodal(false)
          handleSelectedMainteance({})
          setcloseInfo('')
        }}>
          {t('Common.Button.Giveup')}
        </Button>
        <Button
          content={t('Common.Button.Complete')}
          labelPosition='right'
          icon='checkmark'
          onClick={() => {
            CompleteMainteancies({ Uuid: selected_record?.Uuid, Closeinfo: closeInfo })
            handleCompletemodal(false)
            setcloseInfo('')
            handleSelectedMainteance({})
          }}
          positive
        />
      </Modal.Actions>
    </Modal>
  )
}
