import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'
import Literals from './Literals'

export default class PersonelshiftsApprove extends Component {
  render() {
    const { Profile, Personelshifts, ApprovePersonelshifts, handleApprovemodal, handleSelectedPersonelshift } = this.props
    const { isApprovemodalopen, selected_record } = Personelshifts
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
              <span className='font-bold'>{selected_record?.Name} </span>
              {Literals.Messages.Approvecheck[Profile.Language]}
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => {
            handleApprovemodal(false)
            handleSelectedPersonelshift({})
          }}>
            {Literals.Button.Giveup[Profile.Language]}
          </Button>
          <Button
            content={Literals.Button.Approve[Profile.Language]}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              ApprovePersonelshifts(selected_record)
              handleApprovemodal(false)
              handleSelectedPersonelshift({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
