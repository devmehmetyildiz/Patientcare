import React from 'react'
import { Button, Modal } from 'semantic-ui-react'

export default function EquipmentgroupsDelete(props) {
  const { Profile, Equipmentgroups, DeleteEquipmentgroups, open, setOpen, record, setRecord } = props

  const t = Profile?.i18n?.t

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
    >
      <Modal.Header>{t('Pages.Equipmentgroups.Page.DeleteHeader')}</Modal.Header>
      <Modal.Content image>
        <Modal.Description>
          <p>
            <span className='font-bold'>{record?.Name} </span>
            {t('Pages.Equipmentgroups.Delete.Label.Check')}
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
          loading={Equipmentgroups.isLoading}
          content={t('Common.Button.Delete')}
          labelPosition='right'
          icon='checkmark'
          onClick={() => {
            DeleteEquipmentgroups(record)
            setOpen(false)
            setRecord(null)
          }}
          positive
        />
      </Modal.Actions>
    </Modal>
  )
}