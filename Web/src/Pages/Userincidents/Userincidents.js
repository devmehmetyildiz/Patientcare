import React, { useEffect, useState } from 'react'
import { Breadcrumb, Grid, GridColumn, Icon, Loader, Tab } from 'semantic-ui-react'
import { COL_PROPS, USER_INCIDENT_BYCONTACT, USER_INCIDENT_PHYSICAL, USER_INCIDENT_TOPERSONELS } from '../../Utils/Constants'
import {
    Contentwrapper, DataTable, Headerwrapper, LoadingPage,
    MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings
} from '../../Components'
import { Link } from 'react-router-dom/cjs/react-router-dom.min'
import GetInitialconfig from '../../Utils/GetInitialconfig'
import UserincidentsDelete from '../../Containers/Userincidents/UserincidentsDelete'
import UserincidentsSavepreview from '../../Containers/Userincidents/UserincidentsSavepreview'
import UserincidentsApprove from '../../Containers/Userincidents/UserincidentsApprove'
import UserincidentsComplete from '../../Containers/Userincidents/UserincidentsComplete'
import { Formatfulldate } from '../../Utils/Formatdate'
import useTabNavigation from '../../Hooks/useTabNavigation'

export default function Userincidents(props) {

    const { Profile, Users, Userincidents, history, location } = props
    const { GetUserincidents, GetUsers, } = props

    const t = Profile?.i18n?.t
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [previewOpen, setPreviewOpen] = useState(false)
    const [completeOpen, setCompleteOpen] = useState(false)
    const [approveOpen, setApproveOpen] = useState(false)
    const [record, setRecord] = useState(null)



    const userCellhandler = (value) => {
        if (Users.isLoading) {
            return <Loader size='small' active inline='centered' ></Loader>
        } else {
            const user = (Users?.list || []).find(u => u.Uuid === value)
            return `${user?.Name} ${user?.Surname}`
        }
    }

    const typeCellhandler = (value) => {
        const Typeeoption = [
            { key: 1, text: t('Option.Userincident.Topersonels'), value: USER_INCIDENT_TOPERSONELS },
            { key: 2, text: t('Option.Userincident.Bycontact'), value: USER_INCIDENT_BYCONTACT },
            { key: 3, text: t('Option.Userincident.Physical'), value: USER_INCIDENT_PHYSICAL },
        ]
        const type = (Typeeoption || []).find(u => u.value === value)
        return `${type?.text || t('Common.NoDataFound')}`
    }

    const dateCellhandler = (value) => {
        if (value) {
            return Formatfulldate(value, true)
        }
        return value
    }

    const renderView = ({ list, Columns, keys, initialConfig }) => {


        const searchbykey = (data, searchkeys) => {
            let ok = false
            searchkeys.forEach(key => {

                if (!ok) {
                    if (data.includes(key)) {
                        ok = true
                    }
                }
            });

            return ok
        }

        const columns = Columns.filter(u => searchbykey((u?.keys || []), keys) || !(u?.keys))

        return list.length > 0 ?
            <div className='w-full mx-auto '>
                {Profile.Ismobile ?
                    <MobileTable Columns={columns} Data={list} Config={initialConfig} Profile={Profile} /> :
                    <DataTable Columns={columns} Data={list} Config={initialConfig} />}
            </div> : <NoDataScreen style={{ height: 'auto' }} message={t('Common.NoDataFound')} />
    }


    const Columns = [
        { Header: t('Common.Column.Id'), accessor: 'Id' },
        { Header: t('Common.Column.Uuid'), accessor: 'Uuid' },
        { Header: t('Pages.Userincidents.Column.User'), accessor: row => userCellhandler(row?.UserID) },
        { Header: t('Pages.Userincidents.Column.Occuredtime'), accessor: row => dateCellhandler(row?.Occuredtime) },
        { Header: t('Pages.Userincidents.Column.Type'), accessor: row => typeCellhandler(row?.Type) },
        { Header: t('Pages.Userincidents.Column.Event'), accessor: 'Event' },
        { Header: t('Pages.Userincidents.Column.Eventdetail'), accessor: 'Eventdetail' },
        { Header: t('Pages.Userincidents.Column.Result'), accessor: 'Result' },
        { Header: t('Common.Column.Createduser'), accessor: 'Createduser' },
        { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser' },
        { Header: t('Common.Column.Createtime'), accessor: 'Createtime' },
        { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime' },
        { Header: t('Common.Column.savepreview'), accessor: 'savepreview', disableProps: true, keys: ['onpreview'] },
        { Header: t('Common.Column.approve'), accessor: 'approve', disableProps: true, keys: ['waitingapprove'] },
        { Header: t('Common.Column.complete'), accessor: 'complete', disableProps: true, keys: ['approved'] },
        { Header: t('Common.Column.edit'), accessor: 'edit', disableProps: true, keys: ['onpreview'] },
        { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true, keys: ['onpreview', 'waitingapprove'] }
    ].map(u => { return u.disableProps ? u : { ...u, ...COL_PROPS } })

    const metaKey = "userincident"
    let initialConfig = GetInitialconfig(Profile, metaKey)

    const list = (Userincidents.list || []).filter(u => u.Isactive).map(item => {
        return {
            ...item,
            edit: <Link to={`/Userincidents/${item.Uuid}/edit`} state={{ from: location }}><Icon size='large' className='row-edit' name='edit' /></Link>,
            delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
                setRecord(item)
                setDeleteOpen(true)
            }} />,
            approve: <Icon link size='large' color='red' name='hand pointer' onClick={() => {
                setRecord(item)
                setApproveOpen(true)
            }} />,
            complete: <Icon link size='large' color='blue' name='hand point left' onClick={() => {
                setRecord(item)
                setCompleteOpen(true)
            }} />,
            savepreview: <Icon link size='large' color='green' name='save' onClick={() => {
                setRecord(item)
                setPreviewOpen(true)
            }} />,
        }
    })

    const completedList = list.filter(u => u.Iscompleted && u.Isapproved && !u.Isonpreview)
    const approvedList = list.filter(u => !u.Iscompleted && u.Isapproved && !u.Isonpreview)
    const waitingapproveList = list.filter(u => !u.Iscompleted && !u.Isapproved && !u.Isonpreview)
    const onpreviewList = list.filter(u => !u.Iscompleted && !u.Isapproved && u.Isonpreview)

    const tabOrder = [
        'completed',
        'approved',
        'waitingapprove',
        'onpreview',
    ]

    const { activeTab, setActiveTab } = useTabNavigation({
        history,
        tabOrder,
        mainRoute: 'Userincidents'
    })

    useEffect(() => {
        GetUserincidents()
        GetUsers()
    }, [])

    return (
        Userincidents.isLoading ? <LoadingPage /> :
            <Pagewrapper>
                <Headerwrapper>
                    <Grid columns='2' >
                        <GridColumn width={8}>
                            <Breadcrumb size='big'>
                                <Link to={"/Userincidents"}>
                                    <Breadcrumb.Section>{t('Pages.Userincidents.Page.Header')}</Breadcrumb.Section>
                                </Link>
                            </Breadcrumb>
                        </GridColumn>
                        <Settings
                            Profile={Profile}
                            Pagecreateheader={t('Pages.Userincidents.Page.CreateHeader')}
                            Pagecreatelink={"/Userincidents/Create"}
                            Columns={Columns}
                            list={list}
                            initialConfig={initialConfig}
                            metaKey={metaKey}
                            Showcreatebutton
                            Showcolumnchooser
                            Showexcelexport
                        />
                    </Grid>
                </Headerwrapper>
                <Pagedivider />
                <Contentwrapper>
                    <Tab
                        onTabChange={(_, { activeIndex }) => {
                            setActiveTab(activeIndex)
                        }}
                        activeIndex={activeTab}
                        className="w-full !bg-transparent"
                        panes={[
                            {
                                menuItem: `${t('Pages.Userincidents.Tab.Completed')} (${(completedList || []).length})`,
                                pane: {
                                    key: 'completed',
                                    content: renderView({ list: completedList, Columns, keys: ['completed'], initialConfig })
                                }
                            },
                            {
                                menuItem: `${t('Pages.Userincidents.Tab.Approved')} (${(approvedList || []).length})`,
                                pane: {
                                    key: 'approved',
                                    content: renderView({ list: approvedList, Columns, keys: ['approved'], initialConfig })
                                }
                            },
                            {
                                menuItem: `${t('Pages.Userincidents.Tab.Waitingapprove')} (${(waitingapproveList || []).length})`,
                                pane: {
                                    key: 'waitingapprove',
                                    content: renderView({ list: waitingapproveList, Columns, keys: ['waitingapprove'], initialConfig })
                                }
                            },
                            {
                                menuItem: `${t('Pages.Userincidents.Tab.Onpreview')} (${(onpreviewList || []).length})`,
                                pane: {
                                    key: 'onpreview',
                                    content: renderView({ list: onpreviewList, Columns, keys: ['onpreview'], initialConfig })
                                }
                            },


                        ]}
                        renderActiveOnly={false}
                    />
                </Contentwrapper>
                <UserincidentsDelete
                    open={deleteOpen}
                    setOpen={setDeleteOpen}
                    record={record}
                    setRecord={setRecord}
                />
                <UserincidentsSavepreview
                    open={previewOpen}
                    setOpen={setPreviewOpen}
                    record={record}
                    setRecord={setRecord}
                />
                <UserincidentsApprove
                    open={approveOpen}
                    setOpen={setApproveOpen}
                    record={record}
                    setRecord={setRecord}
                />
                <UserincidentsComplete
                    open={completeOpen}
                    setOpen={setCompleteOpen}
                    record={record}
                    setRecord={setRecord}
                />
            </Pagewrapper>

    )
}
