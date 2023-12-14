import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Card, Grid, GridColumn, Loader, Tab } from 'semantic-ui-react'
import Literals from './Literals'
import { Contentwrapper, Headerwrapper, LoadingPage, NoDataScreen, Pagedivider, Pagewrapper } from '../../Components'

export default function Placeviews(props) {
    const { GetPatients, GetPatientdefines, GetFloors, GetRooms, GetBeds, GetCases,
        Patients, Floors, Rooms, Beds, Profile, Patientdefines, Cases } = props

    const [onlyFilled, setonlyFilled] = useState(false)

    useEffect(() => {
        GetPatients()
        GetPatientdefines()
        GetFloors()
        GetRooms()
        GetBeds()
        GetCases()
    }, [])

    const nameCellhandler = (FloorID, RoomID, BedID) => {
        if (Patientdefines.isLoading || Patients.isLoading) {
            return <Loader size='small' active inline='centered' ></Loader>
        } else {
            const patient = (Patients.list || []).find(u =>
                u.FloorID === FloorID &&
                u.RoomID === RoomID &&
                u.BedID === BedID)
            const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)
            return patient ? `${patientdefine?.Firstname} ${patientdefine?.Lastname}-${patientdefine?.CountryID}` : null
        }
    }

    const caseCellhandler = (FloorID, RoomID, BedID) => {
        if (Cases.isLoading || Patients.isLoading) {
            return <Loader size='small' active inline='centered' ></Loader>
        } else {
            const patient = (Patients.list || []).find(u =>
                u.FloorID === FloorID &&
                u.RoomID === RoomID &&
                u.BedID === BedID)
            const cases = (Cases.list || []).find(u => u.Uuid === patient?.CaseID)
            return cases?.Name
        }
    }

    const casecolorCellhandler = (FloorID, RoomID, BedID) => {
        if (Cases.isLoading || Patients.isLoading) {
            return <Loader size='small' active inline='centered' ></Loader>
        } else {
            const patient = (Patients.list || []).find(u =>
                u.FloorID === FloorID &&
                u.RoomID === RoomID &&
                u.BedID === BedID)
            const cases = (Cases.list || []).find(u => u.Uuid === patient?.CaseID)
            return cases?.Casecolor
        }
    }

    const list = (Beds.list || []).filter(u => u.Isactive).map(bed => {
        const room = (Rooms.list || []).find(u => u.Uuid === bed?.RoomID)
        const floor = (Floors.list || []).find(u => u.Uuid === room?.FloorID)
        return {
            header: <div className='w-full flex flex-col justify-start items-start'>
                <div className='font-bold'>{floor?.Name}</div>
                <div>{`${room?.Name} ${bed?.Name}`}</div>
            </div>,
            meta: <div>{bed.Isoccupied ? nameCellhandler(floor?.Uuid, room?.Uuid, bed?.Uuid) : ''}</div>,
            description: <div>{bed.Isoccupied ? caseCellhandler(floor?.Uuid, room?.Uuid, bed?.Uuid) : ''}</div>,
            color: bed.Isoccupied ? casecolorCellhandler(floor?.Uuid, room?.Uuid, bed?.Uuid) : ''
        }
    })

    const filledlist = (Beds.list || []).filter(u => u.Isactive && u.Isoccupied).map(bed => {
        const room = (Rooms.list || []).find(u => u.Uuid === bed?.RoomID)
        const floor = (Floors.list || []).find(u => u.Uuid === room?.FloorID)
        return {
            header: <div className='w-full flex flex-col justify-start items-start'>
                <div className='font-bold'>{floor?.Name}</div>
                <div>{`${room?.Name} ${bed?.Name}`}</div>
            </div>,
            meta: <div>{bed.Isoccupied ? nameCellhandler(floor?.Uuid, room?.Uuid, bed?.Uuid) : ''}</div>,
            description: <div>{bed.Isoccupied ? caseCellhandler(floor?.Uuid, room?.Uuid, bed?.Uuid) : ''}</div>,
            color: bed.Isoccupied ? casecolorCellhandler(floor?.Uuid, room?.Uuid, bed?.Uuid) : ''
        }
    })

    const panes = [
        {
            menuItem: Literals.Columns.Onlyfilled[Profile.Language], render: () => <Tab.Pane>
                {filledlist.length > 0
                    ? <div className='w-full mx-auto '>
                        <Card.Group>
                            {(filledlist || []).map((card, index) => {
                                return <Card key={index} style={{ backgroundColor: card.color }} >
                                    <Card.Content className='!p-1 !m-0' header={card.header} />
                                    <Card.Content className=' !p-1 !m-0' header={card.meta} />
                                    <Card.Content className=' !p-1 !m-0' header={card.description} />
                                </Card>
                            })}
                        </Card.Group>
                    </div>
                    : <NoDataScreen message={Literals.Messages.Nodatafind[Profile.Language]} />
                }
            </Tab.Pane>
        },
        {
            menuItem: Literals.Columns.All[Profile.Language], render: () => <Tab.Pane>
                {list.length > 0
                    ? <div className='w-full mx-auto '>
                        <Card.Group>
                            {(list || []).map((card, index) => {
                                return <Card key={index} style={{ backgroundColor: card.color }} >
                                    <Card.Content className='!p-1 !m-0' header={card.header} />
                                    <Card.Content className=' !p-1 !m-0' header={card.meta} />
                                    <Card.Content className=' !p-1 !m-0' header={card.description} />
                                </Card>
                            })}
                        </Card.Group>
                    </div>
                    : <NoDataScreen message={Literals.Messages.Nodatafind[Profile.Language]} />
                }
            </Tab.Pane>
        },
    ]

    return (
        Patients.isLoading ? <LoadingPage /> :
            < React.Fragment >
                <Pagewrapper>
                    <Headerwrapper>
                        <Grid columns='2' >
                            <GridColumn width={8}>
                                <Breadcrumb size='big'>
                                    <Link to={"/Patients"}>
                                        <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                                    </Link>
                                </Breadcrumb>
                            </GridColumn>
                        </Grid>
                    </Headerwrapper>
                    <Pagedivider />
                    <Contentwrapper additionalStyle={'max-h-[90vh]'}>
                        <Tab panes={panes} />
                    </Contentwrapper>
                </Pagewrapper>
            </React.Fragment >
    )
}