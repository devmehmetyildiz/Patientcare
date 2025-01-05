import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'

export default class StocktypegroupsDelete extends Component {

  render() {

    const { Profile, Stocktypegroups, DeleteStocktypegroups, handleDeletemodal, handleSelectedStocktypegroup } = this.props

    const t = Profile?.i18n?.t

    const { isDeletemodalopen, selected_record } = Stocktypegroups
    return (
      <Modal
        onClose={() => handleDeletemodal(false)}
        onOpen={() => handleDeletemodal(true)}
        open={isDeletemodalopen}
      >
        <Modal.Header>{t('Pages.Stocktypegroups.Page.DeleteHeader')}</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <p>
              <span className='font-bold'>{selected_record?.Name} </span>
              {t('Pages.Stocktypegroups.Delete.Label.Check')}
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => {
            handleDeletemodal(false)
            handleSelectedStocktypegroup({})
          }}>
            {t('Common.Button.Giveup')}
          </Button>
          <Button
            loading={Stocktypegroups.isLoading}
            content={t('Common.Button.Delete')}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              DeleteStocktypegroups(selected_record)
              handleDeletemodal(false)
              handleSelectedStocktypegroup({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
