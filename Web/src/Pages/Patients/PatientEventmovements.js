import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Dropdown, Form, Grid, Icon, Loader, Modal } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { Settings, MobileTable, NoDataScreen, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, DataTable } from '../../Components'
import GetInitialconfig from '../../Utils/GetInitialconfig'
import { Formatfulldate } from '../../Utils/Formatdate'
import { PATIENTEVENT_MOVEMENT_TYPE_INDOOR, PATIENTEVENT_MOVEMENT_TYPE_OUTDOOR } from '../../Utils/Constants'
import PatienteventmovementsDelete from '../../Containers/Patienteventmovements/PatienteventmovementsDelete'

export default function PatientEventmovements(props) {
    const { GetPatienteventdefines, GetPatientdefines, GetPatient, GetUsers, GetFloors, DeletePatienteventmovements, EditPatienteventmovements, fillPatientnotification } = props
    const { Patients, Patientdefines, Users, Patienteventdefines, Floors, Profile } = props
    const { match, history, PatientID } = props

    const PAGE_NAME = 'PatientEventmovements'
    const t = Profile?.i18n?.t
    let Id = match?.params?.PatientID || PatientID
    const context = useContext(FormContext)
    const [isdatafetched, setIsdatafetched] = useState(false)
    const [deletemodalopen, setDeletemodalopen] = useState(false)
    const [record, setRecord] = useState(false)

    const isLoadingstatus =
        Patients.isLoading ||
        Patientdefines.isLoading ||
        Users.isLoading ||
        Patienteventdefines.isLoading

    const { selected_record } = Patients

    useEffect(() => {

        if (validator.isUUID(Id)) {
            GetPatient(Id)
            GetPatienteventdefines()
            GetPatientdefines()
            GetUsers()
            GetFloors()
        } else {
            history.length > 1 ? history.goBack() : history.push(Id ? `/Patients/${Id}` : `/Patients`)
        }
    }, [])



    const typeCellhandler = (value) => {
        const Patientevenetmovementtypes = [
            { text: t('Option.Patienteventmovement.TypeIndoor'), value: PATIENTEVENT_MOVEMENT_TYPE_INDOOR },
            { text: t('Option.Patienteventmovement.TypeOutdoor'), value: PATIENTEVENT_MOVEMENT_TYPE_OUTDOOR },
        ]

        return Patientevenetmovementtypes.find(u => u.value === value)?.text || t('Common.NoDataFound')
    }

    const userCellhandler = (value) => {
        if (Users.isLoading) {
            return <Loader size='small' active inline='centered' ></Loader>
        } else {
            const user = (Users?.list || []).find(u => u.Uuid === value)
            return `${user?.Name} ${user?.Surname}`
        }
    }

    const eventdefineCellhandler = (value) => {
        if (Patienteventdefines.isLoading) {
            return <Loader size='small' active inline='centered' ></Loader>
        } else {
            const eventdefine = (Patienteventdefines?.list || []).find(u => u.Uuid === value)
            return `${eventdefine?.Eventname}`
        }
    }

    const floorCellhandler = (value) => {
        if (Floors.isLoading) {
            return <Loader size='small' active inline='centered' ></Loader>
        } else {
            return (Floors.list || []).find(u => u.Uuid === value)?.Name
        }
    }

    const dateCellhandler = (value) => {
        if (value) {
            return Formatfulldate(value, true)
        }
        return value
    }

    const list = (selected_record?.Events || []).map(item => {
        return {
            ...item,
            edit: <Link to={`/Patienteventmovements/${item.Uuid}/edit?redirectUrl=/Patients/${Id}/Eventmovements`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
            delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
                setRecord(item)
                setDeletemodalopen(true)
            }} />
        }
    })

    const colProps = {
        sortable: true,
        canGroupBy: true,
        canFilter: true
    }

    const Columns = [
        { Header: t('Common.Column.Id'), accessor: 'Id', },
        { Header: t('Common.Column.Uuid'), accessor: 'Uuid' },
        { Header: t('Pages.Patienteventmovements.Column.Type'), accessor: row => typeCellhandler(row?.Type), Title: true },
        { Header: t('Pages.Patienteventmovements.Column.Event'), accessor: row => eventdefineCellhandler(row?.EventID) },
        { Header: t('Pages.Patienteventmovements.Column.User'), accessor: row => userCellhandler(row?.UserID) },
        { Header: t('Pages.Patienteventmovements.Column.Occureddate'), accessor: row => dateCellhandler(row?.Occureddate) },
        { Header: t('Pages.Patienteventmovements.Column.Relatedpersons'), accessor: 'Relatedpersons', },
        { Header: t('Pages.Patienteventmovements.Column.Solutionsecond'), accessor: 'Solutionsecond', },
        { Header: t('Pages.Patienteventmovements.Column.Eventdetail'), accessor: 'Eventdetail', },
        { Header: t('Pages.Patienteventmovements.Column.OccuredFloor'), accessor: row => floorCellhandler(row?.OccuredFloorID) },
        { Header: t('Pages.Patienteventmovements.Column.OccuredPlace'), accessor: 'Occuredplace', },
        { Header: t('Pages.Patienteventmovements.Column.Witnesses'), accessor: 'Witnesses', },
        { Header: t('Pages.Patienteventmovements.Column.Info'), accessor: 'Info', },
        { Header: t('Common.Column.Createduser'), accessor: 'Createduser' },
        { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser' },
        { Header: t('Common.Column.Createtime'), accessor: 'Createtime' },
        { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime' },
        { Header: t('Common.Column.edit'), accessor: 'edit', disableProps: true },
        { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    useEffect(() => {
        if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0 && !isLoadingstatus && !isdatafetched) {
            setIsdatafetched(true)
            context.setForm(PAGE_NAME, selected_record)
        }
    })

    const metaKey = 'patienteventmovement'
    const initialConfig = GetInitialconfig(Profile, metaKey)

    const patient = selected_record
    const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)

    return (
        Patients.isLoading ? <LoadingPage /> :
            <Pagewrapper >
                <Headerwrapper>
                    <Grid columns='2' >
                        <Grid.Column width={8}>
                            <Headerbredcrump>
                                <Link to={"/Patients"}>
                                    <Breadcrumb.Section>{t('Pages.Patients.Page.Header')}</Breadcrumb.Section>
                                </Link>
                                <Breadcrumb.Divider icon='right chevron' />
                                <Link to={"/Patients/" + Id}>
                                    <Breadcrumb.Section>{`${patientdefine?.Firstname} ${patientdefine?.Lastname}`}</Breadcrumb.Section>
                                </Link>
                                <Breadcrumb.Divider icon='right chevron' />
                                <Breadcrumb.Section>{t('Pages.Patients.PatientEventmovements.Page.Header')}</Breadcrumb.Section>
                            </Headerbredcrump>
                        </Grid.Column>
                        <Settings
                            Profile={Profile}
                            Columns={Columns}
                            list={list}
                            initialConfig={initialConfig}
                            metaKey={metaKey}
                            Showcolumnchooser
                            Showexcelexport
                        />
                    </Grid>
                </Headerwrapper>
                <Pagedivider />
                {list.length > 0 ?
                    <div className='w-full mx-auto '>
                        {Profile.Ismobile ?
                            <MobileTable Columns={Columns} Data={list} Config={initialConfig} Profile={Profile} /> :
                            <DataTable Columns={Columns} Data={list} Config={initialConfig} />}
                    </div> : <NoDataScreen message={t('Common.NoDataFound')} />
                }
                <PatienteventmovementsDelete
                    open={deletemodalopen}
                    setOpen={setDeletemodalopen}
                    record={record}
                    setRecord={setRecord}
                    afterSuccess={() => {
                        GetPatient(Id)
                    }}
                />
            </Pagewrapper >
    )
}