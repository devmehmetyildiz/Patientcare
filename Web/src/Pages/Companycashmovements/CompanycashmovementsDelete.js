import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'

export default class CompanycashmovementsDelete extends Component {
  render() {
    const { Profile, Companycashmovements, DeleteCompanycashmovements, handleDeletemodal, handleSelectedCompanycashmovement } = this.props

    const t = Profile?.i18n?.t

    const { isDeletemodalopen, selected_record } = Companycashmovements
    return (
      <Modal
        onClose={() => handleDeletemodal(false)}
        onOpen={() => handleDeletemodal(true)}
        open={isDeletemodalopen}
      >
        <Modal.Header>{t('Pages.Companycashmovements.Page.DeleteHeader')}</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <p>
              <span className='font-bold'>{selected_record?.Name} </span>
              {t('Pages.Companycashmovements.Delete.Label.Check')}
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => {
            handleDeletemodal(false)
            handleSelectedCompanycashmovement({})
          }}>
            {t('Common.Button.Giveup')}
          </Button>
          <Button
            content={t('Common.Button.Delete')}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              DeleteCompanycashmovements(selected_record)
              handleDeletemodal(false)
              handleSelectedCompanycashmovement({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
