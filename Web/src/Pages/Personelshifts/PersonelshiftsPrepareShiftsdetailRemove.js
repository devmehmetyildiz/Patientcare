import React, { useState } from 'react'
import { Button, Icon, Modal } from 'semantic-ui-react'

export default function PersonelshiftsPrepareShiftsdetailRemove(props) {

    const { Profile, Users, personelshift, personelshifts, setPersonelshifts } = props
    const [open, setOpen] = useState(false)

    const t = Profile?.i18n?.t

    const user = (Users.list || []).find(u => u?.Uuid === personelshift?.PersonelID)

    return (
        <React.Fragment>
            <Icon link size='large' color='red' name='alternate trash' onClick={() => setOpen(true)} />
            <Modal
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                open={open}
            >
                <Modal.Header>{t('Pages.Personelshifts.Page.PreparePersonelRemoveHeader')}</Modal.Header>
                <Modal.Content image>
                    <Modal.Description>
                        <p>
                            <span className='font-bold'>{`${user?.Name} ${user?.Surname} `}</span>
                            {t('Pages.Personelshifts.Messages.DeletePersonel')}
                        </p>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='black' onClick={() => {
                        setOpen(false)
                    }}>
                        {t('Common.Button.Giveup')}
                    </Button>
                    <Button
                        content={t('Common.Button.Delete')}
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
