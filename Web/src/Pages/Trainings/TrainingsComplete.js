import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'

export default class TrainingsComplete extends Component {
  render() {
    const { Profile, Trainings, CompleteTrainings, CompleteAllTrainings, handleCompletemodal, handleSelectedTraining } = this.props

    const t = Profile?.i18n?.t

    const { isCompletemodalopen, selected_record } = Trainings

    return (
      <Modal
        onClose={() => handleCompletemodal(false)}
        onOpen={() => handleCompletemodal(true)}
        open={isCompletemodalopen}
      >
        <Modal.Header>{t('Pages.Trainings.Page.CompleteHeader')}</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <p>
              <span className='font-bold'>{selected_record?.Name || t('Common.NoDataFound')} </span>
              {t('Pages.Trainings.Complete.Label.Check')}
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => {
            handleCompletemodal(false)
            handleSelectedTraining({})
          }}>
            {t('Common.Button.Giveup')}
          </Button>
          <Button
            content={t('Common.Button.Complete')}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              CompleteTrainings({ data: selected_record })
              handleCompletemodal(false)
              handleSelectedTraining({})
            }}
            positive
          />
          <Button
            content={t('Pages.Trainings.Label.CompleteAll')}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              CompleteAllTrainings({ data: selected_record })
              handleCompletemodal(false)
              handleSelectedTraining({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
