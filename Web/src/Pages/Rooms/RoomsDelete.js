import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'

export default class RoomsDelete extends Component {
  render() {
    const { Profile, Rooms, DeleteRooms, handleDeletemodal, handleSelectedRoom } = this.props

    const t = Profile?.i18n?.t

    const { isDeletemodalopen, selected_record } = Rooms
    return (
      <Modal
        onClose={() => handleDeletemodal(false)}
        onOpen={() => handleDeletemodal(true)}
        open={isDeletemodalopen}
      >
        <Modal.Header>{t('Pages.Rooms.Page.Header')}</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <p>
              <span className='font-bold'>{selected_record?.Name} </span>
              {t('Pages.Rooms.Delete.Label.Check')}
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => {
            handleDeletemodal(false)
            handleSelectedRoom({})
          }}>
            {t('Common.Button.Giveup')}
          </Button>
          <Button
            content={t('Common.Button.Delete')}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              DeleteRooms(selected_record)
              handleDeletemodal(false)
              handleSelectedRoom({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
