import React, { useEffect, useState } from 'react'
import { Button, Dropdown, Form, Label, Modal } from 'semantic-ui-react'
import Literals from './Literals'
import LoadingPage from '../../Utils/LoadingPage'
import validator from '../../Utils/Validator'
import Pagedivider from '../../Common/Styled/Pagedivider'

export default function PatientsEditplace(
    {
        Editpatientplace,
        fillPatientnotification,
        handlePlacemodal,
        handleSelectedPatient,
        GetFloors,
        GetRooms,
        GetBeds,
        Patients,
        Floors,
        Rooms,
        Beds,
        Profile
    }) {

    const [record, setRecord] = useState({})

    const { isPlacemodalopen, selected_record } = Patients

    const isLoadingstatus = Floors.Isloading || Rooms.Isloading || Beds.Isloading;

    const Flooroptions = (Floors.list || []).filter(u => u.Isactive).map(floor => {
        return { key: floor.Uuid, text: floor.Name, value: floor.Uuid }
    })

    const Roomsoptions = (Rooms.list || []).filter(u => u.Isactive && u.FloorID === record?.FloorID).map(room => {
        return { key: room.Uuid, text: room.Name, value: room.Uuid }
    })

    const Bedsoptions = (Beds.list || []).filter(u => u.Isactive && u.RoomID === record?.RoomID).map(bed => {
        return { key: bed.Uuid, text: bed.Name, value: bed.Uuid }
    })

    useEffect(() => {

        const selectedRoom = (Rooms.list || []).find(u => u.Isactive && u.Uuid === record?.RoomID)
        if (!selectedRoom && record?.BedID) {
            const olddata = { ...record }
            delete olddata?.BedID
            setRecord(olddata)
        }

    }, [record])

    const activeFloor = (Floors.list || []).filter(u => u.Isactive).find(u => u.Uuid === selected_record?.FloorID)
    const activeRoom = (Rooms.list || []).filter(u => u.Isactive).find(u => u.Uuid === selected_record?.RoomID)
    const activeBed = (Beds.list || []).filter(u => u.Isactive).find(u => u.Uuid === selected_record?.BedID)

    return (
        <Modal
            onClose={() => {
                setRecord({})
                handlePlacemodal(false)
            }}
            onOpen={() => {
                GetFloors()
                GetRooms()
                GetBeds()
                handlePlacemodal(true)
            }}
            open={isPlacemodalopen}
        >
            <Modal.Header>{Literals.Page.Pageeditplaceheader[Profile.Language]}</Modal.Header>
            <Modal.Content image>
                {isLoadingstatus ? <LoadingPage /> :
                    <Modal.Description >
                        <Label>{`${Literals.Columns.Activeplace[Profile.Language]} :${Literals.Details.Floor[Profile.Language]} ${activeFloor?.Name} ${Literals.Details.Room[Profile.Language]} ${activeRoom?.Name} ${Literals.Details.Bed[Profile.Language]} ${activeBed?.Name}`}</Label>
                        <Pagedivider />
                        <Form>
                            <Form.Group widths={'equal'}>
                                <Form.Field>
                                    <label>{Literals.Details.Floor[Profile.Language]}</label>
                                    <Dropdown
                                        clearable
                                        search
                                        fluid
                                        selection
                                        options={Flooroptions}
                                        onChange={(e, data) => { setRecord({ ...record, FloorID: data.value }) }}
                                        value={record?.FloorID || ''}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>{Literals.Details.Room[Profile.Language]}</label>
                                    <Dropdown
                                        clearable
                                        search
                                        fluid
                                        selection
                                        options={Roomsoptions}
                                        onChange={(e, data) => { setRecord({ ...record, RoomID: data.value }) }}
                                        value={record?.RoomID || ''}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>{Literals.Details.Bed[Profile.Language]}</label>
                                    <Dropdown
                                        clearable
                                        search
                                        fluid
                                        selection
                                        options={Bedsoptions}
                                        onChange={(e, data) => { setRecord({ ...record, BedID: data.value }) }}
                                        value={record?.BedID || ''}
                                    />
                                </Form.Field>
                            </Form.Group>
                        </Form>
                    </Modal.Description>
                }
            </Modal.Content>
            <Modal.Actions>
                <Button color='black' onClick={() => {
                    setRecord({})
                    handlePlacemodal(false)
                }}>
                    {Literals.Button.Giveup[Profile.Language]}
                </Button>
                <Button
                    content={Literals.Button.Update[Profile.Language]}
                    labelPosition='right'
                    icon='checkmark'
                    onClick={() => {
                        let errors = []
                        if (!validator.isUUID(record?.FloorID)) {
                            errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.FloorRequired[Profile.Language] })
                        }
                        if (!validator.isUUID(record?.RoomID)) {
                            errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.RoomRequired[Profile.Language] })
                        }
                        if (!validator.isUUID(record?.BedID)) {
                            errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.BedRequired[Profile.Language] })
                        }
                        if (errors.length > 0) {
                            errors.forEach(error => {
                                fillPatientnotification(error)
                            })
                        } else {
                            Editpatientplace({
                                data: {
                                    ...record,
                                    PatientID: selected_record?.Uuid
                                }
                            })
                            handlePlacemodal(false)
                            setRecord({})
                        }
                    }}
                    positive
                />
            </Modal.Actions>
        </Modal >
    )
}
