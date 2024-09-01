import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Breadcrumb, Grid, GridColumn, Loader } from 'semantic-ui-react'
import Literals from './Literals'
import { Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings, DataTable } from '../../Components'
import StockmovementsDelete from '../../Containers/Stockmovements/StockmovementsDelete'
import StockmovementsApprove from '../../Containers/Stockmovements/StockmovementsApprove'
import { MOVEMENTTYPES, getInitialconfig } from '../../Utils/Constants'
import { Formatfulldate } from '../../Utils/Formatdate'
export default class Stockmovements extends Component {

  componentDidMount() {
    const { GetStockmovements, GetStocks, GetUnits, GetStockdefines, GetStocktypes } = this.props
    GetStockmovements()
    GetStockdefines()
    GetStocks()
    GetUnits()
    GetStocktypes()
  }

  render() {

    const { Stockmovements, Profile, handleDeletemodal, handleSelectedStockmovement, handleApprovemodal } = this.props
    const { isLoading } = Stockmovements

    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    const Columns = [
      { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id', },
      { Header: Literals.Columns.Uuid[Profile.Language], accessor: 'Uuid', },
      { Header: Literals.Columns.Stockdefine[Profile.Language], accessor: row => this.stockCellhandler(row?.StockID), Title: true },
      { Header: Literals.Columns.Movementdate[Profile.Language], accessor: row => this.dateCellhandler(row?.Movementdate), Subtitle: true },
      { Header: Literals.Columns.Movementtype[Profile.Language], accessor: row => this.movementCellhandler(row?.Movementtype), Lowtitle: true, Withtext: true },
      { Header: Literals.Columns.Amount[Profile.Language], accessor: row => this.amountCellhandler(row), Lowtitle: true, Withtext: true },
      { Header: Literals.Columns.Isapproved[Profile.Language], accessor: row => this.boolCellhandler(row?.Isapproved) },
      { Header: Literals.Columns.Createduser[Profile.Language], accessor: 'Createduser', },
      { Header: Literals.Columns.Updateduser[Profile.Language], accessor: 'Updateduser', },
      { Header: Literals.Columns.Createtime[Profile.Language], accessor: 'Createtime', },
      { Header: Literals.Columns.Updatetime[Profile.Language], accessor: 'Updatetime', },
      { Header: Literals.Columns.watch[Profile.Language], accessor: 'watch', disableProps: true },
      { Header: Literals.Columns.approve[Profile.Language], accessor: 'approve', disableProps: true },
      { Header: Literals.Columns.edit[Profile.Language], accessor: 'edit', disableProps: true },
      { Header: Literals.Columns.delete[Profile.Language], accessor: 'delete', disableProps: true }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const metaKey = "stockmovement"
    let initialConfig = getInitialconfig(Profile, metaKey)

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
                      <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <Settings
                  Profile={Profile}
                  Pagecreateheader={Literals.Page.Pagecreateheader[Profile.Language]}
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
              </div> : <NoDataScreen message={Literals.Messages.Nodatafind[Profile.Language]} />
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
    return value !== null && (value ? Literals.Messages.Yes[Profile.Language] : Literals.Messages.No[Profile.Language])
  }

}