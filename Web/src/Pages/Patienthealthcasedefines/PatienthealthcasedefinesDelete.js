import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'

export default class PatienthealthcasedefinesDelete extends Component {
  render() {
    const { Profile, Patienthealthcasedefines, DeletePatienthealthcasedefines, handleDeletemodal, handleSelectedPatienthealthcasedefine } = this.props

    const t = Profile?.i18n?.t

    const { isDeletemodalopen, selected_record } = Patienthealthcasedefines
    return (
      <Modal
        onClose={() => handleDeletemodal(false)}
        onOpen={() => handleDeletemodal(true)}
        open={isDeletemodalopen}
      >
        <Modal.Header>{t('Pages.Patienthealthcasedefines.Page.Header')}</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <p>
              <span className='font-bold'>{selected_record?.Name} </span>
              {t('Pages.Patienthealthcasedefines.Delete.Label.Check')}
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => {
            handleDeletemodal(false)
            handleSelectedPatienthealthcasedefine({})
          }}>
            {t('Common.Button.Giveup')}
          </Button>
          <Button
            loading={Patienthealthcasedefines.isLoading}
            content={t('Common.Button.Delete')}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              DeletePatienthealthcasedefines(selected_record)
              handleDeletemodal(false)
              handleSelectedPatienthealthcasedefine({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
