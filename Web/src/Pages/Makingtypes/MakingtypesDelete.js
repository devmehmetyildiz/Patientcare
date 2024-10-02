import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'

export default class MakingtypesDelete extends Component {

  render() {

    const { Profile, Makingtypes, DeleteMakingtypes, handleDeletemodal, handleSelectedMakingtype } = this.props

    const t = Profile?.i18n?.t

    const { isDeletemodalopen, selected_record } = Makingtypes

    return (
      <Modal
        onClose={() => handleDeletemodal(false)}
        onOpen={() => handleDeletemodal(true)}
        open={isDeletemodalopen}
      >
        <Modal.Header>{t('Pages.Makingtypes.Page.DeleteHeader')}</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <p>
              <span className='font-bold'>{selected_record?.Name} </span>
              {t('Pages.Makingtypes.Delete.Label.Check')}
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => {
            handleDeletemodal(false)
            handleSelectedMakingtype({})
          }}>
            {t('Common.Button.Giveup')}
          </Button>
          <Button
            content={t('Common.Button.Delete')}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              DeleteMakingtypes(selected_record)
              handleDeletemodal(false)
              handleSelectedMakingtype({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
