import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'
import Literals from './Literals'

export default class ShiftdefinesDelete extends Component {
  render() {
    const { Profile, Shiftdefines, DeleteShiftdefines, handleDeletemodal, handleSelectedShiftdefine } = this.props
    const { isDeletemodalopen, selected_record } = Shiftdefines
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
            handleSelectedShiftdefine({})
          }}>
            {Literals.Button.Giveup[Profile.Language]}
          </Button>
          <Button
            content={Literals.Button.Delete[Profile.Language]}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              DeleteShiftdefines(selected_record)
              handleDeletemodal(false)
              handleSelectedShiftdefine({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
