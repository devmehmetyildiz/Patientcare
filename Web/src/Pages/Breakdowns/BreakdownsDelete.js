import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'

export default class BreakdownsDelete extends Component {
  render() {
    const { Profile, Breakdowns, DeleteBreakdowns, handleDeletemodal, handleSelectedBreakdown } = this.props

    const t = Profile?.i18n?.t

    const { isDeletemodalopen, selected_record } = Breakdowns
    return (
      <Modal
        onClose={() => handleDeletemodal(false)}
        onOpen={() => handleDeletemodal(true)}
        open={isDeletemodalopen}
      >
        <Modal.Header>{t('Pages.Breakdowns.Page.DeleteHeader')}</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <p>
              <span className='font-bold'>{selected_record?.Name} </span>
              {t('Pages.Breakdowns.Delete.Label.Check')}
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => {
            handleDeletemodal(false)
            handleSelectedBreakdown({})
          }}>
            {t('Common.Button.Giveup')}
          </Button>
          <Button
            content={t('Common.Button.Delete')}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              DeleteBreakdowns(selected_record)
              handleDeletemodal(false)
              handleSelectedBreakdown({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
