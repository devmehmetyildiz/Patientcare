import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Tab } from 'semantic-ui-react'
import { Breadcrumb, Grid, GridColumn } from 'semantic-ui-react'
import { Contentwrapper, DataTable, Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings } from '../../Components'
import GetInitialconfig from '../../Utils/GetInitialconfig'
import { Formatfulldate } from '../../Utils/Formatdate'
import { CLAIMPAYMENT_TYPE_BHKS, CLAIMPAYMENT_TYPE_KYS, CLAIMPAYMENT_TYPE_PATIENT, CLAIMPAYMENT_TYPE_PERSONEL, COL_PROPS } from '../../Utils/Constants'
import ClaimpaymentsApprove from '../../Containers/Claimpayments/ClaimpaymentsApprove'
import ClaimpaymentsDelete from '../../Containers/Claimpayments/ClaimpaymentsDelete'
import ClaimpaymentsSavepreview from '../../Containers/Claimpayments/ClaimpaymentsSavepreview'
import useTabNavigation from '../../Hooks/useTabNavigation'
import privileges from '../../Constants/Privileges'

export default function Claimpayments(props) {

    const { GetClaimpayments, Claimpayments, Profile, history } = props

    const t = Profile?.i18n?.t
    const { isLoading } = Claimpayments

    const [deleteOpen, setDeleteOpen] = useState(false)
    const [approveOpen, setApproveOpen] = useState(false)
    const [savePreviewOpen, setSavePreviewOpen] = useState(false)
    const [record, setRecord] = useState(null)

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


    const reportdateCellhandler = (value) => {
        const date = new Date(value)
        const categories = {
            en: [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December',
            ],
            tr: [
                'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
                'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
            ]
        }

        return `${categories[Profile.Language][date.getMonth()]} - ${date.getFullYear()}`
    }

    const dateCellhandler = (value) => {
        if (value) {
            return Formatfulldate(value, true)
        }
        return value
    }

    const currencyCellhandler = (value) => {

        const CurrencyLabel = ({ value, locale = 'tr-TR', currency = 'TRY' }) => {
            const formatter = new Intl.NumberFormat(locale, {
                style: 'currency',
                currency: currency,
                minimumFractionDigits: 2,
            });

            return <span>{formatter.format(value)}</span>;
        };

        if (value) {
            return CurrencyLabel({ value: value })
        }
        return value
    }

    const typeCellhandler = (value) => {

        const Claimpaymenttypes = [
            { key: 1, text: t('Common.Claimpayments.Type.Patient'), value: CLAIMPAYMENT_TYPE_PATIENT },
            { key: 2, text: t('Common.Claimpayments.Type.Bhks'), value: CLAIMPAYMENT_TYPE_BHKS },
            { key: 3, text: t('Common.Claimpayments.Type.Kys'), value: CLAIMPAYMENT_TYPE_KYS },
            { key: 4, text: t('Common.Claimpayments.Type.Personel'), value: CLAIMPAYMENT_TYPE_PERSONEL },
        ]

        const type = Claimpaymenttypes.find(u => u.value === value)?.text || t('Common.NoDataFound')
        return type
    }

    const Columns = [
        { Header: t('Common.Column.Id'), accessor: 'Id' },
        { Header: t('Common.Column.Uuid'), accessor: 'Uuid' },
        { Header: t('Pages.Claimpayments.Column.Name'), accessor: 'Name' },
        { Header: t('Pages.Claimpayments.Column.Info'), accessor: 'Info' },
        { Header: t('Pages.Claimpayments.Column.Type'), accessor: row => typeCellhandler(row?.Type) },
        { Header: t('Pages.Claimpayments.Column.Totaldaycount'), accessor: 'Totaldaycount' },
        { Header: t('Pages.Claimpayments.Column.Totalcalculatedpayment'), accessor: row => currencyCellhandler(row?.Totalcalculatedpayment) },
        { Header: t('Pages.Claimpayments.Column.Totalcalculatedkdv'), accessor: row => currencyCellhandler(row?.Totalcalculatedkdv) },
        { Header: t('Pages.Claimpayments.Column.Totalcalculatedfinal'), accessor: row => currencyCellhandler(row?.Totalcalculatedfinal) },
        { Header: t('Pages.Claimpayments.Column.Totalcalculatedwithholding'), accessor: row => currencyCellhandler(row?.Totalcalculatedwithholding) },
        { Header: t('Pages.Claimpayments.Column.Reportdate'), accessor: row => reportdateCellhandler(row?.Reportdate) },
        { Header: t('Common.Column.Createduser'), accessor: 'Createduser' },
        { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser' },
        { Header: t('Common.Column.Createtime'), accessor: 'Createtime' },
        { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime' },
        { Header: t('Common.Column.detail'), accessor: 'detail', disableProps: true },
        { Header: t('Common.Column.savepreview'), accessor: 'savepreview', disableProps: true, keys: ['onpreview'], role: privileges.claimpaymentsavepreview },
        { Header: t('Common.Column.approve'), accessor: 'approve', disableProps: true, keys: ['waitingapprove'], role: privileges.claimpaymentapprove },
        { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true, keys: ['onpreview', 'waitingapprove'], role: privileges.claimpaymentdelete }
    ].map(u => { return u.disableProps ? u : { ...u, ...COL_PROPS } })

    const metaKey = "claimpayment"
    let initialConfig = GetInitialconfig(Profile, metaKey)

    const list = (Claimpayments.list || []).filter(u => u.Isactive).map(item => {
        return {
            ...item,
            delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
                setRecord(item)
                setDeleteOpen(true)
            }} />,
            approve: <Icon link size='large' color='red' name='hand pointer' onClick={() => {
                setRecord(item)
                setApproveOpen(true)
            }} />,
            savepreview: <Icon link size='large' color='green' name='save' onClick={() => {
                setRecord(item)
                setSavePreviewOpen(true)
            }} />,
            detail: <Link key={item?.Uuid} to={`/Claimpayments/${item?.Uuid}`} ><Icon size='large' color='red' className='row-edit' name='address book' /> </Link>,
        }
    })

    const approvedList = list.filter(u => u.Isapproved && !u.Isonpreview)
    const waitingapproveList = list.filter(u => !u.Isapproved && !u.Isonpreview)
    const onpreviewList = list.filter(u => !u.Isapproved && u.Isonpreview)

    const tabOrder = [
        'approved',
        'waitingapprove',
        'onpreview',
    ]

    const { activeTab, setActiveTab } = useTabNavigation({
        history,
        tabOrder,
        mainRoute: 'Claimpayments'
    })

    useEffect(() => {
        GetClaimpayments()
    }, [])

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
                                CreateRole={privileges.claimpaymentsavepreview}
                                ReportRole={privileges.claimpaymentgetreport}
                                ViewRole={privileges.claimpaymentmanageview}
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
                                    menuItem: `${t('Pages.Claimpayments.Tab.Approved')} (${(approvedList || []).length})`,
                                    pane: {
                                        key: 'approved',
                                        content: renderView({ list: approvedList, Columns, keys: ['approved'], initialConfig })
                                    }
                                },
                                {
                                    menuItem: `${t('Pages.Claimpayments.Tab.Waitingapprove')} (${(waitingapproveList || []).length})`,
                                    pane: {
                                        key: 'waitingapprove',
                                        content: renderView({ list: waitingapproveList, Columns, keys: ['waitingapprove'], initialConfig })
                                    }
                                },
                                {
                                    menuItem: `${t('Pages.Claimpayments.Tab.Onpreview')} (${(onpreviewList || []).length})`,
                                    pane: {
                                        key: 'onpreview',
                                        content: renderView({ list: onpreviewList, Columns, keys: ['onpreview'], initialConfig })
                                    }
                                },


                            ]}
                            renderActiveOnly={false}
                        />
                    </Contentwrapper>
                    <ClaimpaymentsApprove
                        open={approveOpen}
                        setOpen={setApproveOpen}
                        record={record}
                        setRecord={setRecord}
                    />
                    <ClaimpaymentsDelete
                        open={deleteOpen}
                        setOpen={setDeleteOpen}
                        record={record}
                        setRecord={setRecord}
                    />
                    <ClaimpaymentsSavepreview
                        open={savePreviewOpen}
                        setOpen={setSavePreviewOpen}
                        record={record}
                        setRecord={setRecord}
                    />
                </Pagewrapper>
            </React.Fragment>
    )
}
