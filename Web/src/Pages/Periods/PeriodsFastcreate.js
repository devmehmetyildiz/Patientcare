import React, { useState } from 'react'
import { Button, Form, Modal } from 'semantic-ui-react'

export default function PeriodsFastcreate({ Profile, Periods, FastcreatePeriod, handleFastcreatemodal }) {

    const [data, setData] = useState({})

    const { isFastcreatemodalopen } = Periods

    const t = Profile?.i18n?.t

    return (
        <Modal
            onClose={() => handleFastcreatemodal(false)}
            onOpen={() => {
                handleFastcreatemodal(true)
                setData({})
            }}
            open={isFastcreatemodalopen}
        >
            <Modal.Header>{t('Pages.Periods.Page.FastcreateHeader')}</Modal.Header>
            <Modal.Content image>
                <Modal.Description>
                    <Form>
                        <Form.Group widths={'equal'}>
                            <Form.Input
                                onChange={(e) => { setData({ ...data, 'Formatstringstart': e.target.value }) }}
                                label={t('Pages.Periods.Column.Formatstringstart')}
                                placeholder={t('Pages.Periods.Column.Formatstringstart')}
                            />
                            <Form.Input
                                onChange={(e) => { setData({ ...data, 'Formatstringend': e.target.value }) }}
                                label={t('Pages.Periods.Column.Formatstringend')}
                                placeholder={t('Pages.Periods.Column.Formatstringend')}
                            />
                        </Form.Group>
                        <Form.Group widths={'equal'}>
                            <Form.Input
                                onChange={(e) => { setData({ ...data, 'Starttime': e.target.value }) }}
                                label={t('Pages.Periods.Column.Starttime')}
                                placeholder={t('Pages.Periods.Column.Starttime')}
                                type='time'
                            />
                            <Form.Input
                                onChange={(e) => { setData({ ...data, 'Endtime': e.target.value }) }}
                                label={t('Pages.Periods.Column.Endtime')}
                                placeholder={t('Pages.Periods.Column.Endtime')}
                                type='time'
                            />
                        </Form.Group>
                        <Form.Group widths={'equal'}>
                            <Form.Input
                                onChange={(e) => { setData({ ...data, 'Period': e.target.value }) }}
                                label={t('Pages.Periods.Column.Period')}
                                placeholder={t('Pages.Periods.Column.Period')}
                                type='number'
                            />
                            <Form.Input
                                onChange={(e) => { setData({ ...data, 'Checktime': e.target.value }) }}
                                label={t('Pages.Periods.Column.Checktime')}
                                placeholder={t('Pages.Periods.Column.Checktime')}
                                type='time'
                            />
                        </Form.Group>
                    </Form>
                </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
                <Button color='black' onClick={() => {
                    handleFastcreatemodal(false)
                    setData({})
                }}>
                    {t('Common.Button.Giveup')}
                </Button>
                <Button
                    content={t('Common.Button.Create')}
                    labelPosition='right'
                    icon='checkmark'
                    onClick={() => {
                        FastcreatePeriod({ data })
                        handleFastcreatemodal(false)
                        setData({})
                    }}
                    positive
                />
            </Modal.Actions>
        </Modal>
    )
}
