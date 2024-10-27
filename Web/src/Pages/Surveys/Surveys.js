import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Loader, } from 'semantic-ui-react'
import { Breadcrumb, Grid, GridColumn } from 'semantic-ui-react'
import { DataTable, Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings } from '../../Components'
import GetInitialconfig from '../../Utils/GetInitialconfig'
import { useGetSurveysQuery } from '../../Api/Features/Survey.ts'
import { useSelector } from 'react-redux'
import { useGetUsersQuery } from '../../Api/Features/Users'
import { COL_PROPS } from '../../Utils/Constants'

export default function Surveys() {

    const Profile = useSelector((state) => state.Profile)
    const t = Profile?.i18n?.t

    const [open, setOpen] = useState(false)
    const [record, setRecord] = useState(null)

    const { data: prelist, isFetching } = useGetSurveysQuery({}, { refetchOnMountOrArgChange: true })
    const { data: Users, isFetching: userIsFetching } = useGetUsersQuery()

    const userCellhandler = (value) => {
        if (userIsFetching) {
            return <Loader size='small' active inline='centered' ></Loader>
        } else {
            const user = (Users?.list || []).find(u => u.Uuid === value)
            return `${user?.Name} ${user?.Surname}`
        }
    }

    const Columns = [
        { Header: t('Common.Column.Id'), accessor: 'Id' },
        { Header: t('Common.Column.Uuid'), accessor: 'Uuid' },
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
        { Header: t('Common.Column.edit'), accessor: 'edit', disableProps: true },
        { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true, }
    ].map(u => { return u.disableProps ? u : { ...u, ...COL_PROPS } })

    const metaKey = "survey"
    let initialConfig = GetInitialconfig(Profile, metaKey)

    const list = (prelist || []).filter(u => u.Isactive).map(item => {
        return {
            ...item,
            edit: <Link to={`/Surveys/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
            delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
                setRecord(item)
                setOpen(true)
            }} />
        }
    })

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
                {list.length > 0 ?
                    <div className='w-full mx-auto '>
                        {Profile.Ismobile ?
                            <MobileTable Columns={Columns} Data={list} Config={initialConfig} Profile={Profile} /> :
                            <DataTable Columns={Columns} Data={list} Config={initialConfig} />}
                    </div> : <NoDataScreen message={t('Common.NoDataFound')} />
                }
            </Pagewrapper>
    )
}
