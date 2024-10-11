import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'
export default class UsagetypesDelete extends Component {

  render() {
    const { Profile, Usagetypes, DeleteUsagetypes, handleDeletemodal, handleSelectedUsagetype } = this.props

    const t = Profile?.i18n?.t

    const { isDeletemodalopen, selected_record } = Usagetypes
    return (
      <Modal
        onClose={() => handleDeletemodal(false)}
        onOpen={() => handleDeletemodal(true)}
        open={isDeletemodalopen}
      >
        <Modal.Header>{t('Pages.Usagetypes.Page.DeleteHeader')}</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <p>
              <span className='font-bold'>{selected_record?.Name} </span>
              {t('Pages.Usagetypes.Delete.Label.Check')}
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => {
            handleDeletemodal(false)
            handleSelectedUsagetype({})
          }}>
            {t('Common.Button.Giveup')}
          </Button>
          <Button
            content={t('Common.Button.Delete')}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              DeleteUsagetypes(selected_record)
              handleDeletemodal(false)
              handleSelectedUsagetype({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
