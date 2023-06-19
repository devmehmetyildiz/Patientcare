import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'
import Literals from './Literals'

export default class PurchaseordersComplete extends Component {
    render() {
        const { Profile, Purchaseorders, CompletePurchaseorders, handleCompletemodal, handleSelectedPurchaseorder } = this.props
        const { isCompletemodalopen, selected_record } = Purchaseorders
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
                            <span className='font-bold'>{selected_record?.Purchasenumber} </span>
                            {Literals.Messages.Completecheck[Profile.Language]}
                        </p>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='black' onClick={() => {
                        handleCompletemodal(false)
                        handleSelectedPurchaseorder({})
                    }}>
                        {Literals.Button.Giveup[Profile.Language]}
                    </Button>
                    <Button
                        content={Literals.Button.Complete[Profile.Language]}
                        labelPosition='right'
                        icon='checkmark'
                        onClick={() => {
                            CompletePurchaseorders(selected_record)
                            handleCompletemodal(false)
                            handleSelectedPurchaseorder({})
                        }}
                        positive
                    />
                </Modal.Actions>
            </Modal>
        )
    }
}
