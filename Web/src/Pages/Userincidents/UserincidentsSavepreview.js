import React from 'react'
import { Button, Dimmer, DimmerDimmable, Loader, Modal } from 'semantic-ui-react'

export default function UserincidentsSavepreview(props) {

    const { open, setOpen, record, setRecord, Userincidents, Users, Profile, SavepreviewUserincidents, GetUserincidents } = props

    const t = Profile?.i18n?.t

    const user = (Users.list || []).find(u => u.Uuid === record?.UserID)
    const name = `${user?.Name} ${user?.Surname}`

    return (
        <DimmerDimmable blurring >
            <Modal
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                open={open}
            >
                <Modal.Header >{t('Pages.Userincidents.Page.SavepreviewHeader')}</Modal.Header>
                <Modal.Content image>
                    <Dimmer inverted active={Userincidents.isLoading}>
                        <Loader inverted active />
                    </Dimmer>
                    <Modal.Description>
                        <p>
                            <span className='font-bold'>{name} </span>
                            {t('Pages.Userincidents.Savepreview.Label.Check')}
                        </p>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='black' onClick={() => {
                        setOpen(false)
                        setRecord(null)
                    }}>
                        {t('Common.Button.Giveup')}
                    </Button>
                    <Button
                        content={t('Common.Button.Savepreview')}
                        labelPosition='right'
                        icon='checkmark'
                        onClick={() => {
                            SavepreviewUserincidents({
                                userincidentID: record?.Uuid || '',
                                onSuccess: () => {
                                    setOpen(false)
                                    setRecord(null)
                                    GetUserincidents()
                                }
                            })
                        }}
                        positive
                    />
                </Modal.Actions>
            </Modal>
        </DimmerDimmable>
    )
}
