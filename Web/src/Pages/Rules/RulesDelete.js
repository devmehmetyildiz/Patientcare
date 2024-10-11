import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'

export default class RulesDelete extends Component {
  render() {
    const { Profile, Rules, DeleteRules, handleDeletemodal, handleSelectedRule } = this.props

    const t = Profile?.i18n?.t

    const { isDeletemodalopen, selected_record } = Rules
    return (
      <Modal
        onClose={() => handleDeletemodal(false)}
        onOpen={() => handleDeletemodal(true)}
        open={isDeletemodalopen}
      >
        <Modal.Header>{t('Pages.Rules.Page.DeleteHeader')}</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <p>
              <span className='font-bold'>{selected_record?.Name} </span>
              {t('Pages.Rules.Delete.Label.Check')}
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => {
            handleDeletemodal(false)
            handleSelectedRule({})
          }}>
            {t('Common.Button.Giveup')}
          </Button>
          <Button
            content={t('Common.Button.Delete')}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              DeleteRules(selected_record)
              handleDeletemodal(false)
              handleSelectedRule({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
