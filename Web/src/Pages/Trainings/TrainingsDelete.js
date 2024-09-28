import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'

export default class TrainingsDelete extends Component {
  render() {
    const { Profile, Trainings, DeleteTrainings, handleDeletemodal, handleSelectedTraining } = this.props

    const t = Profile?.i18n?.t

    const { isDeletemodalopen, selected_record } = Trainings

    return (
      <Modal
        onClose={() => handleDeletemodal(false)}
        onOpen={() => handleDeletemodal(true)}
        open={isDeletemodalopen}
      >
        <Modal.Header>{t('Pages.Trainings.Page.DeleteHeader')}</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <p>
              <span className='font-bold'>{selected_record?.Name || t('Common.NoDataFound')} </span>
              {t('Pages.Trainings.Delete.Label.Check')}
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => {
            handleDeletemodal(false)
            handleSelectedTraining({})
          }}>
            {t('Common.Button.Giveup')}
          </Button>
          <Button
            content={t('Common.Button.Delete')}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              DeleteTrainings(selected_record)
              handleDeletemodal(false)
              handleSelectedTraining({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
