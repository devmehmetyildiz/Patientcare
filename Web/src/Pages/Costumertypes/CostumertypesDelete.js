import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'

export default class CostumertypesDelete extends Component {
  render() {
    const { Profile, Costumertypes, DeleteCostumertypes, handleDeletemodal, handleSelectedCostumertype } = this.props

    const t = Profile?.i18n?.t

    const { isDeletemodalopen, selected_record } = Costumertypes
    return (
      <Modal
        onClose={() => handleDeletemodal(false)}
        onOpen={() => handleDeletemodal(true)}
        open={isDeletemodalopen}
      >
        <Modal.Header>{t('Pages.Costumertypes.Page.DeleteHeader')}</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <p>
              <span className='font-bold'>{selected_record?.Name} </span>
              {t('Pages.Costumertypes.Delete.Label.Check')}
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => {
            handleDeletemodal(false)
            handleSelectedCostumertype({})
          }}>
            {t('Common.Button.Giveup')}
          </Button>
          <Button
            loading={Costumertypes.isLoading}
            content={t('Common.Button.Delete')}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              DeleteCostumertypes(selected_record)
              handleDeletemodal(false)
              handleSelectedCostumertype({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
