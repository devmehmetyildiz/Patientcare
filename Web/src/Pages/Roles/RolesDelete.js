import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'

export default class RolesDelete extends Component {
  render() {
    const { Profile, Roles, DeleteRoles, handleDeletemodal, handleSelectedRole } = this.props

    const t = Profile?.i18n?.t

    const { isDeletemodalopen, selected_record } = Roles
    return (
      <Modal
        onClose={() => handleDeletemodal(false)}
        onOpen={() => handleDeletemodal(true)}
        open={isDeletemodalopen}
      >
        <Modal.Header>{t('Pages.Roles.Page.DeleteHeader')}</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <p>
              <span className='font-bold'>{selected_record?.Name} </span>
              {t('Pages.Roles.Delete.Label.Check')}
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => {
            handleDeletemodal(false)
            handleSelectedRole({})
          }}>
            {t('Common.Button.Giveup')}
          </Button>
          <Button
            content={t('Common.Button.Delete')}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              DeleteRoles(selected_record)
              handleDeletemodal(false)
              handleSelectedRole({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
