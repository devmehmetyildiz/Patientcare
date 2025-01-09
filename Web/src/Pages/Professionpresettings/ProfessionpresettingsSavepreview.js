import React from 'react'
import { Button, Dimmer, DimmerDimmable, Loader, Modal } from 'semantic-ui-react'

export default function ProfessionpresettingsSavepreview(props) {

  const { open, setOpen, record, setRecord, Professionpresettings, Profile, SavepreviewProfessionpresettings } = props

  const t = Profile?.i18n?.t

  return (
    <DimmerDimmable blurring >
      <Modal
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
      >
        <Modal.Header >{t('Pages.Professionpresettings.Page.SavepreviewHeader')}</Modal.Header>
        <Modal.Content image>
          <Dimmer inverted active={Professionpresettings.isLoading}>
            <Loader inverted active />
          </Dimmer>
          <Modal.Description>
            <p>
              {t('Pages.Professionpresettings.Savepreview.Label.Check')}
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
            loading={Professionpresettings.isLoading}
            content={t('Common.Button.Savepreview')}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              SavepreviewProfessionpresettings({
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
