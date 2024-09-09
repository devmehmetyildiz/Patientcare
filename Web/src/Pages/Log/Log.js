import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Form, Grid, GridColumn, Icon, Modal } from 'semantic-ui-react'
import { Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings, DataTable, Contentwrapper, FormInput } from '../../Components'
import { FormContext } from '../../Provider/FormProvider'
import Formatdate, { Formatfulldate } from '../../Utils/Formatdate'

export default function Log(props) {
    const { GetLogsByQuerry, Reports, Profile, GetUsers, Users } = props
    const [modal, setModal] = useState(false)
    const [record, setRecord] = useState(null)
    const PAGE_NAME = 'Log'
    const t = Profile?.i18n?.t

    const context = useContext(FormContext)
    const data = context.getForm(PAGE_NAME)


    useEffect(() => {
        GetUsers()
        const start = new Date()
        const end = new Date()
        start.setMinutes(start.getMinutes() - 5)
        end.setMinutes(end.getMinutes() + 2)
        const starttime = start.toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit' })
        const endtime = end.toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit' })
        context.setFormstates({
            ...context.formstates,
            [`${PAGE_NAME}/Startdate`]: Formatdate(start),
            [`${PAGE_NAME}/Enddate`]: Formatdate(end),
            [`${PAGE_NAME}/Starttime`]: starttime,
            [`${PAGE_NAME}/Endtime`]: endtime
        })
    }, [])

    const dateCellhandler = (value) => {
        return Formatfulldate(value, true)
    }

    const handleClick = (e) => {
        e.preventDefault()
        const stringToHour = (str) => {
            let parsed = (str || '').split(':')
            if ((parsed || []).length > 1) {
                return { hour: parsed[0], min: parsed[1] }
            } else {
                return { hour: "00", min: "00" }
            }
        }

        const {
            Startdate,
            Enddate,
            Starttime,
            Endtime,
            Status,
            Service,
            UserID,
            Targeturl,
            Requesttype
        } = data

        let startDate = new Date(Startdate)
        let endDate = new Date(Enddate)
        let startTime = stringToHour(Starttime)
        let endTime = stringToHour(Endtime)
        startDate.setHours(startTime.hour, startTime.min)
        endDate.setHours(endTime.hour, endTime.min)

        GetLogsByQuerry({
            data: {
                Status,
                Service,
                UserID,
                Targeturl,
                Requesttype,
                Startdate: Startdate ? startDate : null,
                Enddate: Enddate ? endDate : null
            }
        })
    }

    const Columns = [
        { Header: t('Common.Column.Id'), accessor: 'Id' },
        { Header: t('Common.Column.Uuid'), accessor: 'Uuid' },
        { Header: t('Pages.Log.Columns.Service'), accessor: 'Service', Title: true },
        { Header: t('Pages.Log.Columns.User'), accessor: 'UserID' },
        { Header: t('Pages.Log.Columns.Requesttype'), accessor: 'Requesttype', },
        { Header: t('Pages.Log.Columns.Requesturl'), accessor: 'Requesturl', },
        { Header: t('Pages.Log.Columns.Requestip'), accessor: 'Requestip', },
        { Header: t('Pages.Log.Columns.Targeturl'), accessor: 'Targeturl', },
        { Header: t('Pages.Log.Columns.Status'), accessor: 'Status', },
        { Header: t('Pages.Log.Columns.Requestdata'), accessor: 'Requestdata', },
        { Header: t('Pages.Log.Columns.Responsedata'), accessor: 'Responsedata' },
        { Header: t('Common.Column.Createtime'), accessor: row => dateCellhandler(row?.Createtime), },
    ]

    const { isLoading, logs } = Reports

    const Useroptions = (Users.list || []).filter(u => u.Isactive).map(personel => {
        return { key: personel.Username, text: personel.Username, value: personel.Username }
    })

    const ReqOptions = [
        { key: "GET", text: "GET", value: "GET" },
        { key: "POST", text: "POST", value: "POST" },
        { key: "PUT", text: "PUT", value: "PUT" },
        { key: "DELETE", text: "DELETE", value: "DELETE" },
    ]

    const ServiceOptions = [
        { key: "Auth", text: "Auth", value: "Auth" },
        { key: "Business", text: "Business", value: "Business" },
        { key: "Setting", text: "Setting", value: "Setting" },
        { key: "System", text: "System", value: "System" },
        { key: "Userrole", text: "Userrole", value: "Userrole" },
        { key: "Warehouse", text: "Warehouse", value: "Warehouse" },
        { key: "File", text: "File", value: "File" },
    ]

    const list = (logs || []).map(u => {
        return {
            ...u,
            Requestdata: <div
                onClick={() => {
                    setModal(true)
                    setRecord(u?.Requestdata)
                }}
                className='w-full grid place-content-center cursor-pointer'>
                <Icon name='file' />
            </div>,
            Responsedata: <div
                onClick={() => {
                    setModal(true)
                    setRecord(u?.Responsedata)
                }}
                className='w-full grid place-content-center cursor-pointer'>
                <Icon name='file' />
            </div>
        }
    })

    return (
        isLoading ? <LoadingPage /> :
            <React.Fragment>
                <Pagewrapper>
                    <Headerwrapper>
                        <Grid columns='2' >
                            <GridColumn width={8}>
                                <Breadcrumb size='big'>
                                    <Link to={"/Logs"}>
                                        <Breadcrumb.Section>{t('Pages.Log.Page.Header')}</Breadcrumb.Section>
                                    </Link>
                                </Breadcrumb>
                            </GridColumn>
                            <Settings
                                Profile={Profile}
                                Columns={Columns}
                                list={list}
                                Showexcelexport
                            />
                        </Grid>
                    </Headerwrapper>
                    <Pagedivider />
                    <Contentwrapper>
                        <Breadcrumb size='big'>
                            <Breadcrumb.Section>{t('Pages.Log.Page.FilterHeader')}</Breadcrumb.Section>
                        </Breadcrumb>
                        <Pagedivider />
                        <Form>
                            <Form.Group widths='equal'>
                                <FormInput page={PAGE_NAME} placeholder={t('Pages.Log.Label.Startdate')} name="Startdate" type='date' />
                                <FormInput page={PAGE_NAME} placeholder={t('Pages.Log.Label.Starttime')} name="Starttime" type='time' />
                                <FormInput page={PAGE_NAME} placeholder={t('Pages.Log.Label.Enddate')} name="Enddate" type='date' />
                                <FormInput page={PAGE_NAME} placeholder={t('Pages.Log.Label.Endtime')} name="Endtime" type='time' />
                            </Form.Group>
                            <Form.Group widths='equal'>
                                <FormInput page={PAGE_NAME} placeholder={t('Pages.Log.Label.Status')} name="Status" />
                                <FormInput page={PAGE_NAME} placeholder={t('Pages.Log.Label.Service')} name="Service" options={ServiceOptions} formtype='dropdown' />
                                <FormInput page={PAGE_NAME} placeholder={t('Pages.Log.Label.User')} name="UserID" options={Useroptions} formtype='dropdown' />
                                <FormInput page={PAGE_NAME} placeholder={t('Pages.Log.Label.Targeturl')} name="Targeturl" />
                            </Form.Group>
                            <Form.Group widths='equal'>
                                <FormInput page={PAGE_NAME} placeholder={t('Pages.Log.Label.Requesttype')} name="Requesttype" options={ReqOptions} formtype='dropdown' />
                            </Form.Group>
                            <Form.Group widths={'equal'}>
                                <Form.Field>
                                    <Button
                                        onClick={handleClick}
                                        className='!bg-[#2355a0] !text-white'
                                        floated='right'
                                        content={t('Pages.Log.Label.Filter')}
                                    />
                                </Form.Field>
                            </Form.Group>
                        </Form>
                    </Contentwrapper>
                    {list.length > 0 ?
                        <div className='w-full mx-auto '>
                            {Profile.Ismobile ?
                                <MobileTable Columns={Columns} Data={list} Profile={Profile} /> :
                                <DataTable Columns={Columns} Data={list} />}
                        </div> : <NoDataScreen message={t('Common.NoDataFound')} />
                    }
                </Pagewrapper>
                <Modal
                    open={modal}
                    onClose={() => {
                        setModal(false)
                        setRecord(null)
                    }}
                    onOpen={() => setModal(true)}
                >
                    <Modal.Header>{t('Pages.Log.Page.ModalHeader')}</Modal.Header>
                    <Modal.Content>
                        <Modal.Description>
                            <div className='whitespace-normal overflow-auto'>
                                {record}
                            </div>
                        </Modal.Description>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={() => {
                            setModal(false)
                            setRecord(null)
                        }}>{t('Common.Button.Goback')}</Button>
                    </Modal.Actions>
                </Modal>
            </React.Fragment>
    )
}