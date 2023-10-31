import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'
import Literals from './Literals'

export default class PatientsOut extends Component {

    render() {
        const { Profile, Patients, OutPatients, handleOutmodal, Patientdefines } = this.props
        const { isOutmodalopen, selected_record } = Patients

        const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === selected_record?.PatientdefineID)
        return (
            <Modal
                onClose={() => handleOutmodal(false)}
                onOpen={() => handleOutmodal(true)}
                open={isOutmodalopen}
            >
                <Modal.Header>{Literals.Page.Pageoutheader[Profile.Language]}</Modal.Header>
                <Modal.Content image>
                    <Modal.Description>
                        <p>
                            <span className='font-bold'>{`${patientdefine?.Firstname} ${patientdefine?.Lastname}`}</span>
                            {Literals.Messages.outcheck[Profile.Language]}
                        </p>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='black' onClick={() => {
                        handleOutmodal(false)
                    }}>
                        {Literals.Button.Giveup[Profile.Language]}
                    </Button>
                    <Button
                        content={Literals.Button.Update[Profile.Language]}
                        labelPosition='right'
                        icon='checkmark'
                        onClick={() => {
                            OutPatients(selected_record)
                            handleOutmodal(false)
                        }}
                        positive
                    />
                </Modal.Actions>
            </Modal>
        )
    }
}
