import React from 'react'
import { Button, Dimmer, DimmerDimmable, Loader, Modal } from 'semantic-ui-react'
import { Formatfulldate } from '../../Utils/Formatdate'

export default function MainteanceplansSavepreview(props) {

    const { open, setOpen, record, setRecord, Mainteanceplans, Profile, SavepreviewMainteanceplans } = props

    const t = Profile?.i18n?.t

    const name = `${Formatfulldate(record?.Startdate, true)}`

    return (
        <DimmerDimmable blurring >
            <Modal
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                open={open}
            >
                <Modal.Header >{t('Pages.Mainteanceplans.Page.SavepreviewHeader')}</Modal.Header>
                <Modal.Content image>
                    <Dimmer inverted active={Mainteanceplans.isLoading}>
                        <Loader inverted active />
                    </Dimmer>
                    <Modal.Description>
                        <p>
                            <span className='font-bold'>{name} </span>
                            {t('Pages.Mainteanceplans.Savepreview.Label.Check')}
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
                        content={t('Common.Button.Savepreview')}
                        labelPosition='right'
                        icon='checkmark'
                        onClick={() => {
                            SavepreviewMainteanceplans({
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
