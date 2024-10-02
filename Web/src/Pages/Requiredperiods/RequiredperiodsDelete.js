import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'

export default class RequiredperiodsDelete extends Component {

  render() {

    const { Profile, Requiredperiods, DeleteRequiredperiods, handleDeletemodal, handleSelectedRequiredperiod } = this.props

    const t = Profile?.i18n?.t

    const { isDeletemodalopen, selected_record } = Requiredperiods

    return (
      <Modal
        onClose={() => handleDeletemodal(false)}
        onOpen={() => handleDeletemodal(true)}
        open={isDeletemodalopen}
      >
        <Modal.Header>{t('Pages.Requiredperiods.Page.DeleteHeader')}</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <p>
              <span className='font-bold'>{selected_record?.Name} </span>
              {t('Pages.Requiredperiods.Delete.Label.Check')}
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => {
            handleDeletemodal(false)
            handleSelectedRequiredperiod({})
          }}>
            {t('Common.Button.Giveup')}
          </Button>
          <Button
            content={t('Common.Button.Delete')}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              DeleteRequiredperiods(selected_record)
              handleDeletemodal(false)
              handleSelectedRequiredperiod({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
