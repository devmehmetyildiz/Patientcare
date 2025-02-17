import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Breadcrumb, Grid, GridColumn, Loader } from 'semantic-ui-react'
import { Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings, DataTable } from '../../Components'
import SupportplanlistsDelete from '../../Containers/Supportplanlists/SupportplanlistsDelete'
import GetInitialconfig from '../../Utils/GetInitialconfig'
import { COL_PROPS, SUPPORTPLAN_TYPE_CAREPLAN, SUPPORTPLAN_TYPE_PSYCHOSOCIAL, SUPPORTPLAN_TYPE_RATING } from '../../Utils/Constants'
import privileges from '../../Constants/Privileges'

export default class Supportplanlists extends Component {

    constructor(props) {
        super(props)
        this.state = {
            supportplanStatus: []
        }
    }

    componentDidMount() {
        const { GetSupportplanlists, GetSupportplans } = this.props
        GetSupportplanlists()
        GetSupportplans()
    }

    render() {
        const { Supportplanlists, Profile, handleDeletemodal, handleSelectedSupportplanlist } = this.props

        const { isLoading } = Supportplanlists

        const t = Profile?.i18n?.t

        const Columns = [
            { Header: t('Common.Column.Id'), accessor: 'Id' },
            { Header: t('Common.Column.Uuid'), accessor: 'Uuid' },
            { Header: t('Pages.Supportplanlists.Column.Type'), accessor: row => this.typeCellhandler(row?.Type), },
            { Header: t('Pages.Supportplanlists.Column.Name'), accessor: 'Name', Title: true },
            { Header: t('Pages.Supportplanlists.Column.Supportplans'), accessor: (row, freeze) => this.supportplanCellhandler(row, freeze), },
            { Header: t('Pages.Supportplanlists.Column.Info'), accessor: 'Info' },
            { Header: t('Common.Column.Createduser'), accessor: 'Createduser' },
            { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser' },
            { Header: t('Common.Column.Createtime'), accessor: 'Createtime' },
            { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime' },
            { Header: t('Common.Column.edit'), accessor: 'edit', disableProps: true, role: privileges.supportplanlistupdate },
            { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true, role: privileges.supportplanlistdelete }
        ].map(u => { return u.disableProps ? u : { ...u, ...COL_PROPS } })

        const metaKey = "supportplanlist"
        let initialConfig = GetInitialconfig(Profile, metaKey)

        const list = (Supportplanlists.list || []).filter(u => u.Isactive).map(item => {
            return {
                ...item,
                edit: <Link to={`/Supportplanlists/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
                delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
                    handleSelectedSupportplanlist(item)
                    handleDeletemodal(true)
                }} />
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
                                        <Link to={"/Supportplanlists"}>
                                            <Breadcrumb.Section>{t('Pages.Supportplanlists.Page.Header')}</Breadcrumb.Section>
                                        </Link>
                                    </Breadcrumb>
                                </GridColumn>
                                <Settings
                                    Profile={Profile}
                                    Pagecreateheader={t('Pages.Supportplanlists.Page.CreateHeader')}
                                    Pagecreatelink={"/Supportplanlists/Create"}
                                    Columns={Columns}
                                    list={list}
                                    initialConfig={initialConfig}
                                    metaKey={metaKey}
                                    Showcreatebutton
                                    Showcolumnchooser
                                    Showexcelexport
                                    CreateRole={privileges.supportplanlistadd}
                                    ReportRole={privileges.supportplanlistgetreport}
                                    ViewRole={privileges.supportplanlistmanageview}
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
                    <SupportplanlistsDelete />
                </React.Fragment>
        )
    }

    expandSupportplans = (rowid) => {
        const prevData = this.state.supportplanStatus
        prevData.push(rowid)
        this.setState({ supportplanStatus: [...prevData] })
    }

    shrinkSupportplans = (rowid) => {
        const index = this.state.supportplanStatus.indexOf(rowid)
        const prevData = this.state.supportplanStatus
        if (index > -1) {
            prevData.splice(index, 1)
            this.setState({ supportplanStatus: [...prevData] })
        }
    }

    supportplanCellhandler = (row, freeze) => {
        const { Supportplans } = this.props
        const itemId = row?.Id
        const itemSupportplans = (row?.Supportplanuuids || []).map(u => { return (Supportplans.list || []).find(plan => plan.Uuid === u.PlanID) })
        const itemSupportplanstxt = itemSupportplans.map(u => u?.Name).join(',')
        if (freeze === true) {
            return itemSupportplanstxt
        }
        return itemSupportplanstxt.length - 35 > 20 ?
            (
                !this.state.supportplanStatus.includes(itemId) ?
                    [itemSupportplanstxt.slice(0, 35) + ' ...(' + itemSupportplans.length + ')', <Link key={itemId} to='#' className='showMoreOrLess' onClick={() => this.expandSupportplans(itemId)}> ...Daha Fazla Göster</Link>] :
                    [itemSupportplanstxt, <Link key={itemId} to='#' className='showMoreOrLess' onClick={() => this.shrinkSupportplans(itemId)}> ...Daha Az Göster</Link>]
            ) : itemSupportplanstxt
    }

    typeCellhandler = (value) => {
        const { Profile } = this.props
        const t = Profile?.i18n?.t
        const Supportplantypeoptions = [
            { key: 1, text: t('Common.Supportplan.Types.Careplan'), value: SUPPORTPLAN_TYPE_CAREPLAN },
            { key: 2, text: t('Common.Supportplan.Types.Psychosocial'), value: SUPPORTPLAN_TYPE_PSYCHOSOCIAL },
            { key: 3, text: t('Common.Supportplan.Types.Rating'), value: SUPPORTPLAN_TYPE_RATING },
        ]

        return Supportplantypeoptions.find(u => u.value === value)?.text || t('Common.NoDataFound')
    }
}