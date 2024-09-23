import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Form, Grid, Icon, Loader, Modal } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { Settings, MobileTable, NoDataScreen, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, DataTable } from '../../Components'
import { PATIENTS_MOVEMENTTYPES_APPROVE, PATIENTS_MOVEMENTTYPES_CANCELAPPROVE, PATIENTS_MOVEMENTTYPES_CANCELCHECK, PATIENTS_MOVEMENTTYPES_CASECHANGE, PATIENTS_MOVEMENTTYPES_CHECK, PATIENTS_MOVEMENTTYPES_COMPLETE, PATIENTS_MOVEMENTTYPES_CREATE, PATIENTS_MOVEMENTTYPES_DEAD, PATIENTS_MOVEMENTTYPES_LEFT, PATIENTS_MOVEMENTTYPES_PLACECHANGE, PATIENTS_MOVEMENTTYPES_UPDATE } from '../../Utils/Constants'
import GetInitialconfig from '../../Utils/GetInitialconfig'
import { Formatfulldate } from '../../Utils/Formatdate'

export default function PatientMovements(props) {
    const { GetCases, GetPatientdefines, GetPatient, GetUsers, DeletePatientmovements, EditPatientmovements, fillPatientnotification } = props
    const { Patients, Patientdefines, Cases, Users, Profile } = props
    const { match, history, PatientID } = props

    const PAGE_NAME = 'PatientMovements'
    const t = Profile?.i18n?.t
    let Id = match?.params?.PatientID || PatientID
    const context = useContext(FormContext)
    const [isdatafetched, setIsdatafetched] = useState(false)
    const [deletemodalopen, setDeletemodalopen] = useState(false)
    const [editmodalopen, setEditmodalopen] = useState(false)
    const [record, setRecord] = useState(false)

    const isLoadingstatus =
        Patients.isLoading ||
        Patientdefines.isLoading ||
        Users.isLoading ||
        Cases.isLoading

    const { selected_record } = Patients

    useEffect(() => {

        if (validator.isUUID(Id)) {
            GetPatient(Id)
            GetCases()
            GetPatientdefines()
            GetUsers()
        } else {
            history.length > 1 ? history.goBack() : history.push(Id ? `/Patients/${Id}` : `/Patients`)
        }
    }, [])

    useEffect(() => {
        if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0 && !isLoadingstatus && !isdatafetched) {
            setIsdatafetched(true)
            context.setForm(PAGE_NAME, selected_record)
        }
    })

    const caseCellhandler = (value) => {
        if (Cases.isLoading) {
            return <Loader size='small' active inline='centered' ></Loader>
        } else {
            return `${(Cases.list || []).find(u => u.Uuid === value)?.Name || ''}`
        }
    }

    const typeCellhandler = (value) => {

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

        return `${Movementtypes.find(u => u.value === value)?.name || value}`
    }

    const userCellhandler = (value) => {
        if (Users.isLoading) {
            return <Loader size='small' active inline='centered' ></Loader>
        } else {
            return `${(Users.list || []).find(u => u.Uuid === value)?.Username || value}`
        }
    }

    const dateCellhandler = (value) => {
        if (value) {
            return Formatfulldate(value, true)
        }
        return null
    }

    const list = (selected_record?.Movements || []).map(item => {
        return {
            ...item,
            edit: <div
                className='cursor-pointer'
                onClick={() => {
                    setRecord(item)
                    setEditmodalopen(true)
                }}
            >
                <Icon size='large' color='blue' className='row-edit' name='edit' />
            </div>,
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
        { Header: t('Pages.Patients.PatientMovements.Columns.Case'), accessor: row => caseCellhandler(row?.CaseID), },
        { Header: t('Pages.Patients.PatientMovements.Columns.Type'), accessor: row => typeCellhandler(row?.Type) },
        { Header: t('Pages.Patients.PatientMovements.Columns.User'), accessor: row => userCellhandler(row?.UserID), },
        { Header: t('Pages.Patients.PatientMovements.Columns.Info'), accessor: 'Info' },
        { Header: t('Pages.Patients.PatientMovements.Columns.Occureddate'), accessor: row => dateCellhandler(row?.Occureddate) },
        { Header: t('Common.Column.Createduser'), accessor: 'Createduser' },
        { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser' },
        { Header: t('Common.Column.Createtime'), accessor: 'Createtime' },
        { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime' },
        { Header: t('Common.Column.edit'), accessor: 'edit', disableProps: true },
        { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const metaKey = 'PatientMovements'
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
                                <Breadcrumb.Section>{t('Pages.Patients.PatientMovements.Page.Header')}</Breadcrumb.Section>
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
                <PatientMovementsDelete
                    open={deletemodalopen}
                    setOpen={setDeletemodalopen}
                    record={record}
                    setRecord={setRecord}
                    Profile={Profile}
                    Deletefunction={DeletePatientmovements}
                    onSuccess={() => {
                        GetPatient(Id)
                    }}
                />
                <PatientMovementsEdit
                    open={editmodalopen}
                    setOpen={setEditmodalopen}
                    record={record}
                    setRecord={setRecord}
                    Profile={Profile}
                    Updatefunction={EditPatientmovements}
                    fillnotification={fillPatientnotification}
                    onSuccess={() => {
                        GetPatient(Id)
                    }}
                />
            </Pagewrapper >
    )
}


function PatientMovementsDelete(props) {

    const { open, setOpen, record, setRecord, Profile, Deletefunction, onSuccess } = props

    const t = Profile?.i18n?.t

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

    const typename = Movementtypes.find(u => u.value === record?.Type)?.name || t('Common.NoDataFound')
    const occureddate = Formatfulldate(record?.Occureddate, true)
    return (
        <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
        >
            <Modal.Header>{t('Pages.Patients.PatientMovements.Page.DeleteHeader')}</Modal.Header>
            <Modal.Content image>
                <Modal.Description>
                    <p>
                        <span className='font-bold'>{occureddate} </span>
                        {t('Pages.Patients.PatientMovements.Delete.Label.CheckStart')}
                        <span className='font-bold'>{typename} </span>
                        {t('Pages.Patients.PatientMovements.Delete.Label.Check')}
                    </p>
                </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
                <Button color='black' onClick={() => {
                    setOpen(false)
                    setRecord({})
                }}>
                    {t('Common.Button.Giveup')}
                </Button>
                <Button
                    content={t('Common.Button.Delete')}
                    labelPosition='right'
                    icon='checkmark'
                    onClick={() => {
                        Deletefunction({
                            data: record, onSuccess: onSuccess
                        })
                        setOpen(false)
                        setRecord({})
                    }}
                    positive
                />
            </Modal.Actions>
        </Modal>
    )
}

function PatientMovementsEdit(props) {

    const { open, setOpen, record, setRecord, Profile, Updatefunction, onSuccess, fillnotification } = props

    const t = Profile?.i18n?.t

    const [occureddate, setOccureddate] = useState(Formatfulldate(record?.Occureddate))

    useEffect(() => {
        if (open) {
            setOccureddate(Formatfulldate(record?.Occureddate))
        }
    }, [open])

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

    const typename = Movementtypes.find(u => u.value === record?.Type)?.name || t('Common.NoDataFound')
    const occureddatetext = Formatfulldate(record?.Occureddate, true)

    const isDifferent = Formatfulldate(record?.Occureddate) !== occureddate

    return (
        <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
        >
            <Modal.Header>{t('Pages.Patients.PatientMovements.Page.UpdateHeader')}</Modal.Header>
            <Modal.Description className='font-bold mx-4 my-2'>{`${typename} - ${occureddatetext}`}</Modal.Description>
            <Modal.Content  >
                <Form>
                    <Form.Group widths={'equal'}>
                        <Form.Input
                            label={t('Pages.Patients.PatientMovements.Columns.Occureddate')}
                            type='datetime-local'
                            value={occureddate}
                            onChange={(e) => {
                                setOccureddate(e.target.value)
                            }}
                            fluid
                        />
                    </Form.Group>
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button color='black' onClick={() => {
                    setOpen(false)
                    setRecord({})
                }}>
                    {t('Common.Button.Giveup')}
                </Button>
                {isDifferent ?
                    <Button
                        content={t('Common.Button.Update')}
                        labelPosition='right'
                        icon='checkmark'
                        onClick={() => {
                            let errors = []
                            if (!validator.isISODate(occureddate)) {
                                errors.push({ type: 'Error', code: t('Pages.Patients.PatientMovements.Page.UpdateHeader'), description: t('Pages.Patients.PatientMovements.Messages.OccureddateRequired') })
                            }

                            if (errors.length > 0) {
                                errors.forEach(error => {
                                    fillnotification(error)
                                })
                            } else {
                                Updatefunction({
                                    data: {
                                        Uuid: record?.Uuid,
                                        Occureddate: occureddate
                                    }, onSuccess: onSuccess
                                })
                                setOpen(false)
                                setRecord({})
                            }
                        }}
                        positive
                    /> : null}
            </Modal.Actions>
        </Modal>
    )
}
