import React, { Component } from 'react'
import Literals from './Literals'
import { Button, Modal } from 'semantic-ui-react'

export default class StationsDelete extends Component {
  render() {
    const { Profile, Stations, DeleteStations, handleDeletemodal, handleSelectedStation } = this.props
    const { isDeletemodalopen, selected_record } = Stations
    return (
      <Modal
        onClose={() => handleDeletemodal(false)}
        onOpen={() => handleDeletemodal(true)}
        open={isDeletemodalopen}
      >
        <Modal.Header>{Literals.Page.Pagedeleteheader[Profile.Language]}</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <p>
              <span className='font-bold'>{selected_record?.Name} </span>
              {Literals.Messages.Deletecheck[Profile.Language]}
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => {
            handleDeletemodal(false)
            handleSelectedStation({})
          }}>
            {Literals.Button.Giveup[Profile.Language]}
          </Button>
          <Button
            content={Literals.Button.Delete[Profile.Language]}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              DeleteStations(selected_record)
              handleDeletemodal(false)
              handleSelectedStation({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
