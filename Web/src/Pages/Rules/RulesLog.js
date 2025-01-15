import React from 'react'
import { Button, Modal } from 'semantic-ui-react'
import { NoDataScreen, Footerwrapper } from '../../Components'

export default function RulesLog(props) {
    const { Profile, Rules, open, setOpen, record, setRecord, ClearRulelogs, GetRulelogswithoutloading } = props


    const getLocalDate = (date) => {
        var datestr = new Date(date);
        return `${datestr.toLocaleDateString('tr')} ${datestr.toLocaleTimeString('tr')}`
    }

    const t = Profile?.i18n?.t

    const { loglist } = Rules

    return (
        <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            size='fullscreen'
        >
            <Modal.Header>
                <Footerwrapper>
                    {`${t('Pages.Rules.Page.LogHeader')} - ${record?.Name}`}
                    <Button color='red' onClick={() => {
                        GetRulelogswithoutloading(record?.Uuid)
                    }}>
                        {t('Pages.Rules.Column.Refresh')}
                    </Button>
                </Footerwrapper>
            </Modal.Header>
            <Modal.Content image>
                <div className='flex flex-col h-[60vh] overflow-auto w-full'>{
                    loglist.length > 0 ?
                        loglist.map((log, index) => {
                            return <div key={index} className='flex flex-row '>
                                <p className='mr-2 whitespace-nowrap'>{getLocalDate(log.Date)}</p>
                                <p>{log.Log}</p>
                            </div>
                        })

                        : <NoDataScreen message={t('Common.NoDataFound')} />}
                </div>
            </Modal.Content>
            <Modal.Actions>
                <Footerwrapper>
                    <Button color='black' onClick={() => {
                        ClearRulelogs(record)
                    }}>
                        {t('Common.Button.Clear')}
                    </Button>
                    <Button
                        content={t('Common.Button.Close')}
                        labelPosition='right'
                        icon='checkmark'
                        onClick={() => {
                            setOpen(false)
                            setRecord(null)
                        }}
                        positive
                    />
                </Footerwrapper>
            </Modal.Actions>
        </Modal>
    )
}