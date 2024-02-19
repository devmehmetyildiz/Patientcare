import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Card, Grid, GridColumn, Icon, Loader, Tab } from 'semantic-ui-react'
import Literals from './Literals'
import { Contentwrapper, Headerwrapper, LoadingPage, NoDataScreen, Pagedivider, Pagewrapper, Settings } from '../../Components'
import { ROUTES } from '../../Utils/Constants'
import config from '../../Config'

export default function Placeviews(props) {
    const { GetPatients, GetPatientdefines, GetFloors, GetRooms, GetBeds, GetCases, GetFiles, GetUsagetypes,
        Files, Usagetypes, Patients, Floors, Rooms, Beds, Profile, Patientdefines, Cases } = props

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
        const patientPP = (Files.list || []).find(u => u.ParentID === patient?.Uuid && (((u.Usagetype || '').split(',')) || []).includes(usagetypePP) && u.Isactive)

        return {
            header: <div className='w-full flex flex-row justify-between items-start'>
                <div className='flex flex-col justify-start items-start'>
                    <div className='font-bold'>{floor?.Name}</div>
                    <div>{`${room?.Name} ${bed?.Name}`}</div>
                </div>
                {patientPP
                    ? <img alt='pp' src={`${config.services.File}${ROUTES.FILE}/Downloadfile/${patientPP?.Uuid}`} className="rounded-full" style={{ width: '30px', height: '30px' }} />
                    : <Icon name='users' circular />}
            </div>,
            meta: bed.Isoccupied ? <div>{`${patientdefine?.Firstname || ''} ${patientdefine?.Lastname || ''}-${patientdefine?.CountryID || ''}`}</div> : null,
            description: bed.Isoccupied ? <div className='w-full flex flex-row flex-nowrap justify-between items-center'>
                <div className='font-bold'>{cases?.Name}</div>
                <Link to={`/Patients/${patient?.Uuid}`}>
                    <Icon name='magnify' color='black' circular />
                </Link>
            </div> : null,
            color: bed.Isoccupied ? cases?.Casecolor : '',
            filled: bed.Isoccupied
        }
    })

    const panes = [
        {
            menuItem: Literals.Columns.Onlyfilled[Profile.Language], render: () => <Tab.Pane>
                {(list || []).filter(u => u.filled).length > 0
                    ? <div className='w-full mx-auto '>
                        <div className='flex flex-row justify-start items-start flex-wrap w-full'>
                            {(((list || []).filter(u => u.filled) || []) || []).map((card, index) => {
                                return <div
                                    key={index}
                                    style={{ backgroundColor: card.color }}
                                    className='border-2 p-2 rounded-lg m-2  w-[300px] h-[160px] flex flex-col justify-start items-start'>
                                    {card.header && card.header}
                                    <Pagedivider />
                                    {card.meta && <div>{card.meta}</div>}
                                    <Pagedivider />
                                    {card.description && card.description}
                                </div>
                            })}
                        </div>
                    </div>
                    : <NoDataScreen message={Literals.Messages.Nodatafind[Profile.Language]} />
                }
            </Tab.Pane>
        },
        {
            menuItem: Literals.Columns.All[Profile.Language], render: () => <Tab.Pane>
                {list.length > 0
                    ? <div className='w-full mx-auto '>
                        <div className='flex flex-row justify-start items-start flex-wrap w-full'>
                            {(list || []).map((card, index) => {
                                return <div
                                    key={index}
                                    style={{ backgroundColor: card.color }}
                                    className='border-2 p-2 rounded-lg m-2  w-[300px] h-[160px] flex flex-col justify-start items-start'>
                                    {card.header && card.header}
                                    <Pagedivider />
                                    {card.meta && <div>{card.meta}</div>}
                                    <Pagedivider />
                                    {card.description && card.description}
                                </div>
                            })}
                        </div>
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
                                    <Link to={"/Placeviews"}>
                                        <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                                    </Link>
                                </Breadcrumb>
                            </GridColumn>
                            <Settings
                                Profile={Profile}
                                Pagecreateheader={Literals.Page.Pagetransferheader[Profile.Language]}
                                Pagecreatelink={"/Placeviews/Transfer"}
                                Showcreatebutton
                            />
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