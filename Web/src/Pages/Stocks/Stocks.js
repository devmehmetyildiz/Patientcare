import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Breadcrumb, Grid, GridColumn, Loader } from 'semantic-ui-react'
import { Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings, DataTable } from '../../Components'
import StocksDelete from '../../Containers/Stocks/StocksDelete'
import StocksApprove from '../../Containers/Stocks/StocksApprove'
import GetInitialconfig from '../../Utils/GetInitialconfig'
export default class Stocks extends Component {

  componentDidMount() {
    const { GetStocks, GetStockdefines, GetDepartments, GetStockmovements, GetWarehouses, GetUnits, GetStocktypes } = this.props
    GetStocks()
    GetStockdefines()
    GetDepartments()
    GetStockmovements()
    GetWarehouses()
    GetUnits()
    GetStocktypes()
  }

  render() {

    const { Stocks, Profile, handleDeletemodal, handleSelectedStock, handleApprovemodal } = this.props

    const t = Profile?.i18n?.t

    const { isLoading } = Stocks

    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    const Columns = [
      { Header: t('Common.Column.Id'), accessor: 'Id' },
      { Header: t('Common.Column.Uuid'), accessor: 'Uuid' },
      { Header: t('Pages.Stocks.Column.Warehouse'), accessor: row => this.warehouseCellhandler(row?.WarehouseID), Lowtitle: true, Withtext: true },
      { Header: t('Pages.Stocks.Column.Stockdefine'), accessor: row => this.stockdefineCellhandler(row?.StockdefineID), Title: true },
      { Header: t('Pages.Stocks.Column.Stocktype'), accessor: row => this.stocktypeCellhandler(row?.StockdefineID), Title: true },
      { Header: t('Pages.Stocks.Column.Amount'), accessor: row => this.amountCellhandler(row), Subtitle: true, Withtext: true },
      { Header: t('Pages.Stocks.Column.Info'), accessor: 'Info' },
      { Header: t('Common.Column.Createduser'), accessor: 'Createduser' },
      { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser' },
      { Header: t('Common.Column.Createtime'), accessor: 'Createtime' },
      { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime' },
      { Header: t('Common.Column.change'), accessor: 'edit', disableProps: true },
      { Header: t('Common.Column.approve'), accessor: 'edit', disableProps: true },
      { Header: t('Common.Column.edit'), accessor: 'edit', disableProps: true },
      { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true, }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const metaKey = "stock"
    let initialConfig = GetInitialconfig(Profile, metaKey)

    const list = (Stocks.list || []).filter(u => u.Isactive && u.Type === 0).map(item => {
      return {
        ...item,
        change: <Link to={`/Stockmovements/Create?StockID=${item.Uuid}`} ><Icon link size='large' className='text-[#7ec5bf] hover:text-[#5bbdb5]' name='sitemap' /></Link>,
        edit: <Link to={`/Stocks/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
        approve: item.Isapproved ? <Icon size='large' color='black' name='minus' /> : <Icon link size='large' color='red' name='hand pointer' onClick={() => {
          handleSelectedStock(item)
          handleApprovemodal(true)
        }} />,
        delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
          handleSelectedStock(item)
          handleDeletemodal(true)
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
                    <Link to={"/Stocks"}>
                      <Breadcrumb.Section>{t('Pages.Stocks.Page.Header')}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <Settings
                  Profile={Profile}
                  Pagecreateheader={t('Pages.Stocks.Page.CreateHeader')}
                  Pagecreatelink={"/Stocks/Create"}
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
          <StocksDelete />
          <StocksApprove />
        </React.Fragment>
    )
  }

  stockdefineCellhandler = (value) => {
    const { Stockdefines } = this.props
    if (Stockdefines.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return (Stockdefines.list || []).find(u => u.Uuid === value)?.Name
    }
  }
  stocktypeCellhandler = (value) => {
    const { Stockdefines, Stocktypes, Profile } = this.props
    const t = Profile?.i18n?.t
    if (Stockdefines.isLoading || Stocktypes.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const stockdefine = (Stockdefines.list || []).find(u => u.Uuid === value)
      return (Stocktypes.list || []).find(u => u.Uuid === stockdefine?.StocktypeID)?.Name || t('Common.NoDataFound')
    }
  }
  warehouseCellhandler = (value) => {
    const { Warehouses } = this.props
    if (Warehouses.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return (Warehouses.list || []).find(u => u.Uuid === value)?.Name
    }
  }

  amountCellhandler = (row) => {
    const { Stockmovements, Stocks, Units, Stockdefines, Profile } = this.props
    const t = Profile?.i18n?.t
    if (Stockmovements.isLoading || Stocks.isLoading || Units.isLoading || Stockdefines.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const selectedStock = (Stocks.list || []).find(u => u.Uuid === row?.Uuid)
      const stockdefine = (Stockdefines.list || []).find(u => u.Uuid === selectedStock?.StockdefineID)
      const unit = (Units.list || []).find(u => u.Uuid === stockdefine?.UnitID)
      let amount = 0.0;
      let fullamount = 0.0;
      let movements = (Stockmovements.list || []).filter(u => u.StockID === selectedStock?.Uuid && u.Isactive)
      movements.forEach(movement => {
        if (movement?.Isapproved) {
          amount += (movement.Amount * movement.Movementtype);
        }
        fullamount += (movement.Amount * movement.Movementtype);
      });
      return `${amount} ${unit?.Name || t('Common.NoDataFound')} ${amount !== fullamount ? `( ${t('Pages.Stocks.Label.Total')} ${fullamount} ${unit?.Name || t('Common.NoDataFound')})` : ''}`
    }
  }

  boolCellhandler = (value) => {
    const { Profile } = this.props
    const t = Profile?.i18n?.t
    return value !== null && (value ? t('Common.Yes') : t('Common.No'))
  }
}