import React, { useState } from 'react'
import { Card, Dimmer, Feed, Icon, Image, Label, Loader, Modal, Transition } from 'semantic-ui-react'
import { PATIENTS_MOVEMENTTYPES_APPROVE, PATIENTS_MOVEMENTTYPES_CANCELAPPROVE, PATIENTS_MOVEMENTTYPES_CANCELCHECK, PATIENTS_MOVEMENTTYPES_CHECK, PATIENTS_MOVEMENTTYPES_COMPLETE, PATIENTS_MOVEMENTTYPES_CREATE, PATIENTS_MOVEMENTTYPES_UPDATE, ROUTES } from '../../Utils/Constants'
import config from '../../Config'
import Formatdate from '../../Utils/Formatdate'
import validator from '../../Utils/Validator'
import axios from 'axios'
import { Link } from 'react-router-dom'

export default function PatientsDetailCard(props) {

    const [fileDownloading, setfileDownloading] = useState(false)
    const [movementsOpen, setMovementsOpen] = useState(false)
    const {
        Profile,
        Patients,
        Patientdefines,
        Stocks,
        Stockdefines,
        Units,
        Users,
        Cases,
        Departments,
        Stocktypes,
        Stocktypegroups,
        Files,
        Costumertypes,
        Patienttypes,
        Usagetypes,
        fillnotification
    } = props
    const t = Profile?.i18n?.t || null
    const { selected_record } = Patients
    const {
        Uuid,
        PatientdefineID,
        DepartmentID,
        CaseID,
        Movements,
        Approvaldate,
        Registerdate,
        Happensdate,
        Isoninstitution
    } = selected_record

    const isLoadingstatus =
        Patients.isLoading ||
        Patientdefines.isLoading ||
        Stocks.isLoading ||
        Stockdefines.isLoading ||
        Units.isLoading ||
        Cases.isLoading ||
        Departments.isLoading ||
        Stocktypes.isLoading ||
        Stocktypegroups.isLoading ||
        Users.isLoading ||
        Files.isLoading ||
        Usagetypes.isLoading ||
        fileDownloading

    const Notfound = t('Common.NoDataFound')

    const stocks = (Stocks.list || []).filter(u => u.WarehouseID === selected_record?.Uuid).map(element => {
        return {
            ...element,
            key: Math.random(),
            Skt: validator.isISODate(element.Skt) ? Formatdate(element.Skt) : element.Skt
        }
    });

    const files = (Files.list || []).filter(u => u.ParentID === Uuid).map(element => {
        return {
            ...element,
            key: Math.random(),
            Usagetype: ((element?.Usagetype || '').split(',') || []).map(u => {
                return (Usagetypes.list || []).find(type => type.Uuid === u)?.Name
            })
        }
    });

    const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === PatientdefineID)
    const patientName = `${patientdefine?.Firstname || Notfound} ${patientdefine?.Lastname || Notfound}`

    const department = (Departments.list || []).find(u => u.Uuid === DepartmentID)
    const casedata = (Cases.list || []).find(u => u.Uuid === CaseID)

    const costumertype = (Costumertypes.list || []).find(u => u.Uuid === patientdefine?.CostumertypeID)
    const patienttype = (Patienttypes.list || []).find(u => u.Uuid === patientdefine?.PatienttypeID)

    const usagetypePP = (Usagetypes.list || []).find(u => u.Value === 'PP')?.Uuid || null
    const patientPP = (Files.list || []).find(u => u.ParentID === Uuid && (((u.Usagetype || '').split(',')) || []).includes(usagetypePP) && u.Isactive)

    const Movementtypes = [
        { name: t('Common.Patient.Movementtypes.Createduser'), value: PATIENTS_MOVEMENTTYPES_CREATE },
        { name: t('Common.Patient.Movementtypes.Updateduser'), value: PATIENTS_MOVEMENTTYPES_UPDATE },
        { name: t('Common.Patient.Movementtypes.Checkeduser'), value: PATIENTS_MOVEMENTTYPES_CHECK },
        { name: t('Common.Patient.Movementtypes.Approveduser'), value: PATIENTS_MOVEMENTTYPES_APPROVE },
        { name: t('Common.Patient.Movementtypes.Completeduser'), value: PATIENTS_MOVEMENTTYPES_COMPLETE },
        { name: t('Common.Patient.Movementtypes.Cancelcheckeduser'), value: PATIENTS_MOVEMENTTYPES_CANCELCHECK },
        { name: t('Common.Patient.Movementtypes.Cancelapproveduser'), value: PATIENTS_MOVEMENTTYPES_CANCELAPPROVE },
    ]

    const DecoratedMovements = ((Movements || []).map(movement => {
        const user = (Users.list || []).find(u => u.Uuid === movement?.UserID)
        const username = `${user?.Name || Notfound} ${user?.Surname || Notfound}`
        const type = Movementtypes.find(u => u.value === movement?.Type)?.name || Notfound

        return {
            label: type,
            user: username,
            userID: movement?.UserID,
            value: movement?.Occureddate,
            info: movement?.Info
        }
    }))

    const downloadFile = (fileID, fileName, Profile) => {
        setfileDownloading(true)
        axios.get(`${config.services.File}${ROUTES.FILE}/Downloadfile/${fileID}`, {
            responseType: 'blob'
        }).then((res) => {
            setfileDownloading(false)
            const fileType = res.headers['content-type']
            const blob = new Blob([res.data], {
                type: fileType
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            if (fileType.includes('pdf')) {
                window.open(url)
                a.href = null;
                window.URL.revokeObjectURL(url);
            }
            a.href = url;
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(url);
        }).catch((err) => {
            setfileDownloading(false)
            fillnotification([{ type: 'Error', code: t('Pages.Preregistrations.Page.Header'), description: err.message }])
            console.log(err.message)
        });
    }

    return (
        <Modal.Content image>
            {isLoadingstatus
                ? <Dimmer active inverted>
                    <Loader inverted />
                </Dimmer>
                : <Card fluid>
                    <Card.Content className='flex w-full justify-between items-center'>
                        <Card fluid>
                            <Card.Content>
                                {patientPP
                                    ? <Image
                                        alt='pp'
                                        floated='right'
                                        size='tiny'
                                        rounded
                                        src={`${config.services.File}${ROUTES.FILE}/Downloadfile/${patientPP?.Uuid}`}
                                    />
                                    : <Image
                                        floated='right'
                                        size='tiny'
                                        rounded
                                        src={`https://react.semantic-ui.com/images/avatar/large/${patientdefine?.Gender === '1' ? 'molly.png' : 'steve.jpg'}`}
                                    />
                                }
                                <Card.Header>{`${patientName} - ${patientdefine?.CountryID || Notfound} `}</Card.Header>
                                <Card.Meta className='mt-2'>
                                    <Label basic >
                                        {`${t('Pages.Preregistrations.DetailCard.Label.Patienttype')} : ${patienttype?.Name || Notfound}`}
                                    </Label>
                                    <Label basic >
                                        {`${t('Pages.Preregistrations.DetailCard.Label.Costumertype')} : ${costumertype?.Name || Notfound}`}
                                    </Label>
                                </Card.Meta>
                                <Card.Description>
                                    {`${t('Pages.Preregistrations.DetailCard.Label.Fathername')} `}
                                    <strong>{patientdefine?.Fathername || Notfound}</strong>
                                    {` ${t('Pages.Preregistrations.DetailCard.Label.Mothername')} `}
                                    <strong>{patientdefine?.Mothername || Notfound}</strong>
                                    {` ${t('Pages.Preregistrations.DetailCard.Label.Dateofbirth')} `}
                                    <strong>{patientdefine?.Dateofbirth || Notfound}</strong>
                                    {` ${t('Pages.Preregistrations.DetailCard.Label.Placeofbirth')} `}
                                    <strong>{patientdefine?.Placeofbirth || Notfound}</strong>
                                </Card.Description>
                            </Card.Content>
                        </Card>
                        <Card.Header>
                        </Card.Header>
                    </Card.Content>
                    <Card.Content>
                        <Card.Description className='w-full flex flex-row justify-between items-top gap-2'>
                            <div className='w-full'>
                                <Card fluid>
                                    <Card.Content>
                                        <Card.Header>{t('Pages.Preregistrations.DetailCard.Label.Stocks')}</Card.Header>
                                        <Card.Meta>{`${(stocks || []).length} ${t('Pages.Preregistrations.DetailCard.Label.Stocksprefix')}`}</Card.Meta>
                                        <Card.Description>
                                            {stocks.map(stock => {
                                                const stockdefine = (Stockdefines.list || []).find(u => u.Uuid === stock?.StockdefineID)
                                                const unit = (Units.list || []).find(u => u.Uuid === stockdefine?.UnitID)
                                                return `${stock?.Amount || Notfound} ${unit?.Name || Notfound} ${stockdefine?.Name || Notfound}`
                                            }).join(',')}
                                        </Card.Description>
                                    </Card.Content>
                                </Card>
                            </div>
                            <div className='w-full'>
                                <Card fluid>
                                    <Card.Content>
                                        <Card.Header>{t('Pages.Preregistrations.DetailCard.Label.Files')}</Card.Header>
                                        <Card.Meta>{`${(files || []).length} ${t('Pages.Preregistrations.DetailCard.Label.Filesprefix')}`}</Card.Meta>
                                        <Card.Description>
                                            <div className='w-full gap-2 justify-start items-start flex flex-col'>
                                                {files.map(file => {
                                                    return <div className='cursor-pointer flex flex-row' onClick={() => { downloadFile(file.Uuid, file.Name, Profile) }}>
                                                        <p>{`${file?.Name || Notfound} (${file?.Usagetype || Notfound})`}</p> <Icon color='blue' name='download' />
                                                    </div>
                                                })}
                                            </div>
                                        </Card.Description>
                                    </Card.Content>
                                </Card>
                            </div>
                        </Card.Description>
                    </Card.Content>
                    <Card.Content className='w-full flex flex-row justify-between items-center'>
                        <Card.Content className='flex flex-col justify-start items-start'>
                            <Label basic ribbon>
                                {`${t('Pages.Preregistrations.DetailCard.Label.Registerdate')} : ${Formatdate(Registerdate) || Notfound}`}
                            </Label>
                            <Label basic ribbon>
                                {`${t('Pages.Preregistrations.DetailCard.Label.Approvaldate')} : ${Formatdate(Approvaldate) || Notfound}`}
                            </Label>
                            <Label basic ribbon>
                                {`${t('Pages.Preregistrations.DetailCard.Label.Happensdate')} : ${Formatdate(Happensdate) || Notfound}`}
                            </Label>
                        </Card.Content>
                        <Card.Content className='w-full flex justify-end items-end flex-col'>
                            <Label basic >
                                {`${t('Pages.Preregistrations.DetailCard.Label.Isoninstitution')} : ${Isoninstitution ? t('Pages.Preregistrations.DetailCard.Label.Oninstitution') : t('Pages.Preregistrations.DetailCard.Label.Onnotinstitution')}`}
                            </Label>
                            <Label basic >
                                {`${t('Pages.Preregistrations.DetailCard.Label.Case')} : ${casedata?.Name || Notfound}`}
                            </Label>
                            <Label basic >
                                {`${t('Pages.Preregistrations.DetailCard.Label.Department')} : ${department?.Name || Notfound}`}
                            </Label>
                        </Card.Content>
                    </Card.Content>
                    <Card fluid >
                        <Card.Content onClick={() => { setMovementsOpen(prev => !prev) }} className='w-full flex flex-row justify-between items-center cursor-pointer'>
                            <Card.Header>{t('Pages.Preregistrations.DetailCard.Label.Movements')}</Card.Header>
                            <Card.Header className='w-full flex justify-end items-end'>
                                <div >
                                    {movementsOpen ? <Icon name='angle up' /> : <Icon name='angle down' />}
                                </div>
                            </Card.Header>
                        </Card.Content>
                        <Transition visible={movementsOpen} animation='slide down' duration={500}>
                            <Card.Content>
                                {DecoratedMovements.map((movement, index) => {
                                    return <Feed key={index}>
                                        <Feed.Event>
                                            <Feed.Label icon="user" />
                                            <Feed.Content>
                                                <Feed.Date content={Formatdate(movement.value)} />
                                                <Feed.Summary>
                                                    {movement.label} - <Link to={`Users/${movement.userID}/edit`}>{movement.user}</Link>-
                                                    {movement.info}
                                                </Feed.Summary>
                                            </Feed.Content>
                                        </Feed.Event>
                                    </Feed>
                                })}
                            </Card.Content>
                        </Transition>
                    </Card>
                </Card>
            }
        </Modal.Content>
    )
}
