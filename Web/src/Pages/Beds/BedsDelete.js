import React from 'react'
import { Button, Modal } from 'semantic-ui-react'

export default function BedsDelete(props) {
  const { Profile, Beds, DeleteBeds, handleDeletemodal, handleSelectedBed } = props
  const t = Profile?.i18n?.t
  const { isDeletemodalopen, selected_record } = Beds
  return (
    <Modal
      onClose={() => handleDeletemodal(false)}
      onOpen={() => handleDeletemodal(true)}
      open={isDeletemodalopen}
    >
      <Modal.Header>{t('Pages.Beds.Page.DeleteHeader')}</Modal.Header>
      <Modal.Content image>
        <Modal.Description>
          <p>
            <span className='font-bold'>{selected_record?.Name} </span>
            {t('Pages.Beds.Delete.Label.Check')}
          </p>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color='black' onClick={() => {
          handleDeletemodal(false)
          handleSelectedBed({})
        }}>
          {t('Common.Button.Giveup')}
        </Button>
        <Button
          loading={Beds.isLoading}
          content={t('Common.Button.Delete')}
          labelPosition='right'
          icon='checkmark'
          onClick={() => {
            DeleteBeds(selected_record)
            handleDeletemodal(false)
            handleSelectedBed({})
          }}
          positive
        />
      </Modal.Actions>
    </Modal>
  )
}
