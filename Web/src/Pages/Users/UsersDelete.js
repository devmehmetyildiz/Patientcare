import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'

export default class UsersDelete extends Component {
  render() {
    const { Profile, Users, DeleteUsers, handleDeletemodal, handleSelectedUser } = this.props
    const t = Profile?.i18n?.t
    const { isDeletemodalopen, selected_record } = Users
    return (
      <Modal
        onClose={() => handleDeletemodal(false)}
        onOpen={() => handleDeletemodal(true)}
        open={isDeletemodalopen}
      >
        <Modal.Header>{t('Pages.Users.Page.DeleteHeader')}</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <p>
              <span className='font-bold'>{selected_record?.Username} </span>
              {t('Pages.Users.Delete.Label.DeleteCheck')}
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => {
            handleDeletemodal(false)
            handleSelectedUser({})
          }}>
            {t('Common.Button.Giveup')}
          </Button>
          <Button
            content={t('Common.Button.Delete')}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              DeleteUsers(selected_record)
              handleDeletemodal(false)
              handleSelectedUser({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
