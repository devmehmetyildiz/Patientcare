import React, { useState } from 'react'
import Literals from './Literals'
import { Button, Form, Modal } from 'semantic-ui-react'
import Pagedivider from '../../Common/Styled/Pagedivider'

export default function FloorsFastcreate({ Profile, Floors, FastcreateFloors, handleFastcreatemodal }) {

    const [data, setData] = useState({})

    const { isFastcreatemodalopen } = Floors

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
                                onChange={(e) => { setData({ ...data, ['Formatfloorstringstart']: e.target.value }) }}
                                label={Literals.Columns.Formatfloorstringstart[Profile.Language]}
                                placeholder={Literals.Columns.Formatfloorstringstart[Profile.Language]}
                            />
                            <Form.Input
                                onChange={(e) => { setData({ ...data, ['Formatfloorstringend']: e.target.value }) }}
                                label={Literals.Columns.Formatfloorstringend[Profile.Language]}
                                placeholder={Literals.Columns.Formatfloorstringend[Profile.Language]}
                            />
                            <Form.Input
                                onChange={(e) => { setData({ ...data, ['Floorstartnumber']: e.target.value }) }}
                                label={Literals.Columns.Floorstartnumber[Profile.Language]}
                                placeholder={Literals.Columns.Floorstartnumber[Profile.Language]}
                                type='number'
                            />
                            <Form.Input
                                onChange={(e) => { setData({ ...data, ['Floorendnumber']: e.target.value }) }}
                                label={Literals.Columns.Floorendnumber[Profile.Language]}
                                placeholder={Literals.Columns.Floorendnumber[Profile.Language]}
                                type='number'
                            />
                        </Form.Group>
                        <Pagedivider />
                        <Form.Group widths={'equal'}>
                            <Form.Input
                                onChange={(e) => { setData({ ...data, ['Formatroomstringstart']: e.target.value }) }}
                                label={Literals.Columns.Formatroomstringstart[Profile.Language]}
                                placeholder={Literals.Columns.Formatroomstringstart[Profile.Language]}
                            />
                            <Form.Input
                                onChange={(e) => { setData({ ...data, ['Formatroomstringend']: e.target.value }) }}
                                label={Literals.Columns.Formatroomstringend[Profile.Language]}
                                placeholder={Literals.Columns.Formatroomstringend[Profile.Language]}
                            />
                            <Form.Input
                                onChange={(e) => { setData({ ...data, ['Roomstartnumber']: e.target.value }) }}
                                label={Literals.Columns.Roomstartnumber[Profile.Language]}
                                placeholder={Literals.Columns.Roomstartnumber[Profile.Language]}
                                type='number'
                            />
                            <Form.Input
                                onChange={(e) => { setData({ ...data, ['Roomendnumber']: e.target.value }) }}
                                label={Literals.Columns.Roomendnumber[Profile.Language]}
                                placeholder={Literals.Columns.Roomendnumber[Profile.Language]}
                                type='number'
                            />
                        </Form.Group>
                        <Pagedivider />
                        <Form.Group widths={'equal'}>
                            <Form.Input
                                onChange={(e) => { setData({ ...data, ['Formatbedstringstart']: e.target.value }) }}
                                label={Literals.Columns.Formatbedstringstart[Profile.Language]}
                                placeholder={Literals.Columns.Formatbedstringstart[Profile.Language]}
                            />
                            <Form.Input
                                onChange={(e) => { setData({ ...data, ['Formatbedstringend']: e.target.value }) }}
                                label={Literals.Columns.Formatbedstringend[Profile.Language]}
                                placeholder={Literals.Columns.Formatbedstringend[Profile.Language]}
                            />
                            <Form.Input
                                onChange={(e) => { setData({ ...data, ['Bedstartnumber']: e.target.value }) }}
                                label={Literals.Columns.Bedstartnumber[Profile.Language]}
                                placeholder={Literals.Columns.Bedstartnumber[Profile.Language]}
                                type='number'
                            />
                            <Form.Input
                                onChange={(e) => { setData({ ...data, ['Bedendnumber']: e.target.value }) }}
                                label={Literals.Columns.Bedendnumber[Profile.Language]}
                                placeholder={Literals.Columns.Bedendnumber[Profile.Language]}
                                type='number'
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
                        FastcreateFloors({ data })
                        handleFastcreatemodal(false)
                        setData({})
                    }}
                    positive
                />
            </Modal.Actions>
        </Modal>
    )
}
