import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'
import Literals from './Literals'

export default class StocksDelete extends Component {
  render() {
    const { Profile, Stocks, DeleteStocks, handleDeletemodal, handleSelectedStock, Stockdefines } = this.props
    const { isDeletemodalopen, selected_record } = Stocks

    const stockdefine = (Stockdefines.list || []).find(u => u.Uuid === selected_record.StockdefineID)
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
              <span className='font-bold'>{stockdefine?.Name} </span>
              {Literals.Messages.Deletecheck[Profile.Language]}
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => {
            handleDeletemodal(false)
            handleSelectedStock({})
          }}>
            {Literals.Button.Giveup[Profile.Language]}
          </Button>
          <Button
            content={Literals.Button.Delete[Profile.Language]}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              DeleteStocks(selected_record)
              handleDeletemodal(false)
              handleSelectedStock({})
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
