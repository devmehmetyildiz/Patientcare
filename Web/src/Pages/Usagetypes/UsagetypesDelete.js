import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'
import Literals from './Literals'

export default class UsagetypesDelete extends Component {

  render() {
    const { Profile, Usagetypes, DeleteUsagetypes, handleDeletemodal, handleSelectedUsagetype } = this.props
    const { isDeletemodalopen, selected_record } = Usagetypes
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
            handleSelectedUsagetype({})
          }}>
            {Literals.Button.Giveup[Profile.Language]}
          </Button>
          <Button
            content={Literals.Button.Delete[Profile.Language]}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              DeleteUsagetypes(selected_record)
              handleDeletemodal(false)
              handleSelectedUsagetype({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
