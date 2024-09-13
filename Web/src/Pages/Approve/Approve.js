import React, { useEffect, useState } from 'react'
import { DataTable, Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper } from '../../Components'
import { Breadcrumb, Confirm, Grid, GridColumn, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import GetInitialconfig from '../../Utils/GetInitialconfig'
import validator from '../../Utils/Validator'
import Formatdate, { Formatfulldate } from '../../Utils/Formatdate'
import { STOCK_TYPE_PATIENT, STOCK_TYPE_PURCHASEORDER } from '../../Utils/Constants'

export default function Approve(props) {

    const { GetStocks, GetUsers, GetStockmovements, GetPurchaseorders, GetWarehouses, GetPatients, GetStockdefines, GetCases, GetFiles, GetUsagetypes, GetStocktypes, GetUnits, GetPatientdefines } = props
    const { ApproveStockmovements, ApprovePatients } = props
    const { Stocks, Stockmovements, Warehouses, Purchaseorders, Stockdefines, Stocktypes, Units, Cases, Usagetypes, Files, Users, Patients, Patientdefines, Profile } = props

    const t = Profile?.i18n?.t

    const [confirmopen, setConfirmopen] = useState(false)
    const [record, setRecord] = useState(null)

    useEffect(() => {
        GetStocks()
        GetStockmovements()
        GetPatients()
        GetCases()
        GetFiles()
        GetStockdefines()
        GetPurchaseorders()
        GetUsers()
        GetUsagetypes()
        GetWarehouses()
        GetStocktypes()
        GetUnits()
        GetPatientdefines()
    }, [])

    const isLoading =
        Stocks.isLoading ||
        Stockmovements.isLoading ||
        Stockdefines.isLoading ||
        Stocktypes.isLoading ||
        Units.isLoading ||
        Warehouses.isLoading ||
        Cases.isLoading ||
        Purchaseorders.isLoading ||
        Usagetypes.isLoading ||
        Users.isLoading ||
        Files.isLoading ||
        Patients.isLoading ||
        Patientdefines.isLoading

    const createStockmovement = () => {
        return (Stockmovements.list || []).filter(u => u.Isactive && !u.Isapproved).map(stockmovement => {
            const stock = (Stocks.list || []).find(u => u.Uuid === stockmovement?.StockID)
            const stockdefine = (Stockdefines.list || []).find(u => u.Uuid === stock?.StockdefineID)
            const stocktype = (Stocktypes.list || []).find(u => u.Uuid === stockdefine?.StocktypeID)
            const Isbarcodeneed = stocktype?.Isbarcodeneed
            const Issktneed = stocktype?.Issktneed
            const unit = (Units.list || []).find(u => u.Uuid === stockdefine?.UnitID)
            const createduser = (Users.list || []).find(u => u.Uuid === validator.isUUID(stockmovement?.Updateduser) ? stockmovement?.Updateduser : stockmovement?.Createduser)

            const type = stock?.Type
            let parent = null

            switch (type) {
                case STOCK_TYPE_PURCHASEORDER:
                    const purchaseorder = (Purchaseorders.list || []).find(u => u.Uuid === stock?.WarehouseID)
                    if (purchaseorder) {
                        parent = `${t('Pages.Stockmovements.Messages.Purchaseorder')} ${purchaseorder?.Purchaseno}`
                    }
                    break;
                case STOCK_TYPE_PATIENT:
                    const patient = (Patients.list || []).find(u => u.Uuid === stock?.WarehouseID)
                    const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)
                    if (patientdefine) {
                        parent = `${t('Pages.Stockmovements.Messages.Patient')} ${patientdefine?.Firstname} ${patientdefine?.Lastname} - (${patientdefine?.CountryID})`
                    }
                    break;
                default:
                    const warehouse = (Warehouses.list || []).find(u => u.Uuid === stock?.WarehouseID)
                    if (warehouse) {
                        parent = `${t('Pages.Stockmovements.Messages.Warehouse')} ${warehouse?.Name}`
                    }
                    break;
            }

            const stockName = `${parent ? `${parent} - ` : ''}${stockmovement.Amount} ${unit?.Name} ${stockdefine?.Name}${Isbarcodeneed ? ` (${stockdefine?.Barcode})` : ''} ${Issktneed ? ` - ${validator.isISODate(stock?.Skt) ? `${Formatdate(stock?.Skt, true)} Skt` : ''}` : ''}`

            const createDate = validator.isISODate(stockmovement?.Updatetime)
                ? Formatfulldate(stockmovement?.Updatetime, true)
                : Formatfulldate(stockmovement?.Createtime, true)

            return ({
                Name: stockName,
                Parent: t('Pages.Stockmovements.Page.Header'),
                Createdate: createDate,
                Createuser: createduser?.Username || t('Common.NoDataFound'),
                Approve: <Icon link size='large' color='red' name='hand pointer' onClick={() => {
                    setRecord({
                        type: 'stockmovement',
                        item: stockmovement,
                        name: stockName
                    })
                    setConfirmopen(true)
                }} />,
                Approvefunction: ApproveStockmovements,
                Detail: <Link to={`/Stockmovements`} ><Icon size='large' color='red' className='row-edit' name='address book' /> </Link>,
            })
        });
    }

    const createPreregistrationlist = () => {
        return (Patients.list || []).filter(u => u.Isactive && u.Ischecked && !u.Isapproved && u.Ispreregistration).map(patient => {

            const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)
            const patientName = `${patientdefine?.Firstname} ${patientdefine?.Lastname} - (${patientdefine?.CountryID})`
            const createduser = (Users.list || []).find(u => u.Uuid === validator.isUUID(patient?.Updateduser) ? patient?.Updateduser : patient?.Createduser)
            const createDate = validator.isISODate(patient?.Updatetime)
                ? Formatfulldate(patient?.Updatetime, true)
                : Formatfulldate(patient?.Createtime, true)

            return ({
                Name: patientdefine ? patientName : '',
                Parent: t('Pages.Preregistrations.Page.Header'),
                Createdate: createDate,
                Createuser: createduser?.Username || t('Common.NoDataFound'),
                Approve: <Icon link size='large' color='red' name='hand pointer' onClick={() => {
                    setRecord({
                        type: 'preregistration',
                        item: patient,
                        name: patientName
                    })
                    setConfirmopen(true)
                }} />,
                Approvefunction: ApprovePatients,
                Detail: <Link to={`/Preregistrations`} ><Icon size='large' color='red' className='row-edit' name='address book' /> </Link>,
            })
        })
    }

    const createList = () => {
        let list = [];
        list = list.concat(createStockmovement())
        list = list.concat(createPreregistrationlist())
        return list
    }

    const metaKey = "approve"
    let initialConfig = GetInitialconfig(Profile, metaKey)

    const colProps = {
        sortable: true,
        canGroupBy: true,
        canFilter: true
    }

    const Columns = [
        { Header: t('Pages.Approve.Column.Parent'), accessor: 'Parent', Title: true },
        { Header: t('Pages.Approve.Column.Name'), accessor: 'Name' },
        { Header: t('Pages.Approve.Column.Createdate'), accessor: 'Createdate' },
        { Header: t('Pages.Approve.Column.Createuser'), accessor: 'Createuser' },
        { Header: t('Pages.Approve.Column.Detail'), accessor: 'Detail', disableProps: true },
        { Header: t('Pages.Approve.Column.Approve'), accessor: 'Approve', disableProps: true },
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const list = createList()

    return (
        isLoading ? <LoadingPage /> :
            <React.Fragment>
                <Pagewrapper>
                    <Headerwrapper>
                        <Grid columns='2' >
                            <GridColumn width={8}>
                                <Breadcrumb size='big'>
                                    <Link to={"/Approve"}>
                                        <Breadcrumb.Section>{t('Pages.Approve.Page.Header')}</Breadcrumb.Section>
                                    </Link>
                                </Breadcrumb>
                            </GridColumn>
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
                <Confirmapprove
                    open={confirmopen}
                    setOpen={setConfirmopen}
                    record={record}
                    setRecord={setRecord}
                />
            </React.Fragment>
    )
}

function Confirmapprove(props) {

    const { open, setOpen, record, setRecord } = props

    return (
        <Confirm
            open={open}
            header='This is a custom header'
            onCancel={() => {
                setOpen(false)
            }}
            onConfirm={() => {
                setOpen(true)
            }}
        />
    )
}

