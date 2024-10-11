import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'
export default class FilesDelete extends Component {
  render() {
    const { Profile, Files, DeleteFiles, handleDeletemodal, handleSelectedFile } = this.props

    const t = Profile?.i18n?.t

    const { isDeletemodalopen, selected_record } = Files
    return (
      <Modal
        onClose={() => handleDeletemodal(false)}
        onOpen={() => handleDeletemodal(true)}
        open={isDeletemodalopen}
      >
        <Modal.Header>{t('Pages.Files.Page.DeleteHeader')}</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <p>
              <span className='font-bold'>{selected_record?.Filename} </span>
              {t('Pages.Files.Delete.Label.Check')}
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => {
            handleDeletemodal(false)
            handleSelectedFile({})
          }}>
            {t('Common.Button.Giveup')}
          </Button>
          <Button
            content={t('Common.Button.Delete')}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              DeleteFiles(selected_record)
              handleDeletemodal(false)
              handleSelectedFile({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
