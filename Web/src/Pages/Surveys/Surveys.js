import React, { useCallback, useEffect, useState } from 'react'
import { Breadcrumb, Confirm, Grid, GridColumn, Icon, Label, Loader, Tab, Table } from 'semantic-ui-react'
import { SURVEY_TYPE_PATIENT, SURVEY_TYPE_PATIENTCONTACT, SURVEY_TYPE_USER } from '../../Utils/Constants'
import { COL_PROPS } from '../../Utils/Constants'
import { Contentwrapper, DataTable, Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings } from '../../Components'
import { Link } from 'react-router-dom/cjs/react-router-dom.min'
import GetInitialconfig from '../../Utils/GetInitialconfig'
import SurveysDelete from '../../Containers/Surveys/SurveysDelete'
import SurveysSavepreview from '../../Containers/Surveys/SurveysSavepreview'
import SurveysApprove from '../../Containers/Surveys/SurveysApprove'
import SurveysComplete from '../../Containers/Surveys/SurveysComplete'
import SurveysFill from '../../Containers/Surveys/SurveysFill'
import validator from '../../Utils/Validator'
import SurveysDetail from '../../Containers/Surveys/SurveysDetail'

export default function Surveys(props) {
    const { Profile, Users, Surveys, Patients, Patientdefines } = props
    const { GetSurveys, GetUsers, GetPatientdefines, GetPatients, RemoveSurveyanswer, ClearSurvey } = props

    const t = Profile?.i18n?.t
    const [detailOpen, setDetailOpen] = useState(false)
    const [fillOpen, setFillOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [previewOpen, setPreviewOpen] = useState(false)
    const [completeOpen, setCompleteOpen] = useState(false)
    const [approveOpen, setApproveOpen] = useState(false)
    const [record, setRecord] = useState(null)
    const [confirmResult, setConfirmResult] = useState(null)
    const [confirmClear, setConfirmClear] = useState(null)

    const typeCellhandler = (value) => {
        const Surveytypeoption = [
            { key: 1, text: t('Option.Surveytypes.Patient'), value: SURVEY_TYPE_PATIENT },
            { key: 2, text: t('Option.Surveytypes.Patientcontant'), value: SURVEY_TYPE_PATIENTCONTACT },
            { key: 3, text: t('Option.Surveytypes.User'), value: SURVEY_TYPE_USER },
        ]
        return Surveytypeoption.find(u => u.value === value)?.text || t('Common.NoDataFound')
    }

    const userCellhandler = (value) => {
        if (Users.isLoading) {
            return <Loader size='small' active inline='centered' ></Loader>
        } else {
            const user = (Users?.list || []).find(u => u.Uuid === value)
            return `${user?.Name} ${user?.Surname}`
        }
    }

    const patientCellhandler = (value) => {
        if (Patients.isLoading || Patientdefines.isLoading) {
            return <Loader size='small' active inline='centered' ></Loader>
        } else {
            const patient = (Patients?.list || []).find(u => u.Uuid === value)
            const patientdefine = (Patientdefines?.list || []).find(u => u.Uuid === patient?.PatientdefineID)
            return `${patientdefine?.Firstname} ${patientdefine?.Lastname}`
        }
    }

    const expandCellhandler = (col) => {
        return (!Profile.Ismobile && col?.row) && <span {...col?.row?.getToggleRowExpandedProps()}>
            {col?.row?.isExpanded ? <Icon name='triangle down' /> : <Icon name='triangle right' />}
        </span>
    }

    const renderRowSubComponent = useCallback(
        ({ row }) => {
            const selectedSurvey = row?.original || {}
            const selectedSurveyResult = selectedSurvey?.Surveyresults || []
            const selectedSurveyDetails = selectedSurvey?.Surveydetails || []

            const getAccessor = (row) => {
                switch (selectedSurvey?.Type) {
                    case SURVEY_TYPE_PATIENT:
                        return patientCellhandler(row?.UserID)
                    case SURVEY_TYPE_PATIENTCONTACT:
                        return patientCellhandler(row?.UserID)
                    case SURVEY_TYPE_USER:
                        return userCellhandler(row?.UserID)
                    default:
                        break;
                }
            }

            return <div className='p-4  shadow-gray-300 shadow-2'>
                {(selectedSurveyResult || []).length > 0 ?
                    <React.Fragment>
                        {[...new Set((selectedSurveyResult || []).map(u => u.SurveydetailID))].map((detailID, index) => {

                            const selectedDetail = selectedSurveyDetails.find(u => u.Uuid === detailID)
                            const selectedAnswers = selectedSurveyResult.filter(u => u.SurveydetailID === detailID)

                            return <React.Fragment key={index}>
                                <Label key={`${index}-label`} ribbon>{`${t('Pages.Surveys.Column.Question')} : ${selectedDetail?.Question || t('Common.NoDataFound')}`}</Label>
                                <Table key={`${index}-table`} size='small' celled>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell>{t('Pages.Surveys.Column.User')}</Table.HeaderCell>
                                            <Table.HeaderCell width={1}>{t('Pages.Surveys.Column.Result')}</Table.HeaderCell>
                                            {!selectedSurvey.Iscompleted ? <Table.HeaderCell width={1}>{t('Common.Column.delete')}</Table.HeaderCell> : null}
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {(selectedAnswers || []).map((result, index) => {
                                            return <Table.Row key={index}>
                                                <Table.Cell>
                                                    {getAccessor(result)}
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {result?.Answer}
                                                </Table.Cell>
                                                {!selectedSurvey.Iscompleted ? <Table.Cell>
                                                    <Icon link size='large' color='red' name='alternate trash' onClick={() => { setConfirmResult(result) }} />
                                                </Table.Cell> : null}
                                            </Table.Row>
                                        })}
                                    </Table.Body>
                                </Table>
                                <Pagedivider />
                            </React.Fragment>
                        })}
                    </React.Fragment> : null}
            </div>
        }
        , [Surveys.list, Patients.list, Patientdefines.list, Users.list])

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
                    <DataTable Columns={columns} Data={list} Config={initialConfig} renderRowSubComponent={renderRowSubComponent} />}
            </div> : <NoDataScreen style={{ height: 'auto' }} message={t('Common.NoDataFound')} />
    }


    const Columns = [
        { Header: '', id: 'expander', accessor: 'expander', Cell: col => expandCellhandler(col), disableProps: true, disableMobile: true, keys: ['approved', 'completed'] },
        { Header: t('Common.Column.Id'), accessor: 'Id' },
        { Header: t('Common.Column.Uuid'), accessor: 'Uuid' },
        { Header: t('Pages.Surveys.Column.Type'), accessor: row => typeCellhandler(row?.Type) },
        { Header: t('Pages.Surveys.Column.Name'), accessor: 'Name' },
        { Header: t('Pages.Surveys.Column.Description'), accessor: 'Description' },
        { Header: t('Pages.Surveys.Column.Prepareduser'), accessor: row => userCellhandler(row?.PrepareduserID) },
        { Header: t('Pages.Surveys.Column.Minnumber'), accessor: 'Minnumber' },
        { Header: t('Pages.Surveys.Column.Maxnumber'), accessor: 'Maxnumber' },
        { Header: t('Pages.Surveys.Column.Completedusercount'), accessor: 'Completedusercount', keys: ['approved', 'completed'] },
        { Header: t('Common.Column.Createduser'), accessor: 'Createduser' },
        { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser' },
        { Header: t('Common.Column.Createtime'), accessor: 'Createtime' },
        { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime' },
        { Header: t('Common.Column.savepreview'), accessor: 'savepreview', disableProps: true, keys: ['onpreview'] },
        { Header: t('Common.Column.approve'), accessor: 'approve', disableProps: true, keys: ['waitingapprove'] },
        { Header: t('Common.Column.complete'), accessor: 'complete', disableProps: true, keys: ['approved'] },
        { Header: t('Common.Column.fill'), accessor: 'fill', disableProps: true, keys: ['approved'] },
        { Header: t('Common.Column.clear'), accessor: 'clear', disableProps: true, keys: ['approved'] },
        { Header: t('Common.Column.detail'), accessor: 'detail', disableProps: true, },
        { Header: t('Common.Column.edit'), accessor: 'edit', disableProps: true, keys: ['onpreview'] },
        { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true, keys: ['onpreview', 'waitingapprove'] }
    ].map(u => { return u.disableProps ? u : { ...u, ...COL_PROPS } })

    const metaKey = "survey"
    let initialConfig = GetInitialconfig(Profile, metaKey)

    const list = (Surveys.list || []).filter(u => u.Isactive).map(item => {
        return {
            ...item,
            edit: <Link to={`/Surveys/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
            delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
                setRecord(item)
                setDeleteOpen(true)
            }} />,
            fill: <Icon link size='large' color='green' name='pencil alternate' onClick={() => {
                setRecord(item)
                setFillOpen(true)
            }} />,
            clear: <Icon link size='large' color='grey' name='delete calendar' onClick={() => {
                setConfirmClear(item)
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
            detail: <Icon link size='large' color='grey' name='refresh' onClick={() => {
                setRecord(item)
                setDetailOpen(true)
            }} />,
        }
    })

    const completedList = list.filter(u => u.Iscompleted && u.Isapproved && !u.Isonpreview)
    const approvedList = list.filter(u => !u.Iscompleted && u.Isapproved && !u.Isonpreview)
    const waitingapproveList = list.filter(u => !u.Iscompleted && !u.Isapproved && !u.Isonpreview)
    const onpreviewList = list.filter(u => !u.Iscompleted && !u.Isapproved && u.Isonpreview)

    useEffect(() => {
        GetSurveys()
        GetUsers()
        GetPatients()
        GetPatientdefines()
    }, [])


    return (
        Surveys.isLoading ? <LoadingPage /> :
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
                <SurveysDetail
                    open={detailOpen}
                    setOpen={setDetailOpen}
                    record={record}
                    setRecord={setRecord}
                />
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
                <Confirm
                    open={validator.isObject(confirmResult)}
                    onClose={() => { setConfirmResult(null) }}
                    onCancel={() => { setConfirmResult(null) }}
                    content={`${t('Pages.Surveys.Delete.Label.ResultCheck')}`}
                    cancelButton={t('Common.Button.Cancel')}
                    confirmButton={t('Common.Button.Delete')}
                    onConfirm={() => {
                        RemoveSurveyanswer({
                            data: confirmResult,
                            onSuccess: () => {
                                setConfirmResult(null)
                                GetSurveys()
                            }
                        })

                    }}
                />
                <Confirm
                    open={validator.isObject(confirmClear)}
                    onClose={() => { setConfirmClear(null) }}
                    onCancel={() => { setConfirmClear(null) }}
                    content={`${t('Pages.Surveys.Delete.Label.ClearCheck')}`}
                    cancelButton={t('Common.Button.Cancel')}
                    confirmButton={t('Common.Button.Clear')}
                    onConfirm={() => {
                        ClearSurvey({
                            data: confirmClear,
                            onSuccess: () => {
                                setConfirmClear(null)
                                GetSurveys()
                            }
                        })

                    }}
                />
            </Pagewrapper>

    )
}
