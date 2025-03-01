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
                {list.sort((a, b) => a.index - b.index).map((option) => {

                    const patient = (Patients?.list || []).find(u => u.BedID === option?.BedID)
                    const patientdefine = (Patientdefines?.list || []).find(u => u.Uuid === patient?.PatientdefineID)
                    return <div
                        key={option?.index}
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
                        <div className='p-2'>
                            <Card
                                className={option?.BedID === record ? '!bg-[blue]' : option?.Isoccupied ? '!bg-[red]' : '!bg-[green] '}
                            >
                                <Card.Content className='!p-2' header={`${option?.Floorname} ${option?.Roomname} ${option?.Bedname}`} />
                                <Card.Content className='!p-2' description={option?.Isoccupied ? t('Components.BedSelector.Messages.Filled') : t('Components.BedSelector.Messages.Empty')} />
                                <Card.Content className='!p-2 flex flex-row justify-start items-start'>
                                    <Icon name='user' />
                                    <div className='whitespace-nowrap overflow-hidden overflow-ellipsis'>
                                        {option?.Isoccupied ? `${patientdefine?.Firstname} ${patientdefine?.Lastname}  - ${patientdefine?.CountryID}` : ''}
                                    </div>
                                </Card.Content>
                            </Card>
                        </div>
                    </div>
                })}
            </div>
            : null
    }

    const Bedsoption = (Beds.list || []).map((bed, index) => {
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
            Gender: floor?.Gender,
            index: index
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
                        <Tab menu={{ fluid: true, vertical: true, tabular: true }} panes={panes} renderActiveOnly={false} />
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