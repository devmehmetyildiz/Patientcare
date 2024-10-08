import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'

export default class RatingsDelete extends Component {

  render() {

    const { Profile, Ratings, DeleteRatings, handleDeletemodal, handleSelectedRating } = this.props

    const t = Profile?.i18n?.t

    const { isDeletemodalopen, selected_record } = Ratings

    return (
      <Modal
        onClose={() => handleDeletemodal(false)}
        onOpen={() => handleDeletemodal(true)}
        open={isDeletemodalopen}
      >
        <Modal.Header>{t('Pages.Ratings.Page.DeleteHeader')}</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <p>
              <span className='font-bold'>{selected_record?.Name} </span>
              {t('Pages.Ratings.Delete.Label.Check')}
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => {
            handleDeletemodal(false)
            handleSelectedRating({})
          }}>
            {t('Common.Button.Giveup')}
          </Button>
          <Button
            content={t('Common.Button.Delete')}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              DeleteRatings(selected_record)
              handleDeletemodal(false)
              handleSelectedRating({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
