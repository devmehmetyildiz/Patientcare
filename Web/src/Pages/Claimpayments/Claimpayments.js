import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Tab } from 'semantic-ui-react'
import { Breadcrumb, Grid, GridColumn } from 'semantic-ui-react'
import { Contentwrapper, DataTable, Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings } from '../../Components'
import GetInitialconfig from '../../Utils/GetInitialconfig'
import validator from '../../Utils/Validator'
import { Formatfulldate } from '../../Utils/Formatdate'
import { CLAIMPAYMENT_TYPE_BHKS, CLAIMPAYMENT_TYPE_KYS, CLAIMPAYMENT_TYPE_PATIENT, CLAIMPAYMENT_TYPE_PERSONEL } from '../../Utils/Constants'
import ClaimpaymentsApprove from '../../Containers/Claimpayments/ClaimpaymentsApprove'
import ClaimpaymentsDelete from '../../Containers/Claimpayments/ClaimpaymentsDelete'

export default class Claimpayments extends Component {

    componentDidMount() {
        const { GetClaimpayments } = this.props
        GetClaimpayments()
    }

    render() {
        const { Claimpayments, Profile, handleDeletemodal, handleSelectedClaimpayment, handleApprovemodal, } = this.props
        const t = Profile?.i18n?.t
        const { isLoading } = Claimpayments

        const colProps = {
            sortable: true,
            canGroupBy: true,
            canFilter: true
        }

        const Columns = [
            { Header: t('Common.Column.Id'), accessor: 'Id' },
            { Header: t('Common.Column.Uuid'), accessor: 'Uuid' },
            { Header: t('Pages.Claimpayments.Column.Name'), accessor: 'Name' },
            { Header: t('Pages.Claimpayments.Column.Info'), accessor: 'Info' },
            { Header: t('Pages.Claimpayments.Column.Type'), accessor: row => this.typeCellhandler(row?.Type) },
            { Header: t('Pages.Claimpayments.Column.Totaldaycount'), accessor: 'Totaldaycount' },
            { Header: t('Pages.Claimpayments.Column.Totalcalculatedpayment'), accessor: row => this.currencyCellhandler(row?.Totalcalculatedpayment) },
            { Header: t('Pages.Claimpayments.Column.Totalcalculatedkdv'), accessor: row => this.currencyCellhandler(row?.Totalcalculatedkdv) },
            { Header: t('Pages.Claimpayments.Column.Totalcalculatedfinal'), accessor: row => this.currencyCellhandler(row?.Totalcalculatedfinal) },
            { Header: t('Pages.Claimpayments.Column.Totalcalculatedwithholding'), accessor: row => this.currencyCellhandler(row?.Totalcalculatedwithholding) },
            { Header: t('Pages.Claimpayments.Column.Isonpreview'), accessor: row => this.boolCellhandler(row?.Isonpreview) },
            { Header: t('Pages.Claimpayments.Column.Isapproved'), accessor: row => this.boolCellhandler(row?.Isapproved) },
            { Header: t('Pages.Claimpayments.Column.Approveduser'), accessor: 'Approveduser' },
            { Header: t('Pages.Claimpayments.Column.Approvetime'), accessor: row => this.dateCellhandler(row?.Approvetime) },
            { Header: t('Pages.Claimpayments.Column.Starttime'), accessor: row => this.dateCellhandler(row?.Starttime) },
            { Header: t('Pages.Claimpayments.Column.Endtime'), accessor: row => this.dateCellhandler(row?.Endtime) },
            { Header: t('Common.Column.Createduser'), accessor: 'Createduser' },
            { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser' },
            { Header: t('Common.Column.Createtime'), accessor: 'Createtime' },
            { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime' },
            { Header: t('Common.Column.detail'), accessor: 'detail', disableProps: true },
            { Header: t('Common.Column.approve'), accessor: 'approve', disableProps: true },
            { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true, }
        ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

        const metaKey = "claimpayment"
        let initialConfig = GetInitialconfig(Profile, metaKey)

        const list = (Claimpayments.list || []).filter(u => u.Isactive).map(item => {
            return {
                ...item,
                delete: item.Isapproved ? <Icon size='large' color='black' name='minus' /> : <Icon link size='large' color='red' name='alternate trash' onClick={() => {
                    handleSelectedClaimpayment(item)
                    handleDeletemodal(true)
                }} />,
                approve: item.Isonpreview || item.Isapproved ? <Icon size='large' color='black' name='minus' /> : <Icon link size='large' color='red' name='hand pointer' onClick={() => {
                    handleSelectedClaimpayment(item)
                    handleApprovemodal(true)
                }} />,
                detail: <Link key={item?.Uuid} to={`/Claimpayments/${item?.Uuid}`} ><Icon size='large' color='red' className='row-edit' name='address book' /> </Link>,
            }
        })

        const approvedList = list.filter(u => u.Isapproved && !u.Isonpreview)
        const waitingapproveList = list.filter(u => !u.Isapproved && !u.Isonpreview)
        const onpreviewList = list.filter(u => !u.Isapproved && u.Isonpreview)

        return (
            isLoading ? <LoadingPage /> :
                <React.Fragment>
                    <Pagewrapper>
                        <Headerwrapper>
                            <Grid columns='2' >
                                <GridColumn width={8}>
                                    <Breadcrumb size='big'>
                                        <Link to={"/Claimpayments"}>
                                            <Breadcrumb.Section>{t('Pages.Claimpayments.Page.Header')}</Breadcrumb.Section>
                                        </Link>
                                    </Breadcrumb>
                                </GridColumn>
                                <Settings
                                    Profile={Profile}
                                    Pagecreateheader={t('Pages.Claimpayments.Page.CreateHeader')}
                                    Pagecreatelink={"/Claimpayments/Create"}
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
                                        menuItem: `${t('Pages.Claimpayments.Tab.Approved')} (${(approvedList || []).length})`,
                                        pane: {
                                            key: 'onlyactive',
                                            content: this.renderView(approvedList, Columns, initialConfig)
                                        }
                                    },
                                    {
                                        menuItem: `${t('Pages.Claimpayments.Tab.Waitingapprove')} (${(waitingapproveList || []).length})`,
                                        pane: {
                                            key: 'onlyactive',
                                            content: this.renderView(waitingapproveList, Columns, initialConfig)
                                        }
                                    },
                                    {
                                        menuItem: `${t('Pages.Claimpayments.Tab.Preview')} (${(onpreviewList || []).length})`,
                                        pane: {
                                            key: 'onlyactive',
                                            content: this.renderView(onpreviewList, Columns, initialConfig)
                                        }
                                    },
                                    {
                                        menuItem: `${t('Pages.Claimpayments.Tab.All')} (${(list || []).length})`,
                                        pane: {
                                            key: 'onlyactive',
                                            content: this.renderView(list, Columns, initialConfig)
                                        }
                                    },
                                ]}
                                renderActiveOnly={false}
                            />
                        </Contentwrapper>
                        <ClaimpaymentsApprove />
                        <ClaimpaymentsDelete />
                    </Pagewrapper>
                </React.Fragment>
        )
    }

    renderView = (list, Columns, initialConfig) => {
        const { Profile } = this.props
        const t = Profile?.i18n?.t

        return list.length > 0 ?
            <div className='w-full mx-auto '>
                {Profile.Ismobile ?
                    <MobileTable Columns={Columns} Data={list} Config={initialConfig} Profile={Profile} /> :
                    <DataTable Columns={Columns} Data={list} Config={initialConfig} />}
            </div> : <NoDataScreen style={{ height: 'auto' }} message={t('Common.NoDataFound')} />

    }

    boolCellhandler = (value) => {
        const { Profile } = this.props
        const t = Profile?.i18n?.t
        return value !== null && validator.isBoolean(value)
            ? (value
                ? t('Common.Yes')
                : t('Common.No'))
            : t('Common.No')
    }

    dateCellhandler = (value) => {
        if (value) {
            return Formatfulldate(value, true)
        }
        return value
    }

    currencyCellhandler = (value) => {
        if (value) {
            return this.CurrencyLabel({ value: value })
        }
        return value
    }

    CurrencyLabel = ({ value, locale = 'tr-TR', currency = 'TRY' }) => {
        const formatter = new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
        });

        return <span>{formatter.format(value)}</span>;
    };

    typeCellhandler = (value) => {
        const { Profile } = this.props

        const t = Profile?.i18n?.t

        const Claimpaymenttypes = [
            { key: 1, text: t('Common.Claimpayments.Type.Patient'), value: CLAIMPAYMENT_TYPE_PATIENT },
            { key: 2, text: t('Common.Claimpayments.Type.Bhks'), value: CLAIMPAYMENT_TYPE_BHKS },
            { key: 3, text: t('Common.Claimpayments.Type.Kys'), value: CLAIMPAYMENT_TYPE_KYS },
            { key: 4, text: t('Common.Claimpayments.Type.Personel'), value: CLAIMPAYMENT_TYPE_PERSONEL },
        ]

        const type = Claimpaymenttypes.find(u => u.value === value)?.text || t('Common.NoDataFound')
        return type
    }
}