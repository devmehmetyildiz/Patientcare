import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'

export default class MainteanciesDelete extends Component {
  render() {
    const { Profile, Mainteancies, DeleteMainteancies, handleDeletemodal, handleSelectedMainteance } = this.props

    const t = Profile?.i18n?.t

    const { isDeletemodalopen, selected_record } = Mainteancies
    return (
      <Modal
        onClose={() => handleDeletemodal(false)}
        onOpen={() => handleDeletemodal(true)}
        open={isDeletemodalopen}
      >
        <Modal.Header>{t('Pages.Mainteancies.Page.DeleteHeader')}</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <p>
              <span className='font-bold'>{selected_record?.Name} </span>
              {t('Pages.Mainteancies.Delete.Label.Check')}
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => {
            handleDeletemodal(false)
            handleSelectedMainteance({})
          }}>
            {t('Common.Button.Giveup')}
          </Button>
          <Button
            content={t('Common.Button.Delete')}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              DeleteMainteancies(selected_record)
              handleDeletemodal(false)
              handleSelectedMainteance({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
