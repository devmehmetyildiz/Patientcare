import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'

export default class ProfessionsDelete extends Component {

  render() {

    const { Profile, Professions, DeleteProfessions, handleDeletemodal, handleSelectedProfession } = this.props

    const t = Profile?.i18n?.t

    const { isDeletemodalopen, selected_record } = Professions

    return (
      <Modal
        onClose={() => handleDeletemodal(false)}
        onOpen={() => handleDeletemodal(true)}
        open={isDeletemodalopen}
      >
        <Modal.Header>{t('Pages.Professions.Page.DeleteHeader')}</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <p>
              <span className='font-bold'>{selected_record?.Name} </span>
              {t('Pages.Professions.Delete.Label.Check')}
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => {
            handleDeletemodal(false)
            handleSelectedProfession({})
          }}>
            {t('Common.Button.Giveup')}
          </Button>
          <Button
            content={t('Common.Button.Delete')}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              DeleteProfessions(selected_record)
              handleDeletemodal(false)
              handleSelectedProfession({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
