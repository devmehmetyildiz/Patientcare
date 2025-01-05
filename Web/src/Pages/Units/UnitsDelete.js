import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'

export default class UnitsDelete extends Component {
  render() {
    const { Profile, Units, DeleteUnits, handleDeletemodal, handleSelectedUnit } = this.props

    const t = Profile?.i18n?.t

    const { isDeletemodalopen, selected_record } = Units
    return (
      <Modal
        onClose={() => handleDeletemodal(false)}
        onOpen={() => handleDeletemodal(true)}
        open={isDeletemodalopen}
      >
        <Modal.Header>{t('Pages.Units.Page.DeleteHeader')}</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <p>
              <span className='font-bold'>{selected_record?.Name} </span>
              {t('Pages.Units.Delete.Label.Check')}
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => {
            handleDeletemodal(false)
            handleSelectedUnit({})
          }}>
            {t('Common.Button.Giveup')}
          </Button>
          <Button
            loading={Units.isLoading}
            content={t('Common.Button.Delete')}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              DeleteUnits(selected_record)
              handleDeletemodal(false)
              handleSelectedUnit({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
