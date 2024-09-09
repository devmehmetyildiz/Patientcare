import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Breadcrumb, Grid, GridColumn, Loader } from 'semantic-ui-react'
import Literals from './Literals'
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
    const { isLoading } = Stocks

    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    const Columns = [
      { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id' },
      { Header: Literals.Columns.Uuid[Profile.Language], accessor: 'Uuid' },
      { Header: Literals.Columns.Warehouse[Profile.Language], accessor: row => this.warehouseCellhandler(row?.WarehouseID), Lowtitle: true, Withtext: true },
      { Header: Literals.Columns.Stockdefine[Profile.Language], accessor: row => this.stockdefineCellhandler(row?.StockdefineID), Title: true },
      { Header: Literals.Columns.Stocktype[Profile.Language], accessor: row => this.stocktypeCellhandler(row?.StockdefineID), Title: true },
      { Header: Literals.Columns.Amount[Profile.Language], accessor: row => this.amountCellhandler(row), Subtitle: true, Withtext: true },
      { Header: Literals.Columns.Info[Profile.Language], accessor: 'Info' },
      { Header: Literals.Columns.Createduser[Profile.Language], accessor: 'Createduser' },
      { Header: Literals.Columns.Updateduser[Profile.Language], accessor: 'Updateduser' },
      { Header: Literals.Columns.Createtime[Profile.Language], accessor: 'Createtime' },
      { Header: Literals.Columns.Updatetime[Profile.Language], accessor: 'Updatetime' },
      { Header: Literals.Columns.change[Profile.Language], accessor: 'change', disableProps: true },
      { Header: Literals.Columns.approve[Profile.Language], accessor: 'approve', disableProps: true },
      { Header: Literals.Columns.edit[Profile.Language], accessor: 'edit', disableProps: true },
      { Header: Literals.Columns.delete[Profile.Language], accessor: 'delete', disableProps: true }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const metaKey = "stock"
    let initialConfig = GetInitialconfig(Profile, metaKey)

    const list = (Stocks.list || []).filter(u => u.Isactive  && u.Type === 0).map(item => {
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
                      <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <Settings
                  Profile={Profile}
                  Pagecreateheader={Literals.Page.Pagecreateheader[Profile.Language]}
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
              </div> : <NoDataScreen message={Literals.Messages.Nodatafind[Profile.Language]} />
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
    const { Stockdefines, Stocktypes } = this.props
    if (Stockdefines.isLoading || Stocktypes.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const stockdefine = (Stockdefines.list || []).find(u => u.Uuid === value)
      return (Stocktypes.list || []).find(u => u.Uuid === stockdefine?.StocktypeID)?.Name || 'tanımsız tür'
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
    const { Stockmovements, Stocks, Units, Stockdefines } = this.props
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
      return `${amount} ${unit?.Name || 'tanımsız birim'} ${amount !== fullamount ? `( Toplam ${fullamount} ${unit?.Name || 'tanımsız birim'})` : ''}`
    }
  }

  boolCellhandler = (value) => {
    const { Profile } = this.props
    return value !== null && (value ? Literals.Messages.Yes[Profile.Language] : Literals.Messages.No[Profile.Language])
  }
}