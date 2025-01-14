import React from 'react'
import { Button, Dimmer, DimmerDimmable, Loader, Modal } from 'semantic-ui-react'

export default function ProfessionpresettingsApprove(props) {

  const { open, setOpen, record, setRecord, Professionpresettings, Profile, ApproveProfessionpresettings } = props

  const t = Profile?.i18n?.t

  return (
    <DimmerDimmable blurring >
      <Modal
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
      >
        <Modal.Header >{t('Pages.Professionpresettings.Page.ApproveHeader')}</Modal.Header>
        <Modal.Content image>
          <Dimmer inverted active={Professionpresettings.isLoading}>
            <Loader inverted active />
          </Dimmer>
          <Modal.Description>
            <p>
              {t('Pages.Professionpresettings.Approve.Label.Check')}
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
            content={t('Common.Button.Approve')}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              ApproveProfessionpresettings({
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