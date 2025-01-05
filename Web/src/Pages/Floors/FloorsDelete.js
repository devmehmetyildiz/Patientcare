import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'

export default class FloorsDelete extends Component {
  render() {
    const { Profile, Floors, DeleteFloors, handleDeletemodal, handleSelectedFloor } = this.props

    const t = Profile?.i18n?.t

    const { isDeletemodalopen, selected_record } = Floors
    return (
      <Modal
        onClose={() => handleDeletemodal(false)}
        onOpen={() => handleDeletemodal(true)}
        open={isDeletemodalopen}
      >
        <Modal.Header>{t('Pages.Floors.Page.DeleteHeader')}</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <p>
              <span className='font-bold'>{selected_record?.Name} </span>
              {t('Pages.Floors.Delete.Label.Check')}
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => {
            handleDeletemodal(false)
            handleSelectedFloor({})
          }}>
            {t('Common.Button.Giveup')}
          </Button>
          <Button
            loading={Floors.isLoading}
            content={t('Common.Button.Delete')}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              DeleteFloors(selected_record)
              handleDeletemodal(false)
              handleSelectedFloor({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
