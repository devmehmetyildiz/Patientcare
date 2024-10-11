import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'

export default class PeriodsDelete extends Component {
  render() {
    const { Profile, Periods, DeletePeriods, handleDeletemodal, handleSelectedPeriod } = this.props

    const t = Profile?.i18n?.t

    const { isDeletemodalopen, selected_record } = Periods
    return (
      <Modal
        onClose={() => handleDeletemodal(false)}
        onOpen={() => handleDeletemodal(true)}
        open={isDeletemodalopen}
      >
        <Modal.Header>{t('Pages.Periods.Page.DeleteHeader')}</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <p>
              <span className='font-bold'>{selected_record?.Name} </span>
              {t('Pages.Periods.Delete.Label.Check')}
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => {
            handleDeletemodal(false)
            handleSelectedPeriod({})
          }}>
            {t('Common.Button.Giveup')}
          </Button>
          <Button
            content={t('Common.Button.Delete')}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              DeletePeriods(selected_record)
              handleDeletemodal(false)
              handleSelectedPeriod({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
