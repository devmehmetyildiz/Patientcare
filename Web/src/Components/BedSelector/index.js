import React, { useEffect, useState } from 'react'
import { Button, Card, Label, Loader, Modal, Popup, Tab } from 'semantic-ui-react'
import Literals from './Literals'
import { connect } from 'react-redux'
import { GetPatientByPlace } from '../../Redux/PatientSlice'
import validator from '../../Utils/Validator'

function BedSelector({
    Floors,
    Rooms,
    Beds,
    Profile,
    setSelectedBed,
    fillNotification,
    selectedBed
}) {
    const [open, setOpen] = useState(false)
    const [record, setRecord] = useState(selectedBed);
    const FLOOR_MEN = "0"
    const FLOOR_WOMEN = "1"
    const t = Profile?.i18n?.t || null

    const getViewbase = (list) => {
        return (list || []).length > 0 ?
            <div key={Math.random()} className='
                 flex flex-row justify-start 
                items-center flex-wrap gap-5 '>
                {list.map((option, index) => {
                    return <div
                        key={index}
                        className={option?.BedID === record ? 'bordereddiv' : ''}
                        onClick={() => { setRecord(option?.BedID) }}
                    >
                        <Card
                            className=' !w-auto !hover:shadow-xl !hover:bg-white'
                            link
                            description={<div
                                className={`
                                 flex relative flex-col justify-start items-start 
                         gap-2 p-4  w-full rounded-lg
                          cursor-pointer transition-all ease-in-out duration-500  z-1 
                                `}
                            >
                                <div style={{ backgroundColor: option?.Isoccupied ? 'green' : 'red' }} className='absolute right-1 top-1 p-2 rounded-full'></div>
                                <div>{option?.Floorname}</div>
                                <div>{option?.Roomname}</div>
                                <div>{option?.Bedname}</div>
                            </div>}
                        >
                        </Card>
                    </div>
                })}
            </div>
            : null
    }

    const Bedsoption = (Beds.list || []).map(bed => {
        const room = (Rooms.list || []).find(u => u.Uuid === bed?.RoomID)
        const floor = (Floors.list || []).find(u => u.Uuid === room?.FloorID)
        const Isoccupied = bed?.Isoccupied

        return {
            Bedname: bed?.Name,
            Roomname: room?.Name,
            Floorname: floor?.Name,
            BedID: bed?.Uuid,
            RoomID: room?.Uuid,
            FloorID: floor?.Uuid,
            Isoccupied: Isoccupied,
            Gender: floor?.Gender
        }
    })

    const Allview = getViewbase(Bedsoption);
    const Onlymenview = getViewbase(Bedsoption.filter(u => u.Gender === FLOOR_MEN));
    const Onlywomenview = getViewbase(Bedsoption.filter(u => u.Gender === FLOOR_WOMEN));

    let panes = [
        { menuItem: t('Components.BedSelector.Tab.Allview'), pane: { key: 'all', content: Allview } },
        { menuItem: t('Components.BedSelector.Tab.Onlymen'), pane: { key: 'allmen', content: Onlymenview } },
        { menuItem: t('Components.BedSelector.Tab.Onlywomen'), pane: { key: 'allwomen', content: Onlywomenview } },
    ];

    (Floors.list || []).forEach(floor => {
        panes.push({
            menuItem: floor?.Name,
            pane: { key: floor?.Uuid, content: getViewbase(Bedsoption.filter(u => u.FloorID === floor?.Uuid)) }
        })
    });

    const bed = (Beds.list || []).find(u => u.Uuid === record)
    const room = (Rooms.list || []).find(u => u.Uuid === bed?.RoomID)
    const floor = (Floors.list || []).find(u => u.Uuid === room?.FloorID)

    return (
        <React.Fragment>
            <div className='my-4'>
                <Button
                    floated='right'
                    className='!bg-[#2355a0] !text-white'
                    onClick={() => { setOpen(true) }}>
                    {t('Components.BedSelector.Button.BedSelect')}
                </Button>
            </div>
            <Modal
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                open={open}
                size='large'
            >
                <Modal.Header>{t('Components.BedSelector.Page.Header')}</Modal.Header>
                <Modal.Content image>
                    <div className='w-full flex flex-col justify-center items-center'>
                        <div className='w-full flex justify-end items-end'>
                            <Card
                                link
                                className='styled-card !w-auto'
                                meta={<Label className='!bg-[#2355a0] !text-white'>
                                    {t('Components.BedSelector.Label.Floor')}
                                    <Label.Detail>
                                        {floor?.Name || t('Common.NoDataFound')}
                                    </Label.Detail>
                                </Label>}
                                header={<Label className='!bg-[#2355a0] !text-white'>
                                    {t('Components.BedSelector.Label.Room')}
                                    <Label.Detail>
                                        {room?.Name || t('Common.NoDataFound')}
                                    </Label.Detail>
                                </Label>}
                                description={<Label className='!bg-[#2355a0] !text-white'>
                                    {t('Components.BedSelector.Label.Bed')}
                                    <Label.Detail>
                                        {bed?.Name || t('Common.NoDataFound')}
                                    </Label.Detail>
                                </Label>}
                            />
                        </div>
                        <Tab panes={panes} renderActiveOnly={false} />
                    </div>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='black' onClick={() => {
                        setOpen(false)
                    }}>
                        {t('Common.Button.Giveup')}
                    </Button>
                    <Button
                        content={t('Common.Button.Select')}
                        labelPosition='right'
                        icon='checkmark'
                        onClick={() => {
                            if (validator.isUUID(bed?.Uuid) && validator.isUUID(room?.Uuid) && validator.isUUID(floor?.Uuid)) {
                                setSelectedBed(record)
                                setOpen(false)
                            } else {
                                fillNotification({ type: 'Error', code: t('Components.BedSelector.Page.Header'), description: t('Components.BedSelector.Messages.NeedBed') })
                            }
                        }}
                        positive
                    />
                </Modal.Actions>
            </Modal>
        </React.Fragment>
    )
}

const mapStateToProps = (state) => ({
    Profile: state.Profile,
    Patients: state.Patients
})

const mapDispatchToProps = {
    GetPatientByPlace
}

export default connect(mapStateToProps, mapDispatchToProps)(BedSelector)