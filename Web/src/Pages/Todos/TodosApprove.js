import React, { Component } from 'react'
import Literals from './Literals'
import { Button, Modal } from 'semantic-ui-react'

export default class TodosApprove extends Component {
  render() {
    const { Profile, Todos, ApproveTodos, handleApprovemodal, handleSelectedTodo, Patientmovements, Patients, Patientdefines } = this.props
    const { isApprovemodalopen, selected_record } = Todos

    const patientmovement = (Patientmovements.list || []).find(u => u.Uuid === selected_record?.MovementID)
    const patient = (Patients.list || []).find(u => u.Uuid === patientmovement?.PatientID)
    const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)

    return (
      <Modal
        onClose={() => handleApprovemodal(false)}
        onOpen={() => handleApprovemodal(true)}
        open={isApprovemodalopen}
      >
        <Modal.Header>{Literals.Page.Pageapproveheader[Profile.Language]}</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <p>
              <span className='font-bold'>{`${patientdefine?.Firstname} ${patientdefine?.Lastname}`}</span>
              {Literals.Messages.Approvecheck[Profile.Language]}
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => {
            handleApprovemodal(false)
            handleSelectedTodo({})
          }}>
            {Literals.Button.Giveup[Profile.Language]}
          </Button>
          <Button
            content={Literals.Button.Approve[Profile.Language]}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              ApproveTodos(selected_record)
              handleApprovemodal(false)
              handleSelectedTodo({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
