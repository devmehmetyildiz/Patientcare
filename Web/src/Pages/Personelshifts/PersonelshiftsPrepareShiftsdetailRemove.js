import React, { useState } from 'react'
import { Button, Icon, Modal } from 'semantic-ui-react'
import Literals from './Literals'

export default function PersonelshiftsPrepareShiftsdetailRemove(props) {

    const { Profile, Users, personelshift, personelshifts, setPersonelshifts } = props
    const [open, setOpen] = useState(false)

    const user = (Users.list || []).find(u => u?.Uuid === personelshift?.PersonelID)

    return (
        <React.Fragment>
            <Icon link size='large' color='red' name='alternate trash' onClick={() => setOpen(true)} />
            <Modal
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                open={open}
            >
                <Modal.Header>{Literals.Page.Pageprepareshiftdetailremovedeleteheader[Profile.Language]}</Modal.Header>
                <Modal.Content image>
                    <Modal.Description>
                        <p>
                            <span className='font-bold'>{`${user?.Name} ${user?.Surname} `}</span>
                            {Literals.Messages.Deletepersonel[Profile.Language]}
                        </p>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='black' onClick={() => {
                        setOpen(false)
                    }}>
                        {Literals.Button.Giveup[Profile.Language]}
                    </Button>
                    <Button
                        content={Literals.Button.Delete[Profile.Language]}
                        labelPosition='right'
                        icon='checkmark'
                        onClick={() => {
                            setPersonelshifts([...personelshifts.filter(u => u.PersonelID !== personelshift?.PersonelID)])
                        }}
                        positive
                    />
                </Modal.Actions>
            </Modal>
        </React.Fragment>
    )
}
