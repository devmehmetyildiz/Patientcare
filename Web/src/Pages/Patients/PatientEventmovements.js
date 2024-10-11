import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Dropdown, Form, Grid, Icon, Loader, Modal } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { Settings, MobileTable, NoDataScreen, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, DataTable } from '../../Components'
import GetInitialconfig from '../../Utils/GetInitialconfig'
import { Formatfulldate } from '../../Utils/Formatdate'

export default function PatientEventmovements(props) {
    const { GetPatienteventdefines, GetPatientdefines, GetPatient, GetUsers, DeletePatienteventmovements, EditPatienteventmovements, fillPatientnotification } = props
    const { Patients, Patientdefines, Users, Patienteventdefines, Profile } = props
    const { match, history, PatientID } = props

    const PAGE_NAME = 'PatientEventmovements'
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
        Patienteventdefines.isLoading

    const { selected_record } = Patients

    useEffect(() => {

        if (validator.isUUID(Id)) {
            GetPatient(Id)
            GetPatienteventdefines()
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

    const eventdefineCellhandler = (value) => {
        if (Patienteventdefines.isLoading) {
            return <Loader size='small' active inline='centered' ></Loader>
        } else {
            return `${(Patienteventdefines.list || []).find(u => u.Uuid === value)?.Eventname || ''}`
        }
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

    const list = (selected_record?.Events || []).map(item => {
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
        { Header: t('Pages.Patients.PatientEventmovements.Columns.Event'), accessor: row => eventdefineCellhandler(row?.EventID), },
        { Header: t('Pages.Patients.PatientEventmovements.Columns.User'), accessor: row => userCellhandler(row?.UserID), },
        { Header: t('Pages.Patients.PatientEventmovements.Columns.Info'), accessor: 'Info' },
        { Header: t('Pages.Patients.PatientEventmovements.Columns.Occureddate'), accessor: row => dateCellhandler(row?.Occureddate) },
        { Header: t('Common.Column.Createduser'), accessor: 'Createduser' },
        { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser' },
        { Header: t('Common.Column.Createtime'), accessor: 'Createtime' },
        { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime' },
        { Header: t('Common.Column.edit'), accessor: 'edit', disableProps: true },
        { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

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
                <PatientMovementsDelete
                    open={deletemodalopen}
                    setOpen={setDeletemodalopen}
                    record={record}
                    setRecord={setRecord}
                    Profile={Profile}
                    Deletefunction={DeletePatienteventmovements}
                    Patienteventdefines={Patienteventdefines}
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
                    Patienteventdefines={Patienteventdefines}
                    Updatefunction={EditPatienteventmovements}
                    fillnotification={fillPatientnotification}
                    onSuccess={() => {
                        GetPatient(Id)
                    }}
                />
            </Pagewrapper >
    )
}


function PatientMovementsDelete(props) {

    const { open, setOpen, record, setRecord, Profile, Deletefunction, onSuccess, Patienteventdefines } = props

    const t = Profile?.i18n?.t

    const eventname = (Patienteventdefines.list || []).find(u => u.Uuid === record?.EventID)?.Eventname || t('Common.NoDataFound')
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
                        <span className='font-bold'>{eventname} </span>
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

    const { open, setOpen, record, setRecord, Profile, Updatefunction, onSuccess, fillnotification, Patienteventdefines } = props

    const t = Profile?.i18n?.t

    const [occureddate, setOccureddate] = useState(Formatfulldate(record?.Occureddate))
    const [event, setEvent] = useState(record?.EventID)
    const [info, setInfo] = useState(record?.Info)

    useEffect(() => {
        if (open) {
            setOccureddate(Formatfulldate(record?.Occureddate))
            setEvent(record?.EventID)
            setInfo(record?.Info)
        }
    }, [open])

    const eventname = (Patienteventdefines.list || []).find(u => u.Uuid === record?.EventID)?.Eventname || t('Common.NoDataFound')
    const occureddatetext = Formatfulldate(record?.Occureddate, true)

    const isDifferent = Formatfulldate(record?.Occureddate) !== occureddate

    const Patienteventdefinesoptions = (Patienteventdefines.list || []).filter(u => u.Isactive).map(event => {
        return { key: event.Uuid, text: event.Eventname, value: event.Uuid }
    })

    return (
        <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
        >
            <Modal.Header>{t('Pages.Patients.PatientEventmovements.Page.UpdateHeader')}</Modal.Header>
            <Modal.Description className='font-bold mx-4 my-2'>{`${eventname} - ${occureddatetext}`}</Modal.Description>
            <Modal.Content  >
                <Form>
                    <Form.Group widths={'equal'}>
                        <Form.Input
                            label={t('Pages.Patients.PatientEventmovements.Columns.Occureddate')}
                            type='datetime-local'
                            value={occureddate}
                            onChange={(e) => {
                                setOccureddate(e.target.value)
                            }}
                            fluid
                        />
                        <Form.Field>
                            <label className='text-[#000000de]'>{t('Pages.Patients.PatientEventmovements.Columns.Event')}</label>
                            <Dropdown
                                options={Patienteventdefinesoptions}
                                value={event}
                                clearable
                                search
                                fluid
                                selection
                                onChange={(e, data) => {
                                    setEvent(data.value)
                                }}
                            />
                        </Form.Field>
                    </Form.Group>
                    <Form.Field>
                        <Form.Input
                            label={t('Pages.Patients.PatientEventmovements.Columns.Info')}
                            value={info}
                            onChange={(e) => {
                                setInfo(e.target.value)
                            }}
                            fluid
                        />
                    </Form.Field>
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
                                errors.push({ type: 'Error', code: t('Pages.Patients.PatientEventmovements.Page.UpdateHeader'), description: t('Pages.Patients.PatientEventmovements.Messages.OccureddateRequired') })
                            }
                            if (!validator.isUUID(event)) {
                                errors.push({ type: 'Error', code: t('Pages.Patients.PatientEventmovements.Page.UpdateHeader'), description: t('Pages.Patients.PatientEventmovements.Messages.EventRequired') })
                            }

                            if (errors.length > 0) {
                                errors.forEach(error => {
                                    fillnotification(error)
                                })
                            } else {
                                Updatefunction({
                                    data: {
                                        Uuid: record?.Uuid,
                                        EventID: event,
                                        Occureddate: occureddate,
                                        Info: info
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
