import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'

export default class ShiftdefinesDelete extends Component {
  render() {
    const { Profile, Shiftdefines, DeleteShiftdefines, handleDeletemodal, handleSelectedShiftdefine } = this.props

    const t = Profile?.i18n?.t

    const { isDeletemodalopen, selected_record } = Shiftdefines
    return (
      <Modal
        onClose={() => handleDeletemodal(false)}
        onOpen={() => handleDeletemodal(true)}
        open={isDeletemodalopen}
      >
        <Modal.Header>{t('Pages.Shiftdefines.Page.DeleteHeader')}</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <p>
              <span className='font-bold'>{selected_record?.Name} </span>
              {t('Pages.Shiftdefines.Delete.Label.Check')}
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => {
            handleDeletemodal(false)
            handleSelectedShiftdefine({})
          }}>
            {t('Common.Button.Giveup')}
          </Button>
          <Button
            content={t('Common.Button.Delete')}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              DeleteShiftdefines(selected_record)
              handleDeletemodal(false)
              handleSelectedShiftdefine({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
