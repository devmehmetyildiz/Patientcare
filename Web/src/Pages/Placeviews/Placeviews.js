import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Card, Grid, GridColumn, Icon, Label, Loader, Tab } from 'semantic-ui-react'
import Literals from './Literals'
import { Contentwrapper, Headerwrapper, LoadingPage, NoDataScreen, Pagedivider, Pagewrapper, Profilephoto, Settings } from '../../Components'
import { ROUTES } from '../../Utils/Constants'
import config from '../../Config'

export default function Placeviews(props) {
    const { GetPatients, GetPatientdefines, GetFloors, GetRooms, GetBeds, GetCases, GetFiles, GetUsagetypes,
        Files, Usagetypes, Patients, Floors, Rooms, Beds, Profile, Patientdefines, Cases, fillPatientnotification } = props

    useEffect(() => {
        GetPatients()
        GetPatientdefines()
        GetFloors()
        GetRooms()
        GetBeds()
        GetCases()
        GetFiles()
        GetUsagetypes()
    }, [])


    const list = (Beds.list || []).filter(u => u.Isactive).map(bed => {
        const room = (Rooms.list || []).find(u => u.Uuid === bed?.RoomID)
        const floor = (Floors.list || []).find(u => u.Uuid === room?.FloorID)

        const patient = (Patients.list || []).find(u =>
            u.FloorID === floor?.Uuid &&
            u.RoomID === room?.Uuid &&
            u.BedID === bed?.Uuid)
        const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)
        const cases = (Cases.list || []).find(u => u.Uuid === patient?.CaseID)

        let usagetypePP = (Usagetypes.list || []).find(u => u.Value === 'PP')?.Uuid || null
        let file = (Files.list || []).filter(u => u.ParentID === patient?.Uuid).find(u => (((u.Usagetype || '').split(',')) || []).includes(usagetypePP))

        return {
            header: <div className='w-full flex flex-row justify-between items-start '>
                <div className='flex flex-col justify-start items-start'>
                    <div className='font-bold'>{`${floor?.Name}-${room?.Name}-${bed?.Name}`}</div>
                </div>
                {false
                    ? <Profilephoto
                        fileID={file?.Uuid}
                        fillnotification={fillPatientnotification}
                        Profile={Profile}
                        Imgheigth="30px"
                    />
                    : <Icon name='users' circular />}
            </div>,
            meta: bed.Isoccupied ?
                <Link to={`/Patients/${patient?.Uuid}`}>
                    <Label
                        className=' !flex !flex-col !justify-start !items-start !text-left'
                        color='blue'
                    >
                        {`${patientdefine?.Firstname || ''} ${patientdefine?.Lastname || ''}`}
                        <Label.Detail >
                            {patientdefine?.CountryID || ''}
                        </Label.Detail>
                    </Label>
                </Link>
                : null,
            description: bed.Isoccupied ? <Label size='large' className='!text-white' basic style={{ backgroundColor: cases?.Casecolor }}>{cases?.Name}</Label> : null,
            color: bed.Isoccupied ? cases?.Casecolor : '',
            filled: bed.Isoccupied,
            floorID: floor?.Uuid,
            roomID: room?.Uuid
        }
    })

    const renderView = () => {
        let panes = [];

        panes.push({
            menuItem: Literals.Columns.Onlyfilled[Profile.Language], render: () => <Tab.Pane>
                <Viewrender
                    list={(list || []).filter(u => u.filled)}
                    Profile={Profile}
                />
            </Tab.Pane>
        })

        const floors = (Floors.list || []).filter(u => u.Isactive)

        floors.forEach(floor => {


            panes.push({
                menuItem: floor?.Name, render: () => <Tab.Pane>
                    <Viewrender
                        list={(list || []).filter(u => u.floorID === floor?.Uuid)}
                        Profile={Profile}
                    />
                </Tab.Pane>
            })
        });

        panes.push({
            menuItem: Literals.Columns.All[Profile.Language], render: () => <Tab.Pane>
                <Viewrender
                    list={(list || [])}
                    Profile={Profile}
                />
            </Tab.Pane>
        })

        return panes
    }


    return (
        Patients.isLoading ? <LoadingPage /> :
            < React.Fragment >
                <Pagewrapper>
                    <Headerwrapper>
                        <Grid columns='2' >
                            <GridColumn width={8}>
                                <Breadcrumb size='big'>
                                    <Link to={"/Placeviews"}>
                                        <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                                    </Link>
                                </Breadcrumb>
                            </GridColumn>
                        </Grid>
                    </Headerwrapper>
                    <Pagedivider />
                    <Contentwrapper >
                        <Tab panes={renderView()} />
                    </Contentwrapper>
                </Pagewrapper>
            </React.Fragment >
    )
}


function Viewrender(props) {
    const { list, Profile } = props

    const roomList = [...new Set([...(list || []).map(u => u.roomID)])]

    return list.length > 0 ?
        <div className='w-full mx-auto '>
            {(roomList || []).map((room, roomIndex) => {
                return <React.Fragment key={roomIndex}>
                    <div className='flex flex-row justify-start items-start flex-wrap w-full'>
                        {list.filter(u => u.roomID === room).map((card, index) => {
                            return <Patientcard
                                header={card.header}
                                meta={card.meta}
                                description={card.description}
                                key={index}
                            />
                        })}
                    </div>
                    <Pagedivider />
                </React.Fragment>
            })}
        </div>
        : <NoDataScreen message={Literals.Messages.Nodatafind[Profile.Language]} />
}

function Patientcard(props) {
    const { header, meta, description, key } = props

    return (
        <div
            key={key}
            className='border-2 p-2  rounded-lg m-2  w-[300px] h-[130px] flex flex-col justify-start items-start gap-2'>
            {header && header}
            {meta && <div>{meta}</div>}
            {description && description}
        </div>
    )
}
