import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'

export default class TrainingsSavepreview extends Component {
  render() {
    const { Profile, Trainings, SavepreviewTrainings, handleSavepreviewmodal, handleSelectedTraining } = this.props

    const t = Profile?.i18n?.t

    const { isSavepreviewmodalopen, selected_record } = Trainings

    return (
      <Modal
        onClose={() => handleSavepreviewmodal(false)}
        onOpen={() => handleSavepreviewmodal(true)}
        open={isSavepreviewmodalopen}
      >
        <Modal.Header>{t('Pages.Trainings.Page.SavepreviewHeader')}</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <p>
              <span className='font-bold'>{selected_record?.Name || t('Common.NoDataFound')} </span>
              {t('Pages.Trainings.Savepreview.Label.Check')}
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => {
            handleSavepreviewmodal(false)
            handleSelectedTraining({})
          }}>
            {t('Common.Button.Giveup')}
          </Button>
          <Button
            content={t('Common.Button.Save')}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              SavepreviewTrainings(selected_record)
              handleSavepreviewmodal(false)
              handleSelectedTraining({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
