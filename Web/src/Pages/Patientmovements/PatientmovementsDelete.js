import React, { Component } from 'react'
import Literals from './Literals'
import { Button, Modal } from 'semantic-ui-react'

export default class PatientmovementsDelete extends Component {
  render() {
    const { Profile, Patientmovements, DeletePatientmovements, handleDeletemodal, handleSelectedPatientmovement } = this.props
    const { isDeletemodalopen, selected_record } = Patientmovements
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
            handleSelectedPatientmovement({})
          }}>
            {Literals.Button.Giveup[Profile.Language]}
          </Button>
          <Button
            content={Literals.Button.Delete[Profile.Language]}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              DeletePatientmovements(selected_record)
              handleDeletemodal(false)
              handleSelectedPatientmovement({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
