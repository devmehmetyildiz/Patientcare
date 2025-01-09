import React from 'react'
import { Button, Dimmer, DimmerDimmable, Loader, Modal } from 'semantic-ui-react'

export default function PersonelpresettingsSavepreview(props) {

  const { open, setOpen, record, setRecord, Personelpresettings, Profile, SavepreviewPersonelpresettings } = props

  const t = Profile?.i18n?.t

  return (
    <DimmerDimmable blurring >
      <Modal
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
      >
        <Modal.Header >{t('Pages.Personelpresettings.Page.SavepreviewHeader')}</Modal.Header>
        <Modal.Content image>
          <Dimmer inverted active={Personelpresettings.isLoading}>
            <Loader inverted active />
          </Dimmer>
          <Modal.Description>
            <p>
              {t('Pages.Personelpresettings.Savepreview.Label.Check')}
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
            loading={Personelpresettings.isLoading}
            content={t('Common.Button.Savepreview')}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              SavepreviewPersonelpresettings({
                uuid: record?.Uuid || '',
                onSuccess: () => {
                  setOpen(false)
                  setRecord(null)
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
