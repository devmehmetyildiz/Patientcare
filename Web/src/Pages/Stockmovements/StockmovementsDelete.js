import React, { Component } from 'react'
import Literals from './Literals'
import { Button, Modal } from 'semantic-ui-react'

export default class StockmovementsDelete extends Component {
  render() {
    const { Profile, Stockmovements, DeleteStockmovements, handleDeletemodal, handleSelectedStockmovement } = this.props
    const { isDeletemodalopen, selected_record } = Stockmovements
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
              <span className='font-bold'>{selected_record?.Stock?.Stockdefine?.Name} </span>
              {Literals.Messages.Deletecheck[Profile.Language]}
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => {
            handleDeletemodal(false)
            handleSelectedStockmovement({})
          }}>
            {Literals.Button.Giveup[Profile.Language]}
          </Button>
          <Button
            content={Literals.Button.Delete[Profile.Language]}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              DeleteStockmovements(selected_record)
              handleDeletemodal(false)
              handleSelectedStockmovement({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
