import React, { useState } from 'react'
import { Button, Dropdown, Form, Modal } from 'semantic-ui-react'
import { Pagedivider } from '../../Components'
import { GENDER_OPTION_MEN, GENDER_OPTION_WOMEN } from '../../Utils/Constants'

export default function FloorsFastcreate({ Profile, Floors, FastcreateFloors, handleFastcreatemodal }) {

    const t = Profile?.i18n?.t

    const [record, setRecord] = useState({})

    const { isFastcreatemodalopen } = Floors

    const Genderoptions = [
        { key: 0, text: t('Option.Genderoption.Men'), value: GENDER_OPTION_MEN },
        { key: 1, text: t('Option.Genderoption.Women'), value: GENDER_OPTION_WOMEN }
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
            <Modal.Header>{t('Pages.Floors.Page.FastCreateHeader')}</Modal.Header>
            <Modal.Content image>
                <Modal.Description>
                    <Form>
                        <Form.Field>
                            <label className='text-[#000000de] mb-2'>{t('Pages.Floors.Column.Gender')}</label>
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
                                onChange={(e) => { setRecord({ ...record, 'Formatfloorstringstart': e.target.value }) }}
                                label={t('Pages.Floors.Column.Formatfloorstringstart')}
                                placeholder={t('Pages.Floors.Column.Formatfloorstringstart')}
                            />
                            <Form.Input
                                onChange={(e) => { setRecord({ ...record, 'Formatfloorstringend': e.target.value }) }}
                                label={t('Pages.Floors.Column.Formatfloorstringend')}
                                placeholder={t('Pages.Floors.Column.Formatfloorstringend')}
                            />
                            <Form.Input
                                onChange={(e) => { setRecord({ ...record, 'Floorstartnumber': e.target.value }) }}
                                label={t('Pages.Floors.Column.Floorstartnumber')}
                                placeholder={t('Pages.Floors.Column.Floorstartnumber')}
                                type='number'
                            />
                            <Form.Input
                                onChange={(e) => { setRecord({ ...record, 'Floorendnumber': e.target.value }) }}
                                label={t('Pages.Floors.Column.Floorendnumber')}
                                placeholder={t('Pages.Floors.Column.Floorendnumber')}
                                type='number'
                            />
                        </Form.Group>
                        <Pagedivider />
                        <Form.Group widths={'equal'}>
                            <Form.Input
                                onChange={(e) => { setRecord({ ...record, 'Formatroomstringstart': e.target.value }) }}
                                label={t('"Pages.Floors.Column.Formatroomstringstart')}
                                placeholder={t('"Pages.Floors.Column.Formatroomstringstart')}
                            />
                            <Form.Input
                                onChange={(e) => { setRecord({ ...record, 'Formatroomstringend': e.target.value }) }}
                                label={t('Pages.Floors.Column.Formatroomstringend')}
                                placeholder={t('Pages.Floors.Column.Formatroomstringend')}
                            />
                            <Form.Input
                                onChange={(e) => { setRecord({ ...record, 'Roomstartnumber': e.target.value }) }}
                                label={t('Pages.Floors.Column.Roomstartnumber')}
                                placeholder={t('Pages.Floors.Column.Roomstartnumber')}
                                type='number'
                            />
                            <Form.Input
                                onChange={(e) => { setRecord({ ...record, 'Roomendnumber': e.target.value }) }}
                                label={t('Pages.Floors.Column.Roomendnumber')}
                                placeholder={t('Pages.Floors.Column.Roomendnumber')}
                                type='number'
                            />
                        </Form.Group>
                        <Pagedivider />
                        <Form.Group widths={'equal'}>
                            <Form.Input
                                onChange={(e) => { setRecord({ ...record, 'Formatbedstringstart': e.target.value }) }}
                                label={t('Pages.Floors.Column.Formatbedstringstart')}
                                placeholder={t('Pages.Floors.Column.Formatbedstringstart')}
                            />
                            <Form.Input
                                onChange={(e) => { setRecord({ ...record, 'Formatbedstringend': e.target.value }) }}
                                label={t('Pages.Floors.Column.Formatbedstringend')}
                                placeholder={t('Pages.Floors.Column.Formatbedstringend')}
                            />
                            <Form.Input
                                onChange={(e) => { setRecord({ ...record, 'Bedstartnumber': e.target.value }) }}
                                label={t('Pages.Floors.Column.Bedstartnumber')}
                                placeholder={t('Pages.Floors.Column.Bedstartnumber')}
                                type='number'
                            />
                            <Form.Input
                                onChange={(e) => { setRecord({ ...record, 'Bedendnumber': e.target.value }) }}
                                label={t('Pages.Floors.Column.Bedendnumber')}
                                placeholder={t('Pages.Floors.Column.Bedendnumber')}
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
                    {t('Common.Button.Giveup')}
                </Button>
                <Button
                    content={t('Common.Button.Delete')}
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
