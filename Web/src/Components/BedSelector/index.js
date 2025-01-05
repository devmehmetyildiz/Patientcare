import React, { useEffect, useState } from 'react'
import { Button, Card, Icon, Modal, Label, Popup, Segment, Tab } from 'semantic-ui-react'
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
    selectedBed,
    Patients,
    Patientdefines,
    canTransfer
}) {
    const [open, setOpen] = useState(false)
    const [record, setRecord] = useState(selectedBed);
    const FLOOR_MEN = "0"
    const FLOOR_WOMEN = "1"
    const t = Profile?.i18n?.t || null

    useEffect(() => {
        setRecord(selectedBed)
    }, [open])

    const getViewbase = (list) => {
        return (list || []).length > 0 ?
            <div key={Math.random()} className='
                grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8   overflow-y-auto max-h-[60vh]
                '>
                {list.map((option, index) => {

                    const patient = (Patients?.list || []).find(u => u.BedID === option?.BedID)
                    const patientdefine = (Patientdefines?.list || []).find(u => u.Uuid === patient?.PatientdefineID)
                    return <div
                        key={index}
                        className={`!cursor-pointer !hover:shadow-lg`}
                        onClick={() => {
                            if (
                                !canTransfer &&
                                option?.Isoccupied
                            ) {
                                fillNotification({
                                    type: 'Information',
                                    code: t('Pages.Beds.Page.Header'),
                                    description: t('Pages.Beds.Messages.Filled'),
                                })
                            } else {
                                setRecord(record === option?.BedID ? null : option?.BedID)
                            }

                        }}
                    >
                        <Segment className='!p-1'>
                            <div className='mb-1 flex flex-row justify-between items-start max-w-[150px]'>
                                <Icon name='bed' />
                                {option?.Isoccupied
                                    ? <Popup
                                        on={'hover'}
                                        content={`${patientdefine?.Firstname} ${patientdefine?.Lastname}  - ${patientdefine?.CountryID}`}
                                        trigger={<div className=' overflow-hidden whitespace-nowrap text-ellipsis'>{`${patientdefine?.Firstname} ${patientdefine?.Lastname} - ${patientdefine?.CountryID}`}</div>}
                                    />
                                    : null
                                }
                            </div>
                            <Label
                                size='large'
                                color={option?.BedID === record ? 'blue' : option?.Isoccupied ? 'red' : 'green'}
                                className='!flex !flex-col !justify-start !items-start'
                            >
                                {option?.Bedname}
                                <Label.Detail className='!ml-0'>
                                    {option?.Floorname}
                                </Label.Detail>
                                <Label.Detail className='!ml-0'>
                                    {option?.Roomname}
                                </Label.Detail>
                            </Label>
                        </Segment>
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
                centered={false}
                size='large'
            >
                <Modal.Header>{t('Components.BedSelector.Page.Header')}</Modal.Header>
                <Modal.Content image>
                    <div className='w-full flex flex-col justify-center items-center gap-2'>
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