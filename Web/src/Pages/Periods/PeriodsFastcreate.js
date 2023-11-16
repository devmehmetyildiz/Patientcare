import React, { useState } from 'react'
import Literals from './Literals'
import { Button, Form, Modal } from 'semantic-ui-react'

export default function PeriodsFastcreate({ Profile, Periods, FastcreatePeriod, handleFastcreatemodal }) {

    const [data, setData] = useState({})

    const { isFastcreatemodalopen } = Periods

    return (
        <Modal
            onClose={() => handleFastcreatemodal(false)}
            onOpen={() => {
                handleFastcreatemodal(true)
                setData({})
            }}
            open={isFastcreatemodalopen}
        >
            <Modal.Header>{Literals.Page.Pagefastcreateheader[Profile.Language]}</Modal.Header>
            <Modal.Content image>
                <Modal.Description>
                    <Form>
                        <Form.Group widths={'equal'}>
                            <Form.Input
                                onChange={(e) => { setData({ ...data, ['Formatstringstart']: e.target.value }) }}
                                label={Literals.Columns.Formatstringstart[Profile.Language]}
                                placeholder={Literals.Columns.Formatstringstart[Profile.Language]}
                            />
                            <Form.Input
                                onChange={(e) => { setData({ ...data, ['Formatstringend']: e.target.value }) }}
                                label={Literals.Columns.Formatstringend[Profile.Language]}
                                placeholder={Literals.Columns.Formatstringend[Profile.Language]}
                            />
                        </Form.Group>
                        <Form.Group widths={'equal'}>
                            <Form.Input
                                onChange={(e) => { setData({ ...data, ['Starttime']: e.target.value }) }}
                                label={Literals.Columns.Starttime[Profile.Language]}
                                placeholder={Literals.Columns.Starttime[Profile.Language]}
                                type='time'
                            />
                            <Form.Input
                                onChange={(e) => { setData({ ...data, ['Endtime']: e.target.value }) }}
                                label={Literals.Columns.Endtime[Profile.Language]}
                                placeholder={Literals.Columns.Endtime[Profile.Language]}
                                type='time'
                            />
                        </Form.Group>
                        <Form.Group widths={'equal'}>
                            <Form.Input
                                onChange={(e) => { setData({ ...data, ['Period']: e.target.value }) }}
                                label={Literals.Columns.Period[Profile.Language]}
                                placeholder={Literals.Columns.Period[Profile.Language]}
                                type='number'
                            />
                            <Form.Input
                                onChange={(e) => { setData({ ...data, ['Checktime']: e.target.value }) }}
                                label={Literals.Columns.Checktime[Profile.Language]}
                                placeholder={Literals.Columns.Checktime[Profile.Language]}
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
                    {Literals.Button.Giveup[Profile.Language]}
                </Button>
                <Button
                    content={Literals.Button.Create[Profile.Language]}
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
