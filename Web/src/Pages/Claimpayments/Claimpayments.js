import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from 'semantic-ui-react'
import { Breadcrumb, Grid, GridColumn } from 'semantic-ui-react'
import { DataTable, Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings } from '../../Components'
import GetInitialconfig from '../../Utils/GetInitialconfig'
import validator from '../../Utils/Validator'
import { Formatfulldate } from '../../Utils/Formatdate'
import { CLAIMPAYMENT_TYPE_BHKS, CLAIMPAYMENT_TYPE_KYS, CLAIMPAYMENT_TYPE_PATIENT, CLAIMPAYMENT_TYPE_PERSONEL } from '../../Utils/Constants'

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
            { Header: t('Pages.Claimpayments.Column.Type'), accessor: row => this.typeCellhandler(row?.Type) },
            { Header: t('Pages.Claimpayments.Column.Totaldaycount'), accessor: 'Totaldaycount' },
            { Header: t('Pages.Claimpayments.Column.Totalcalculatedpayment'), accessor: 'Totalcalculatedpayment' },
            { Header: t('Pages.Claimpayments.Column.Totalcalculatedkdv'), accessor: 'Totalcalculatedkdv' },
            { Header: t('Pages.Claimpayments.Column.Totalcalculatedfinal'), accessor: 'Totalcalculatedfinal' },
            { Header: t('Pages.Claimpayments.Column.Totalcalculatedwithholding'), accessor: 'Totalcalculatedwithholding' },
            { Header: t('Pages.Claimpayments.Column.Isapproved'), accessor: row => this.boolCellhandler(row?.Isapproved) },
            { Header: t('Pages.Claimpayments.Column.Approveduser'), accessor: 'Approveduser' },
            { Header: t('Pages.Claimpayments.Column.Approvetime'), accessor: row => this.dateCellhandler(row?.Approvetime) },
            { Header: t('Pages.Claimpayments.Column.Starttime'), accessor: row => this.dateCellhandler(row?.Starttime) },
            { Header: t('Pages.Claimpayments.Column.Endtime'), accessor: row => this.dateCellhandler(row?.Endtime) },
            { Header: t('Common.Column.Createduser'), accessor: 'Createduser' },
            { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser' },
            { Header: t('Common.Column.Createtime'), accessor: 'Createtime' },
            { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime' },
            { Header: t('Common.Column.approve'), accessor: 'approve', disableProps: true },
            { Header: t('Common.Column.edit'), accessor: 'edit', disableProps: true },
            { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true, }
        ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

        const metaKey = "claimpayment"
        let initialConfig = GetInitialconfig(Profile, metaKey)

        const list = (Claimpayments.list || []).filter(u => u.Isactive).map(item => {
            return {
                ...item,
                edit: item.Isapproved ? <Icon size='large' color='black' name='minus' /> : <Link to={`/Claimpayments/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
                delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
                    handleSelectedClaimpayment(item)
                    handleDeletemodal(true)
                }} />,
                approve: item.Isapproved ? <Icon size='large' color='black' name='minus' /> : <Icon link size='large' color='red' name='hand pointer' onClick={() => {
                    handleSelectedClaimpayment(item)
                    handleApprovemodal(true)
                }} />,
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
                        {list.length > 0 ?
                            <div className='w-full mx-auto '>
                                {Profile.Ismobile ?
                                    <MobileTable Columns={Columns} Data={list} Config={initialConfig} Profile={Profile} /> :
                                    <DataTable Columns={Columns} Data={list} Config={initialConfig} />}
                            </div> : <NoDataScreen message={t('Common.NoDataFound')} />
                        }
                    </Pagewrapper>
                </React.Fragment>
        )
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