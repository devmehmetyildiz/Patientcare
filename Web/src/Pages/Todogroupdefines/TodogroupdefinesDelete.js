import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'

export default class TodogroupdefinesDelete extends Component {
  render() {
    const { Profile, Todogroupdefines, DeleteTodogroupdefines, handleDeletemodal, handleSelectedTodogroupdefine } = this.props

    const t = Profile?.i18n?.t

    const { isDeletemodalopen, selected_record } = Todogroupdefines
    return (
      <Modal
        onClose={() => handleDeletemodal(false)}
        onOpen={() => handleDeletemodal(true)}
        open={isDeletemodalopen}
      >
        <Modal.Header>{t('Pages.Todogroupdefines.Page.DeleteHeader')}</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <p>
              <span className='font-bold'>{selected_record?.Name} </span>
              {t('Pages.Todogroupdefines.Delete.Label.Check')}
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => {
            handleDeletemodal(false)
            handleSelectedTodogroupdefine({})
          }}>
            {t('Common.Button.Giveup')}
          </Button>
          <Button
            content={t('Common.Button.Delete')}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              DeleteTodogroupdefines(selected_record)
              handleDeletemodal(false)
              handleSelectedTodogroupdefine({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
