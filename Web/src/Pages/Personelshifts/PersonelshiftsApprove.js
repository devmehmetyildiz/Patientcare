import React from 'react'
import { Button, Dimmer, DimmerDimmable, Loader, Modal } from 'semantic-ui-react'

export default function PersonelshiftsApprove(props) {

  const { open, setOpen, record, setRecord, Personelshifts, Profile, ApprovePersonelshifts } = props

  const t = Profile?.i18n?.t

  return (
    <DimmerDimmable blurring >
      <Modal
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
      >
        <Modal.Header >{t('Pages.Personelshifts.Page.ApproveHeader')}</Modal.Header>
        <Modal.Content image>
          <Dimmer inverted active={Personelshifts.isLoading}>
            <Loader inverted active />
          </Dimmer>
          <Modal.Description>
            <p>
              <span className='font-bold'>{record?.Startdate} </span>
              {t('Pages.Personelshifts.Approve.Label.Check')}
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
            loading={Personelshifts.isLoading}
            content={t('Common.Button.Approve')}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              ApprovePersonelshifts({
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
