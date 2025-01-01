import React from 'react'
import { Button, Dimmer, DimmerDimmable, Loader, Modal } from 'semantic-ui-react'
import { Formatfulldate } from '../../Utils/Formatdate'
export default function MainteanceplansComplete(props) {

    const { open, setOpen, record, setRecord, Mainteanceplans, Profile, CompleteMainteanceplans } = props

    const t = Profile?.i18n?.t

    const name = `${Formatfulldate(record?.Startdate, true)}`

    return (
        <DimmerDimmable blurring >
            <Modal
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                open={open}
            >
                <Modal.Header >{t('Pages.Mainteanceplans.Page.CompleteHeader')}</Modal.Header>
                <Modal.Content image>
                    <Dimmer inverted active={Mainteanceplans.isLoading}>
                        <Loader inverted active />
                    </Dimmer>
                    <Modal.Description>
                        <p>
                            <span className='font-bold'>{name} </span>
                            {t('Pages.Mainteanceplans.Complete.Label.Check')}
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
                        loading={Mainteanceplans.isLoading}
                        content={t('Common.Button.Complete')}
                        labelPosition='right'
                        icon='checkmark'
                        onClick={() => {
                            CompleteMainteanceplans({
                                uuid: record?.Uuid || '',
                                onSuccess: () => {
                                    setOpen(false)
                                    setRecord(null)
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
