import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'

export default class CareplanparametersDelete extends Component {

  render() {

    const { Profile, Careplanparameters, DeleteCareplanparameters, handleDeletemodal, handleSelectedCareplanparameter } = this.props

    const t = Profile?.i18n?.t

    const { isDeletemodalopen, selected_record } = Careplanparameters
    return (
      <Modal
        onClose={() => handleDeletemodal(false)}
        onOpen={() => handleDeletemodal(true)}
        open={isDeletemodalopen}
      >
        <Modal.Header>{t('Pages.Careplanparameters.Page.DeleteHeader')}</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <p>
              <span className='font-bold'>{selected_record?.Name} </span>
              {t('Pages.Careplanparameters.Delete.Label.Check')}
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => {
            handleDeletemodal(false)
            handleSelectedCareplanparameter({})
          }}>
            {t('Common.Button.Giveup')}
          </Button>
          <Button
            content={t('Common.Button.Delete')}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              DeleteCareplanparameters(selected_record)
              handleDeletemodal(false)
              handleSelectedCareplanparameter({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
