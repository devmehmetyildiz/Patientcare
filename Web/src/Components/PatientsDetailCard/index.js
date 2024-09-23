import React, { useContext, useState } from 'react'
import { Card, Dimmer, Feed, Icon, Image, Label, Loader, Modal, Transition } from 'semantic-ui-react'
import { PATIENTS_MOVEMENTTYPES_APPROVE, PATIENTS_MOVEMENTTYPES_CANCELAPPROVE, PATIENTS_MOVEMENTTYPES_CANCELCHECK, PATIENTS_MOVEMENTTYPES_CASECHANGE, PATIENTS_MOVEMENTTYPES_CHECK, PATIENTS_MOVEMENTTYPES_COMPLETE, PATIENTS_MOVEMENTTYPES_CREATE, PATIENTS_MOVEMENTTYPES_DEAD, PATIENTS_MOVEMENTTYPES_LEFT, PATIENTS_MOVEMENTTYPES_PLACECHANGE, PATIENTS_MOVEMENTTYPES_UPDATE, ROUTES } from '../../Utils/Constants'
import config from '../../Config'
import Formatdate from '../../Utils/Formatdate'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { FormContext } from '../../Provider/FormProvider'
import validator from '../../Utils/Validator'

export default function PatientsDetailCard(props) {

    const [fileDownloading, setfileDownloading] = useState(false)
    const [movementsOpen, setMovementsOpen] = useState(false)
    const {
        usecontext,
        PAGE_NAME,
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
        fillnotification,
        stocks,
        files
    } = props
    const t = Profile?.i18n?.t || null
    const context = useContext(FormContext)
    const selected_record = usecontext ? context.getForm(PAGE_NAME) : Patients?.selected_record
    const {
        Uuid,
        PatientdefineID,
        DepartmentID,
        CaseID,
        Movements,
        Approvaldate,
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

    const patientdefine = usecontext ? context.getForm(`${PAGE_NAME}-Patientdefine`) : (Patientdefines.list || []).find(u => u.Uuid === PatientdefineID)
    const patientName = `${patientdefine?.Firstname || Notfound} ${patientdefine?.Lastname || Notfound}`

    const department = (Departments.list || []).find(u => u.Uuid === DepartmentID)
    const casedata = (Cases.list || []).find(u => u.Uuid === CaseID)

    const costumertype = (Costumertypes.list || []).find(u => u.Uuid === patientdefine?.CostumertypeID)
    const patienttype = (Patienttypes.list || []).find(u => u.Uuid === patientdefine?.PatienttypeID)

    const usagetypePP = (Usagetypes.list || []).find(u => u.Value === 'PP')?.Uuid || null
    const patientPP = usecontext
        ? (files || []).find(u => (u.Usagetypevalues || []).includes(usagetypePP))
        : (Files.list || []).find(u => u.ParentID === Uuid && (((u.Usagetype || '').split(',')) || []).includes(usagetypePP) && u.Isactive)


    const Movementtypes = [
        { name: t('Common.Patient.Movementtypes.Create'), value: PATIENTS_MOVEMENTTYPES_CREATE },
        { name: t('Common.Patient.Movementtypes.Update'), value: PATIENTS_MOVEMENTTYPES_UPDATE },
        { name: t('Common.Patient.Movementtypes.Check'), value: PATIENTS_MOVEMENTTYPES_CHECK },
        { name: t('Common.Patient.Movementtypes.Approve'), value: PATIENTS_MOVEMENTTYPES_APPROVE },
        { name: t('Common.Patient.Movementtypes.Complete'), value: PATIENTS_MOVEMENTTYPES_COMPLETE },
        { name: t('Common.Patient.Movementtypes.Cancelcheck'), value: PATIENTS_MOVEMENTTYPES_CANCELCHECK },
        { name: t('Common.Patient.Movementtypes.Cancelapprove'), value: PATIENTS_MOVEMENTTYPES_CANCELAPPROVE },
        { name: t('Common.Patient.Movementtypes.Left'), value: PATIENTS_MOVEMENTTYPES_LEFT },
        { name: t('Common.Patient.Movementtypes.Dead'), value: PATIENTS_MOVEMENTTYPES_DEAD },
        { name: t('Common.Patient.Movementtypes.Casechange'), value: PATIENTS_MOVEMENTTYPES_CASECHANGE },
        { name: t('Common.Patient.Movementtypes.Placechange'), value: PATIENTS_MOVEMENTTYPES_PLACECHANGE },
    ]


    const DecoratedMovements = ((Movements || []).map(movement => {
        const user = (Users.list || []).find(u => u.Uuid === movement?.UserID)
        const username = user ? `${user?.Name || Notfound} ${user?.Surname || Notfound}` : user
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

    const downloadFileFromContext = (file, fileName, fileType,) => {
        try {
            const blob = new Blob([file], {
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
        } catch (error) {
            fillnotification([{ type: 'Error', code: t('Pages.Preregistrations.Page.Header'), description: error.message }])
            console.log(error.message)
        }
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
                                        src={usecontext
                                            ? URL.createObjectURL(patientPP?.File)
                                            : `${config.services.File}${ROUTES.FILE}/Downloadfile/${patientPP?.Uuid}`}
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
                                    <strong>{validator.isISODate(patientdefine?.Dateofbirth) ? Formatdate(patientdefine?.Dateofbirth, true) : Notfound}</strong>
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
                                                    return <div className='cursor-pointer flex flex-row'
                                                        onClick={() => {
                                                            usecontext
                                                                ? downloadFileFromContext(file?.File, file?.Name, file?.File?.type)
                                                                : downloadFile(file.Uuid, file.Name, Profile)
                                                        }}
                                                    >
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
                                {`${t('Pages.Preregistrations.DetailCard.Label.Approvaldate')} : ${Formatdate(Approvaldate, true) || Notfound}`}
                            </Label>
                            <Label basic ribbon>
                                {`${t('Pages.Preregistrations.DetailCard.Label.Happensdate')} : ${Formatdate(Happensdate, true) || Notfound}`}
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
                                                    {movement.label} :{movement.user ? <Link to={`Users/${movement.userID}`}>{movement.user}</Link> : movement.userID}
                                                </Feed.Summary>
                                                <Feed.Summary className='!font-semibold !text-[#8a8a8add]'>
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
