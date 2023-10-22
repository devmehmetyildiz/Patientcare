import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'
import Literals from './Literals'

export default class PatientsIn extends Component {

    render() {
        const { Profile, Patients, InPatients, handleInmodal, Patientdefines } = this.props
        const { isInmodalopen, selected_record } = Patients

        const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === selected_record?.PatientdefineID)
        return (
            <Modal
                onClose={() => handleInmodal(false)}
                onOpen={() => handleInmodal(true)}
                open={isInmodalopen}
            >
                <Modal.Header>{Literals.Page.Pageinheader[Profile.Language]}</Modal.Header>
                <Modal.Content image>
                    <Modal.Description>
                        <p>
                            <span className='font-bold'>{`${patientdefine?.Firstname} ${patientdefine?.Lastname}`}</span>
                            {Literals.Messages.incheck[Profile.Language]}
                        </p>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='black' onClick={() => {
                        handleInmodal(false)
                    }}>
                        {Literals.Button.Giveup[Profile.Language]}
                    </Button>
                    <Button
                        content={Literals.Button.Update[Profile.Language]}
                        labelPosition='right'
                        icon='checkmark'
                        onClick={() => {
                            InPatients(selected_record)
                            handleInmodal(false)
                        }}
                        positive
                    />
                </Modal.Actions>
            </Modal>
        )
    }
}
