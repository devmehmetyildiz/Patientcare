import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'

export default class TododefinesDelete extends Component {
  render() {
    const { Profile, Tododefines, DeleteTododefines, handleDeletemodal, handleSelectedTododefine } = this.props

    const t = Profile?.i18n?.t

    const { isDeletemodalopen, selected_record } = Tododefines
    return (
      <Modal
        onClose={() => handleDeletemodal(false)}
        onOpen={() => handleDeletemodal(true)}
        open={isDeletemodalopen}
      >
        <Modal.Header>{t('Pages.Tododefines.Page.DeleteHeader')}</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <p>
              <span className='font-bold'>{selected_record?.Name} </span>
              {t('Pages.Tododefines.Delete.Label.Check')}
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => {
            handleDeletemodal(false)
            handleSelectedTododefine({})
          }}>
            {t('Common.Button.Giveup')}
          </Button>
          <Button
            content={t('Common.Button.Delete')}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              DeleteTododefines(selected_record)
              handleDeletemodal(false)
              handleSelectedTododefine({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
