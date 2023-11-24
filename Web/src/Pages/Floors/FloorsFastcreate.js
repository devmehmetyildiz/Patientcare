import React, { useState } from 'react'
import Literals from './Literals'
import { Button, Dropdown, Form, Label, Modal } from 'semantic-ui-react'
import Pagedivider from '../../Common/Styled/Pagedivider'

export default function FloorsFastcreate({ Profile, Floors, FastcreateFloors, handleFastcreatemodal }) {

    const [record, setRecord] = useState({})

    const { isFastcreatemodalopen } = Floors

    const Genderoptions = [
        { key: 0, text: Literals.Options.Genderoptions.value0[Profile.Language], value: "0" },
        { key: 1, text: Literals.Options.Genderoptions.value1[Profile.Language], value: "1" }
    ]

    return (
        <Modal
            onClose={() => handleFastcreatemodal(false)}
            onOpen={() => {
                handleFastcreatemodal(true)
                setRecord({})
            }}
            open={isFastcreatemodalopen}
        >
            <Modal.Header>{Literals.Page.Pagefastcreateheader[Profile.Language]}</Modal.Header>
            <Modal.Content image>
                <Modal.Description>
                    <Form>
                        <Form.Field>
                            <label className='text-[#000000de] mb-2'>{Literals.Columns.Gender[Profile.Language]}</label>
                            <Dropdown
                                fluid
                                clearable
                                selection
                                options={Genderoptions}
                                onChange={(e, data) => { setRecord({ ...record, Gender: data.value }) }}
                            />
                        </Form.Field>
                        <Form.Group widths={'equal'}>
                            <Form.Input
                                onChange={(e) => { setRecord({ ...record, ['Formatfloorstringstart']: e.target.value }) }}
                                label={Literals.Columns.Formatfloorstringstart[Profile.Language]}
                                placeholder={Literals.Columns.Formatfloorstringstart[Profile.Language]}
                            />
                            <Form.Input
                                onChange={(e) => { setRecord({ ...record, ['Formatfloorstringend']: e.target.value }) }}
                                label={Literals.Columns.Formatfloorstringend[Profile.Language]}
                                placeholder={Literals.Columns.Formatfloorstringend[Profile.Language]}
                            />
                            <Form.Input
                                onChange={(e) => { setRecord({ ...record, ['Floorstartnumber']: e.target.value }) }}
                                label={Literals.Columns.Floorstartnumber[Profile.Language]}
                                placeholder={Literals.Columns.Floorstartnumber[Profile.Language]}
                                type='number'
                            />
                            <Form.Input
                                onChange={(e) => { setRecord({ ...record, ['Floorendnumber']: e.target.value }) }}
                                label={Literals.Columns.Floorendnumber[Profile.Language]}
                                placeholder={Literals.Columns.Floorendnumber[Profile.Language]}
                                type='number'
                            />
                        </Form.Group>
                        <Pagedivider />
                        <Form.Group widths={'equal'}>
                            <Form.Input
                                onChange={(e) => { setRecord({ ...record, ['Formatroomstringstart']: e.target.value }) }}
                                label={Literals.Columns.Formatroomstringstart[Profile.Language]}
                                placeholder={Literals.Columns.Formatroomstringstart[Profile.Language]}
                            />
                            <Form.Input
                                onChange={(e) => { setRecord({ ...record, ['Formatroomstringend']: e.target.value }) }}
                                label={Literals.Columns.Formatroomstringend[Profile.Language]}
                                placeholder={Literals.Columns.Formatroomstringend[Profile.Language]}
                            />
                            <Form.Input
                                onChange={(e) => { setRecord({ ...record, ['Roomstartnumber']: e.target.value }) }}
                                label={Literals.Columns.Roomstartnumber[Profile.Language]}
                                placeholder={Literals.Columns.Roomstartnumber[Profile.Language]}
                                type='number'
                            />
                            <Form.Input
                                onChange={(e) => { setRecord({ ...record, ['Roomendnumber']: e.target.value }) }}
                                label={Literals.Columns.Roomendnumber[Profile.Language]}
                                placeholder={Literals.Columns.Roomendnumber[Profile.Language]}
                                type='number'
                            />
                        </Form.Group>
                        <Pagedivider />
                        <Form.Group widths={'equal'}>
                            <Form.Input
                                onChange={(e) => { setRecord({ ...record, ['Formatbedstringstart']: e.target.value }) }}
                                label={Literals.Columns.Formatbedstringstart[Profile.Language]}
                                placeholder={Literals.Columns.Formatbedstringstart[Profile.Language]}
                            />
                            <Form.Input
                                onChange={(e) => { setRecord({ ...record, ['Formatbedstringend']: e.target.value }) }}
                                label={Literals.Columns.Formatbedstringend[Profile.Language]}
                                placeholder={Literals.Columns.Formatbedstringend[Profile.Language]}
                            />
                            <Form.Input
                                onChange={(e) => { setRecord({ ...record, ['Bedstartnumber']: e.target.value }) }}
                                label={Literals.Columns.Bedstartnumber[Profile.Language]}
                                placeholder={Literals.Columns.Bedstartnumber[Profile.Language]}
                                type='number'
                            />
                            <Form.Input
                                onChange={(e) => { setRecord({ ...record, ['Bedendnumber']: e.target.value }) }}
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
                    setRecord({})
                }}>
                    {Literals.Button.Giveup[Profile.Language]}
                </Button>
                <Button
                    content={Literals.Button.Create[Profile.Language]}
                    labelPosition='right'
                    icon='checkmark'
                    onClick={() => {
                        FastcreateFloors({ data: record })
                        handleFastcreatemodal(false)
                        setRecord({})
                    }}
                    positive
                />
            </Modal.Actions>
        </Modal>
    )
}
