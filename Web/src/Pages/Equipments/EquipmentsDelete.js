import React from 'react'
import { Button, Modal } from 'semantic-ui-react'

export default function EquipmentsDelete(props) {

  const { Profile, Equipments, DeleteEquipments, open, setOpen, record, setRecord } = props

  const t = Profile?.i18n?.t

  return <Modal
    onClose={() => setOpen(false)}
    onOpen={() => setOpen(true)}
    open={open}
  >
    <Modal.Header>{t('Pages.Equipments.Page.DeleteHeader')}</Modal.Header>
    <Modal.Content image>
      <Modal.Description>
        <p>
          <span className='font-bold'>{record?.Name} </span>
          {t('Pages.Equipments.Delete.Label.Check')}
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
        loading={Equipments.isLoading}
        content={t('Common.Button.Delete')}
        labelPosition='right'
        icon='checkmark'
        onClick={() => {
          DeleteEquipments(record)
          setOpen(false)
          setRecord(null)
        }}
        positive
      />
    </Modal.Actions>
  </Modal>
}