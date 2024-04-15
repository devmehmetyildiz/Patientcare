import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'
import Literals from './Literals'

export default class PersonelshiftsDeactive extends Component {
  render() {
    const { Profile, Personelshifts, DeactivePersonelshifts, handleDeactivemodal, handleSelectedPersonelshift } = this.props
    const { isDeactivemodalopen, selected_record } = Personelshifts
    return (
      <Modal
        onClose={() => handleDeactivemodal(false)}
        onOpen={() => handleDeactivemodal(true)}
        open={isDeactivemodalopen}
      >
        <Modal.Header>{Literals.Page.Pagedeactiveheader[Profile.Language]}</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <p>
              <span className='font-bold'>{selected_record?.Name} </span>
              {Literals.Messages.Deactivecheck[Profile.Language]}
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => {
            handleDeactivemodal(false)
            handleSelectedPersonelshift({})
          }}>
            {Literals.Button.Giveup[Profile.Language]}
          </Button>
          <Button
            content={Literals.Button.Deactive[Profile.Language]}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              DeactivePersonelshifts(selected_record)
              handleDeactivemodal(false)
              handleSelectedPersonelshift({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
