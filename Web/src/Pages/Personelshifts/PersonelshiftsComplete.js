import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'
import Literals from './Literals'

export default class PersonelshiftsComplete extends Component {
  render() {
    const { Profile, Personelshifts, CompletePersonelshifts, handleCompletemodal, handleSelectedPersonelshift } = this.props
    const { isCompletemodalopen, selected_record } = Personelshifts
    return (
      <Modal
        onClose={() => handleCompletemodal(false)}
        onOpen={() => handleCompletemodal(true)}
        open={isCompletemodalopen}
      >
        <Modal.Header>{Literals.Page.Pagecompleteheader[Profile.Language]}</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <p>
              <span className='font-bold'>{selected_record?.Name} </span>
              {Literals.Messages.Completecheck[Profile.Language]}
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => {
            handleCompletemodal(false)
            handleSelectedPersonelshift({})
          }}>
            {Literals.Button.Giveup[Profile.Language]}
          </Button>
          <Button
            content={Literals.Button.Complete[Profile.Language]}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              CompletePersonelshifts(selected_record)
              handleCompletemodal(false)
              handleSelectedPersonelshift({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
