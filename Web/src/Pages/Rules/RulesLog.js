import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'
import { NoDataScreen, Footerwrapper } from '../../Components'

export default class RulesLog extends Component {

    render() {
        const { Profile, Rules, handleLogmodal, ClearRulelogs, GetRulelogswithoutloading } = this.props

        const t = Profile?.i18n?.t

        const { isLogmodalopen, loglist, selected_record } = Rules
        return (
            <Modal
                onClose={() => handleLogmodal(false)}
                onOpen={() => handleLogmodal(true)}
                open={isLogmodalopen}
            >
                <Modal.Header>
                    <Footerwrapper>
                        {`${t('Pages.Rules.Page.LogHeader')} - ${selected_record.Name}`}
                        <Button color='red' onClick={() => {
                            GetRulelogswithoutloading(selected_record?.Uuid)
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
                                    <p className='mr-2'>{this.getLocalDate(log.Date)}</p>
                                    <p>{log.Log}</p>
                                </div>
                            })

                            : <NoDataScreen message={t('Common.NoDataFound')} />}
                    </div>
                </Modal.Content>
                <Modal.Actions>
                    <Footerwrapper>
                        <Button color='black' onClick={() => {
                            ClearRulelogs(selected_record)
                        }}>
                            {t('Common.Button.Goback')}
                        </Button>
                        <Button
                            content={t('Common.Button.Close')}
                            labelPosition='right'
                            icon='checkmark'
                            onClick={() => {
                                handleLogmodal(false)
                            }}
                            positive
                        />
                    </Footerwrapper>
                </Modal.Actions>
            </Modal>
        )
    }
    getLocalDate = (date) => {
        var datestr = new Date(date);
        return datestr.toLocaleString('tr-TR', { timeZone: 'UTC' })
    }
}
