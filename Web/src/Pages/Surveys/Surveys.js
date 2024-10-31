import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Loader, Tab, } from 'semantic-ui-react'
import { Breadcrumb, Grid, GridColumn } from 'semantic-ui-react'
import { Contentwrapper, DataTable, Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings } from '../../Components'
import GetInitialconfig from '../../Utils/GetInitialconfig'
import { useGetSurveysQuery } from '../../Api/Features/Survey'
import { useSelector } from 'react-redux'
import { useGetUsersQuery } from '../../Api/Features/Users'
import { COL_PROPS, SURVEY_TYPE_PATIENT, SURVEY_TYPE_PATIENTCONTACT, SURVEY_TYPE_USER } from '../../Utils/Constants'
import SurveysDelete from './SurveysDelete'
import SurveysSavepreview from './SurveysSavepreview'
import SurveysApprove from './SurveysApprove'
import SurveysComplete from './SurveysComplete'
import SurveysFill from './SurveysFill'

export default function Surveys() {

    const Profile = useSelector((state) => state.Profile)
    const t = Profile?.i18n?.t

    const [fillOpen, setFillOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [previewOpen, setPreviewOpen] = useState(false)
    const [completeOpen, setCompleteOpen] = useState(false)
    const [approveOpen, setApproveOpen] = useState(false)
    const [record, setRecord] = useState(null)

    const { data: prelist, isFetching } = useGetSurveysQuery({}, { refetchOnMountOrArgChange: true })
    const { data: Users, isFetching: userIsFetching } = useGetUsersQuery()

    const typeCellhandler = (value) => {
        const Surveytypeoption = [
            { key: 1, text: t('Option.Surveytypes.Patient'), value: SURVEY_TYPE_PATIENT },
            { key: 2, text: t('Option.Surveytypes.Patientcontant'), value: SURVEY_TYPE_PATIENTCONTACT },
            { key: 3, text: t('Option.Surveytypes.User'), value: SURVEY_TYPE_USER },
        ]
        return Surveytypeoption.find(u => u.value === value)?.text || t('Common.NoDataFound')
    }

    const userCellhandler = (value) => {
        if (userIsFetching) {
            return <Loader size='small' active inline='centered' ></Loader>
        } else {
            const user = (Users?.list || []).find(u => u.Uuid === value)
            return `${user?.Name} ${user?.Surname}`
        }
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
        { Header: t('Pages.Surveys.Column.Type'), accessor: row => typeCellhandler(row?.Type) },
        { Header: t('Pages.Surveys.Column.Name'), accessor: 'Name' },
        { Header: t('Pages.Surveys.Column.Description'), accessor: 'Description' },
        { Header: t('Pages.Surveys.Column.Prepareduser'), accessor: row => userCellhandler(row?.PrepareduserID) },
        { Header: t('Pages.Surveys.Column.Minnumber'), accessor: 'Minnumber' },
        { Header: t('Pages.Surveys.Column.Maxnumber'), accessor: 'Maxnumber' },
        { Header: t('Pages.Surveys.Column.Completedusercount'), accessor: 'Completedusercount' },
        { Header: t('Common.Column.Createduser'), accessor: 'Createduser' },
        { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser' },
        { Header: t('Common.Column.Createtime'), accessor: 'Createtime' },
        { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime' },
        { Header: t('Common.Column.savepreview'), accessor: 'savepreview', disableProps: true, keys: ['onpreview'] },
        { Header: t('Common.Column.approve'), accessor: 'approve', disableProps: true, keys: ['waitingapprove'] },
        { Header: t('Common.Column.fill'), accessor: 'fill', disableProps: true, keys: ['approved'] },
        { Header: t('Common.Column.complete'), accessor: 'complete', disableProps: true, keys: ['approved'] },
        { Header: t('Common.Column.edit'), accessor: 'edit', disableProps: true, keys: ['onpreview'] },
        { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true, keys: ['onpreview', 'waitingapprove'] }
    ].map(u => { return u.disableProps ? u : { ...u, ...COL_PROPS } })

    const metaKey = "survey"
    let initialConfig = GetInitialconfig(Profile, metaKey)

    const list = (prelist || []).filter(u => u.Isactive).map(item => {
        return {
            ...item,
            edit: <Link to={`/Surveys/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
            delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
                setRecord(item)
                setDeleteOpen(true)
            }} />,
            fill: <Icon link size='large' color='red' name='hand pointer up' onClick={() => {
                setRecord(item)
                setFillOpen(true)
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

    return (
        isFetching ? <LoadingPage /> :
            <Pagewrapper>
                <Headerwrapper>
                    <Grid columns='2' >
                        <GridColumn width={8}>
                            <Breadcrumb size='big'>
                                <Link to={"/Surveys"}>
                                    <Breadcrumb.Section>{t('Pages.Surveys.Page.Header')}</Breadcrumb.Section>
                                </Link>
                            </Breadcrumb>
                        </GridColumn>
                        <Settings
                            Profile={Profile}
                            Pagecreateheader={t('Pages.Surveys.Page.CreateHeader')}
                            Pagecreatelink={"/Surveys/Create"}
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
                        className="w-full !bg-transparent"
                        panes={[
                            {
                                menuItem: `${t('Pages.Surveys.Tab.Completed')} (${(completedList || []).length})`,
                                pane: {
                                    key: 'completed',
                                    content: renderView({ list: completedList, Columns, keys: ['completed'], initialConfig })
                                }
                            },
                            {
                                menuItem: `${t('Pages.Surveys.Tab.Approved')} (${(approvedList || []).length})`,
                                pane: {
                                    key: 'approved',
                                    content: renderView({ list: approvedList, Columns, keys: ['approved'], initialConfig })
                                }
                            },
                            {
                                menuItem: `${t('Pages.Surveys.Tab.Waitingapprove')} (${(waitingapproveList || []).length})`,
                                pane: {
                                    key: 'waitingapprove',
                                    content: renderView({ list: waitingapproveList, Columns, keys: ['waitingapprove'], initialConfig })
                                }
                            },
                            {
                                menuItem: `${t('Pages.Surveys.Tab.Onpreview')} (${(onpreviewList || []).length})`,
                                pane: {
                                    key: 'onpreview',
                                    content: renderView({ list: onpreviewList, Columns, keys: ['onpreview'], initialConfig })
                                }
                            },


                        ]}
                        renderActiveOnly={false}
                    />
                </Contentwrapper>
                <SurveysDelete
                    open={deleteOpen}
                    setOpen={setDeleteOpen}
                    record={record}
                    setRecord={setRecord}
                />
                <SurveysSavepreview
                    open={previewOpen}
                    setOpen={setPreviewOpen}
                    record={record}
                    setRecord={setRecord}
                />
                <SurveysApprove
                    open={approveOpen}
                    setOpen={setApproveOpen}
                    record={record}
                    setRecord={setRecord}
                />
                <SurveysComplete
                    open={completeOpen}
                    setOpen={setCompleteOpen}
                    record={record}
                    setRecord={setRecord}
                />
                <SurveysFill
                    open={fillOpen}
                    setOpen={setFillOpen}
                    record={record}
                    setRecord={setRecord}
                />
            </Pagewrapper>
    )
}

