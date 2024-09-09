import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Breadcrumb, Grid, GridColumn, Loader } from 'semantic-ui-react'
import { Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings, DataTable } from '../../Components'
import StockmovementsDelete from '../../Containers/Stockmovements/StockmovementsDelete'
import StockmovementsApprove from '../../Containers/Stockmovements/StockmovementsApprove'
import { MOVEMENTTYPES, STOCK_TYPE_PATIENT, STOCK_TYPE_PURCHASEORDER, STOCK_TYPE_WAREHOUSE } from '../../Utils/Constants'
import { Formatfulldate } from '../../Utils/Formatdate'
import GetInitialconfig from '../../Utils/GetInitialconfig'
export default class Stockmovements extends Component {

  componentDidMount() {
    const { GetStockmovements, GetStocks, GetUnits, GetStockdefines, GetStocktypes,
      GetWarehouses, GetPatients, GetPatientdefines, GetPurchaseorders } = this.props
    GetStockmovements()
    GetStockdefines()
    GetStocks()
    GetUnits()
    GetStocktypes()
    GetWarehouses()
    GetPatients()
    GetPatientdefines()
    GetPurchaseorders()
  }

  render() {

    const { Stockmovements, Profile, handleDeletemodal, handleSelectedStockmovement, handleApprovemodal } = this.props
    const t = Profile?.i18n?.t

    const { isLoading } = Stockmovements

    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    const Columns = [
      { Header: t('Common.Column.Id'), accessor: 'Id', },
      { Header: t('Common.Column.Uuid'), accessor: 'Uuid', },
      { Header: t('Pages.Stockmovements.Column.Parent'), accessor: row => this.parentCellhandler(row?.StockID), Title: true },
      { Header: t('Pages.Stockmovements.Column.Stockdefine'), accessor: row => this.stockCellhandler(row?.StockID), Title: true },
      { Header: t('Pages.Stockmovements.Column.Movementdate'), accessor: row => this.dateCellhandler(row?.Movementdate), Subtitle: true },
      { Header: t('Pages.Stockmovements.Column.Movementtype'), accessor: row => this.movementCellhandler(row?.Movementtype), Lowtitle: true, Withtext: true },
      { Header: t('Pages.Stockmovements.Column.Amount'), accessor: row => this.amountCellhandler(row), Lowtitle: true, Withtext: true },
      { Header: t('Pages.Stockmovements.Column.Isapproved'), accessor: row => this.boolCellhandler(row?.Isapproved) },
      { Header: t('Common.Column.Createduser'), accessor: 'Createduser', },
      { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser', },
      { Header: t('Common.Column.Createtime'), accessor: 'Createtime', },
      { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime', },
      { Header: t('Common.Column.watch'), accessor: 'watch', disableProps: true },
      { Header: t('Common.Column.approve'), accessor: 'approve', disableProps: true },
      { Header: t('Common.Column.edit'), accessor: 'edit', disableProps: true },
      { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const metaKey = "stockmovement"
    let initialConfig = GetInitialconfig(Profile, metaKey)

    const list = (Stockmovements.list || []).filter(u => u.Isactive).map(item => {
      return {
        ...item,
        watch: <Link to={`/Stockmovements/${item.Uuid}`} ><Icon link size='large' className='text-[#7ec5bf] hover:text-[#5bbdb5]' name='sitemap' /></Link>,
        edit: item.Isapproved ? <Icon size='large' color='black' name='minus' /> : <Link to={`/Stockmovements/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
        approve: item.Isapproved ? <Icon size='large' color='black' name='minus' /> : <Icon link size='large' color='red' name='hand pointer' onClick={() => {
          handleSelectedStockmovement(item)
          handleApprovemodal(true)
        }} />,
        delete: item.Isapproved ? <Icon size='large' color='black' name='minus' /> : <Icon link size='large' color='red' name='alternate trash' onClick={() => {
          handleSelectedStockmovement(item)
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
                    <Link to={"/Stockmovements"}>
                      <Breadcrumb.Section>{t('Pages.Stockmovements.Page.Header')}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <Settings
                  Profile={Profile}
                  Pagecreateheader={t('Pages.Stockmovements.Page.CreateHeader')}
                  Pagecreatelink={"/Stockmovements/Create"}
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
          <StockmovementsDelete />
          <StockmovementsApprove />
        </React.Fragment>
    )
  }

  amountCellhandler = (row) => {
    const { Stockmovements, Stocks, Stockdefines, Units } = this.props
    if (Stocks.isLoading || Stockdefines.isLoading || Units.isLoading || Stockmovements.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const stockmovement = (Stockmovements.list || []).find(u => u.Id === row?.Id)
      const stock = (Stocks.list || []).find(u => u.Uuid === stockmovement?.StockID)
      const stockdefine = (Stockdefines.list || []).find(u => u.Uuid === stock?.StockdefineID)
      const unit = (Units.list || []).find(u => u.Uuid === stockdefine?.UnitID)
      return <p>{`${row.Amount || ''}  ${unit?.Name || ''}`}</p>
    }
  }
  prevamountCellhandler = (row) => {
    const { Stockmovements, Stocks, Stockdefines, Units } = this.props
    if (Stocks.isLoading || Stockdefines.isLoading || Units.isLoading || Stockmovements.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const stockmovement = (Stockmovements.list || []).find(u => u.Id === row?.Id)
      const stock = (Stocks.list || []).find(u => u.Uuid === stockmovement?.StockID)
      const stockdefine = (Stockdefines.list || []).find(u => u.Uuid === stock?.StockdefineID)
      const unit = (Units.list || []).find(u => u.Uuid === stockdefine?.UnitID)
      return <p>{`${row?.Prevvalue || ''}  ${unit?.Name || ''}`}</p>
    }
  }
  newamountCellhandler = (row) => {
    const { Stockmovements, Stocks, Stockdefines, Units } = this.props
    if (Stocks.isLoading || Stockdefines.isLoading || Units.isLoading || Stockmovements.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const stockmovement = (Stockmovements.list || []).find(u => u.Id === row?.Id)
      const stock = (Stocks.list || []).find(u => u.Uuid === stockmovement?.StockID)
      const stockdefine = (Stockdefines.list || []).find(u => u.Uuid === stock?.StockdefineID)
      const unit = (Units.list || []).find(u => u.Uuid === stockdefine?.UnitID)
      return <p>{`${row?.Newvalue || ''}  ${unit?.Name || ''}`}</p>
    }
  }

  stockCellhandler = (value) => {
    const { Stocks, Stockdefines, Stocktypes } = this.props
    if (Stocks.isLoading || Stockdefines.isLoading || Stocktypes.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const stock = (Stocks.list || []).find(u => u.Uuid === value)
      const stockdefine = (Stockdefines.list || []).find(u => u.Uuid === stock?.StockdefineID)
      const stocktype = (Stocktypes.list || []).find(u => u.Uuid === stockdefine?.StocktypeID)


      return `${stockdefine?.Name} ${stocktype?.Isbarcodeneed ? ` (${stockdefine?.Barcode})` : ''}`
    }
  }

  parentCellhandler = (value) => {
    const { Purchaseorders, Patients, Patientdefines, Warehouses, Stocks, Profile } = this.props
    const t = Profile?.i18n?.t
    if (Purchaseorders.isLoading || Patients.isLoading || Patientdefines.isLoading || Stocks.isLoading || Warehouses.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const stock = (Stocks.list || []).find(u => u.Uuid === value)
      const type = stock?.Type
      let response = null

      switch (type) {
        case STOCK_TYPE_PURCHASEORDER:
          const purchaseorder = (Purchaseorders.list || []).find(u => u.Uuid === stock?.WarehouseID)
          if (purchaseorder) {
            response = `${t('Pages.Stockmovements.Messages.Purchaseorder')} ${purchaseorder?.Purchaseno}`
          }
          break;
        case STOCK_TYPE_PATIENT:
          const patient = (Patients.list || []).find(u => u.Uuid === stock?.WarehouseID)
          const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)
          if (patientdefine) {
            response = `${t('Pages.Stockmovements.Messages.Patient')} ${patientdefine?.Firstname} ${patientdefine?.Lastname} - (${patientdefine?.CountryID})`
          }
          break;
        default:
          const warehouse = (Warehouses.list || []).find(u => u.Uuid === stock?.WarehouseID)
          if (warehouse) {
            response = `${t('Pages.Stockmovements.Messages.Warehouse')} ${warehouse?.Name}`
          }
          break;
      }

      return response
        ? response
        : t('Common.NoDataFound')
    }
  }

  dateCellhandler = (value) => {
    if (value) {
      return Formatfulldate(value, true)
    }
    return value
  }

  movementCellhandler = (value) => {
    return MOVEMENTTYPES.find(u => u.value === value) ? MOVEMENTTYPES.find(u => u.value === value).Name : value
  }

  boolCellhandler = (value) => {
    const { Profile } = this.props
    const t = Profile?.i18n?.t
    return value !== null && (value ? t('Common.Yes') : t('Common.No'))
  }

}