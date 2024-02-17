import React, { Component } from 'react'
import Literals from './Literals'
import { Button, Modal } from 'semantic-ui-react'

export default class CareplansApprove extends Component {
  render() {
    const { Profile, Careplans, ApproveCareplans, handleApprovemodal, handleSelectedCareplan,  } = this.props
    const { isApprovemodalopen, selected_record } = Careplans

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
              {Literals.Messages.Approvecheck[Profile.Language]}
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => {
            handleApprovemodal(false)
            handleSelectedCareplan({})
          }}>
            {Literals.Button.Giveup[Profile.Language]}
          </Button>
          <Button
            content={Literals.Button.Approve[Profile.Language]}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              ApproveCareplans(selected_record)
              handleApprovemodal(false)
              handleSelectedCareplan({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
