import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'
import Literals from './Literals'

export default class CompanycashmovementsDelete extends Component {
  render() {
    const { Profile, Companycashmovements, DeleteCompanycashmovements, handleDeletemodal, handleSelectedCompanycashmovement } = this.props
    const { isDeletemodalopen, selected_record } = Companycashmovements
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
            handleSelectedCompanycashmovement({})
          }}>
            {Literals.Button.Giveup[Profile.Language]}
          </Button>
          <Button
            content={Literals.Button.Delete[Profile.Language]}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              DeleteCompanycashmovements(selected_record)
              handleDeletemodal(false)
              handleSelectedCompanycashmovement({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
