import React, { Component } from 'react'
import Literals from './Literals'
import { Button, Modal } from 'semantic-ui-react'

export default class PatientmedicinesDelete extends Component {
  render() {
    const { Profile, Patientstocks, DeletePatientstocks, handleDeletemodal, handleSelectedPatientstock } = this.props
    const { isDeletemodalopen, selected_record } = Patientstocks
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
              <span className='font-bold'>{selected_record?.Stockdefine?.Name} </span>
              {Literals.Messages.Deletecheck[Profile.Language]}
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => {
            handleDeletemodal(false)
            handleSelectedPatientstock({})
          }}>
            {Literals.Button.Giveup[Profile.Language]}
          </Button>
          <Button
            content={Literals.Button.Delete[Profile.Language]}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              DeletePatientstocks(selected_record)
              handleDeletemodal(false)
              handleSelectedPatientstock({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
