import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'

export default class PatienttypesDelete extends Component {
  render() {
    const { Profile, Patienttypes, DeletePatienttypes, handleDeletemodal, handleSelectedPatienttype } = this.props

    const t = Profile?.i18n?.t

    const { isDeletemodalopen, selected_record } = Patienttypes
    return (
      <Modal
        onClose={() => handleDeletemodal(false)}
        onOpen={() => handleDeletemodal(true)}
        open={isDeletemodalopen}
      >
        <Modal.Header>{t('Pages.Patienttypes.Page.DeleteHeader')}</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <p>
              <span className='font-bold'>{selected_record?.Name} </span>
              {t('Pages.Patienttypes.Delete.Label.Check')}
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => {
            handleDeletemodal(false)
            handleSelectedPatienttype({})
          }}>
            {t('Common.Button.Giveup')}
          </Button>
          <Button
            loading={Patienttypes.isLoading}
            content={t('Common.Button.Delete')}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              DeletePatienttypes(selected_record)
              handleDeletemodal(false)
              handleSelectedPatienttype({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
