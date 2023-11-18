import React, { Component } from 'react'
import Pagewrapper from '../../Common/Wrappers/Pagewrapper'
import Contentwrapper from '../../Common/Wrappers/Contentwrapper'
import Headerwrapper from '../../Common/Wrappers/Headerwrapper'
import { Breadcrumb, Button, Checkbox, Grid, Icon, Loader, Tab } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import Settings from '../../Common/Settings'
import Pagedivider from '../../Common/Styled/Pagedivider'
import Literals from './Literals'
import NoDataScreen from '../../Utils/NoDataScreen'
import { MOVEMENTTYPES, getInitialconfig } from '../../Utils/Constants'
import DataTable from '../../Utils/DataTable'
import MobileTable from '../../Utils/MobileTable'
import ColumnChooser from '../../Containers/Utils/ColumnChooser'

export default class UnapprovedMovements extends Component {

  constructor(props) {
    super(props)
    this.state = {
      canFilterstocks: false,
      canFilterpurchaseorderstocks: false,
      canFilterpatientstocks: false,
      approveMultiplestocks: false,
      approveMultiplepurchaseorderstocks: false,
      approveMultiplepatientstocks: false,
      purchaseorders: [],
      patients: [],
      stocks: []
    }
  }

  componentDidMount() {
    const {
      GetPatientstockmovements,
      GetPatientstocks,
      GetStockmovements,
      GetStocks,
      GetPurchaseorderstockmovements,
      GetPurchaseorderstocks,
      GetStockdefines,
      GetUnits
    } = this.props

    GetPatientstockmovements()
    GetPatientstocks()
    GetStockmovements()
    GetStocks()
    GetPurchaseorderstockmovements()
    GetPurchaseorderstocks()
    GetStockdefines()
    GetUnits()
  }



  render() {

    const { Profile, Patientstockmovements,
      Stockmovements, Purchaseorderstockmovements } = this.props

    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    let purchaseorderstockmovementColumns = [
      { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id', },
      { Header: Literals.Columns.Uuid[Profile.Language], accessor: 'Uuid', },
      { Header: Literals.Columns.Stockdefine[Profile.Language], accessor: 'StockID', Firstheader: true, Cell: col => this.purchaseorderstockCellhandler(col) },
      { Header: Literals.Columns.Movementdate[Profile.Language], accessor: 'Movementdate', Subheader: true, Cell: col => this.dateCellhandler(col) },
      { Header: Literals.Columns.Movementtype[Profile.Language], accessor: 'Movementtype', Cell: col => this.movementCellhandler(col) },
      { Header: Literals.Columns.Amount[Profile.Language], accessor: 'Amount', Finalheader: true, Cell: col => this.purchaseorderstockamountCellhandler(col) },
      { Header: Literals.Columns.Prevvalue[Profile.Language], accessor: 'Prevvalue', Cell: col => this.purchaseorderstockamountCellhandler(col) },
      { Header: Literals.Columns.Newvalue[Profile.Language], accessor: 'Newvalue', Cell: col => this.purchaseorderstockamountCellhandler(col) },
      { Header: Literals.Columns.Isapproved[Profile.Language], accessor: 'Isapproved', Cell: col => this.boolCellhandler(col) },
      { Header: Literals.Columns.Createduser[Profile.Language], accessor: 'Createduser', },
      { Header: Literals.Columns.Updateduser[Profile.Language], accessor: 'Updateduser', },
      { Header: Literals.Columns.Createtime[Profile.Language], accessor: 'Createtime', },
      { Header: Literals.Columns.Updatetime[Profile.Language], accessor: 'Updatetime', },
      { Header: Literals.Columns.approve[Profile.Language], accessor: 'approve', disableFilters: true, disableProps: true },
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    let patientstockmovementColumns = [
      { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id', },
      { Header: Literals.Columns.Uuid[Profile.Language], accessor: 'Uuid', },
      { Header: Literals.Columns.Stockdefine[Profile.Language], accessor: 'StockID', Firstheader: true, Cell: col => this.patientstockCellhandler(col) },
      { Header: Literals.Columns.Movementdate[Profile.Language], accessor: 'Movementdate', Subheader: true, Cell: col => this.dateCellhandler(col) },
      { Header: Literals.Columns.Movementtype[Profile.Language], accessor: 'Movementtype', Cell: col => this.movementCellhandler(col) },
      { Header: Literals.Columns.Amount[Profile.Language], accessor: 'Amount', Finalheader: true, Cell: col => this.patientstockamountCellhandler(col) },
      { Header: Literals.Columns.Prevvalue[Profile.Language], accessor: 'Prevvalue', Cell: col => this.patientstockamountCellhandler(col) },
      { Header: Literals.Columns.Newvalue[Profile.Language], accessor: 'Newvalue', Cell: col => this.patientstockamountCellhandler(col) },
      { Header: Literals.Columns.Isapproved[Profile.Language], accessor: 'Isapproved', Cell: col => this.boolCellhandler(col) },
      { Header: Literals.Columns.Createduser[Profile.Language], accessor: 'Createduser', },
      { Header: Literals.Columns.Updateduser[Profile.Language], accessor: 'Updateduser', },
      { Header: Literals.Columns.Createtime[Profile.Language], accessor: 'Createtime', },
      { Header: Literals.Columns.Updatetime[Profile.Language], accessor: 'Updatetime', },
      { Header: Literals.Columns.approve[Profile.Language], accessor: 'approve', disableFilters: true, disableProps: true },
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    let movementColumns = [
      { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id' },
      { Header: Literals.Columns.Uuid[Profile.Language], accessor: 'Uuid', },
      { Header: Literals.Columns.Stockdefine[Profile.Language], accessor: 'StockID', Firstheader: true, Cell: col => this.stockCellhandler(col) },
      { Header: Literals.Columns.Movementdate[Profile.Language], accessor: 'Movementdate', Subheader: true, Cell: col => this.dateCellhandler(col) },
      { Header: Literals.Columns.Movementtype[Profile.Language], accessor: 'Movementtype', Cell: col => this.movementCellhandler(col) },
      { Header: Literals.Columns.Amount[Profile.Language], accessor: 'Amount', Finalheader: true, Cell: col => this.stockamountCellhandler(col) },
      { Header: Literals.Columns.Prevvalue[Profile.Language], accessor: 'Prevvalue', Cell: col => this.stockamountCellhandler(col) },
      { Header: Literals.Columns.Newvalue[Profile.Language], accessor: 'Newvalue', Cell: col => this.stockamountCellhandler(col) },
      { Header: Literals.Columns.Isapproved[Profile.Language], accessor: 'Isapproved', Cell: col => this.boolCellhandler(col) },
      { Header: Literals.Columns.Createduser[Profile.Language], accessor: 'Createduser', },
      { Header: Literals.Columns.Updateduser[Profile.Language], accessor: 'Updateduser', },
      { Header: Literals.Columns.Createtime[Profile.Language], accessor: 'Createtime', },
      { Header: Literals.Columns.Updatetime[Profile.Language], accessor: 'Updatetime', },
      { Header: Literals.Columns.approve[Profile.Language], accessor: 'approve', disableFilters: true, disableProps: true },
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    let multiselectColumn = { Header: "", accessor: 'Select', disableProps: true }

    if (this.state.canFilterstocks) {
      movementColumns.unshift(multiselectColumn)
      movementColumns.pop()
    }
    if (this.state.canFilterpurchaseorderstocks) {
      purchaseorderstockmovementColumns.unshift(multiselectColumn)
      purchaseorderstockmovementColumns.pop()
    }
    if (this.state.canFilterpatientstocks) {
      patientstockmovementColumns.unshift(multiselectColumn)
      patientstockmovementColumns.pop()
    }

    const stockmovementlist = (Stockmovements.list || []).filter(u => u.Isactive && !u.Isapproved).map(item => {
      return {
        ...item,
        Select: <Checkbox
          checked={this.state.stocks.find(u => u === item.Uuid) ? true : false}
          onClick={() => {
            const filter = this.state.stocks.find(u => u === item.Uuid)
            filter
              ? this.setState({ stocks: this.state.stocks.filter(u => u !== item.Uuid) })
              : this.setState({ stocks: [item.Uuid, ...this.state.stocks] })
          }
          } />,
        approve: item.Isapproved ? <Icon size='large' color='black' name='minus' /> : <Icon link size='large' color='red' name='hand pointer' onClick={() => {
        }} />,
      }
    })

    const purchaseorderstockmovementlist = (Purchaseorderstockmovements.list || []).filter(u => u.Isactive && !u.Isapproved && !u.Iscompleted).map(item => {
      return {
        ...item,
        Select: <Checkbox
          checked={this.state.purchaseorders.find(u => u === item.Uuid) ? true : false}
          onClick={() => {
            const filter = this.state.purchaseorders.find(u => u === item.Uuid)
            filter
              ? this.setState({ purchaseorders: this.state.purchaseorders.filter(u => u !== item.Uuid) })
              : this.setState({ purchaseorders: [item.Uuid, ...this.state.purchaseorders] })
          }
          } />,
        approve: item.Iscompleted ? <Icon size='large' color='black' name='minus' /> : (item.Isapproved ? <Icon size='large' color='black' name='minus' /> : <Icon link size='large' color='red' name='hand pointer' onClick={() => {
        }} />),
      }
    })

    const patientstockmovementlist = (Patientstockmovements.list || []).filter(u => u.Isactive && !u.Isapproved).map(item => {
      return {
        ...item,
        Select: <Checkbox
          checked={this.state.patients.find(u => u === item.Uuid) ? true : false}
          onClick={() => {
            const filter = this.state.patients.find(u => u === item.Uuid)
            filter
              ? this.setState({ patients: this.state.patients.filter(u => u !== item.Uuid) })
              : this.setState({ patients: [item.Uuid, ...this.state.patients] })
          }
          } />,
        approve: item.Isapproved ? <Icon size='large' color='black' name='minus' /> : <Icon link size='large' color='red' name='hand pointer' onClick={() => {
        }} />,
      }
    })

    const patientstockmovementMetaKey = "Patientstockmovements"
    let patientstockmovementInitialconfig = getInitialconfig(Profile, patientstockmovementMetaKey)

    const purchaseorderstockmovementMetaKey = "Purchaseorderstockmovements"
    let purchaseorderstockmovementInitialconfig = getInitialconfig(Profile, purchaseorderstockmovementMetaKey)

    const stockmovementMetaKey = "Stockmovements"
    let stockmovementInitialconfig = getInitialconfig(Profile, stockmovementMetaKey)

    return (
      <React.Fragment>
        <Pagewrapper>
          <Headerwrapper>
            <Grid columns='2' >
              <Grid.Column width={8}>
                <Breadcrumb size='big'>
                  <Link to={"/Unapprovedmovements"}>
                    <Breadcrumb.Section>{Literals.Page.Movement.Pageheader[Profile.Language]}</Breadcrumb.Section>
                  </Link>
                </Breadcrumb>
              </Grid.Column>
            </Grid>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Tab className='station-tab'
              panes={[
                {
                  menuItem: Literals.Page.Movement.PageStockheader[Profile.Language],
                  pane: {
                    key: 'stock',
                    content: <React.Fragment>
                      {stockmovementlist.length > 0 ?
                        <div className='w-full mx-auto '>
                          {Profile.Ismobile ?
                            <MobileTable Columns={movementColumns} Data={stockmovementlist} Config={stockmovementInitialconfig} Profile={Profile} /> :
                            <div className='flex flex-col w-full justify-center items-center gap-2'>
                              <div className='flex flex-row  justify-between items-center w-full'>
                                <Button size='mini' onClick={() => { this.setState({ canFilterstocks: !this.state.canFilterstocks }) }} >{this.state.canFilterstocks ? Literals.Columns.CanSelectclose[Profile.Language] : Literals.Columns.CanSelect[Profile.Language]}</Button>
                                {this.state.canFilterstocks && this.state.stocks.length > 0
                                  ? <Button size='mini' onClick={() => { this.setState({ approveMultiplestocks: true }) }} >{Literals.Columns.Multipleapprove[Profile.Language]}</Button>
                                  : null}
                              </div>
                              <DataTable Columns={movementColumns} Data={stockmovementlist} Config={stockmovementInitialconfig} />
                            </div>
                          }
                        </div> : <NoDataScreen message={Literals.Messages.Nodatafind[Profile.Language]} style={{ height: 'auto' }} />
                      }
                    </React.Fragment>
                  }
                },
                {
                  menuItem: Literals.Page.Movement.PagePatientheader[Profile.Language],
                  pane: {
                    key: 'patient',
                    content: <React.Fragment>
                      {patientstockmovementlist.length > 0 ?
                        <div className='w-full mx-auto '>
                          {Profile.Ismobile ?
                            <MobileTable Columns={patientstockmovementColumns} Data={patientstockmovementlist} Config={patientstockmovementInitialconfig} Profile={Profile} /> :
                            <div className='flex flex-col w-full justify-center items-center gap-2'>
                              <div className='flex flex-row  justify-between items-center w-full'>
                                <Button size='mini' onClick={() => { this.setState({ canFilterpatientstocks: !this.state.canFilterpatientstocks }) }} >{this.state.canFilterpatientstocks ? Literals.Columns.CanSelectclose[Profile.Language] : Literals.Columns.CanSelect[Profile.Language]}</Button>
                                {this.state.canFilterpatientstocks && this.state.patients.length > 0
                                  ? <Button size='mini' onClick={() => { this.setState({ approveMultiplepatientstocks: true }) }} >{Literals.Columns.Multipleapprove[Profile.Language]}</Button>
                                  : null}
                              </div>
                              <DataTable Columns={patientstockmovementColumns} Data={patientstockmovementlist} Config={patientstockmovementInitialconfig} />
                            </div>
                          }
                        </div> : <NoDataScreen message={Literals.Messages.Nodatafind[Profile.Language]} style={{ height: 'auto' }} />
                      }
                    </React.Fragment>
                  }
                },
                {
                  menuItem: Literals.Page.Movement.PagePurchaseorderheader[Profile.Language],
                  pane: {
                    key: 'purchaseorder',
                    content: <React.Fragment>
                      {purchaseorderstockmovementlist.length > 0 ?
                        <div className='w-full mx-auto '>
                          {Profile.Ismobile ?
                            <MobileTable Columns={purchaseorderstockmovementColumns} Data={purchaseorderstockmovementlist} Config={purchaseorderstockmovementInitialconfig} Profile={Profile} /> :
                            <div className='flex flex-col w-full justify-center items-center gap-2'>
                              <div className='flex flex-row  justify-between items-center w-full'>
                                <Button size='mini' onClick={() => { this.setState({ canFilterpurchaseorderstocks: !this.state.canFilterpurchaseorderstocks }) }} >{this.state.canFilterpurchaseorderstocks ? Literals.Columns.CanSelectclose[Profile.Language] : Literals.Columns.CanSelect[Profile.Language]}</Button>
                                {this.state.canFilterpurchaseorderstocks && this.state.purchaseorders.length > 0
                                  ? <Button size='mini' onClick={() => { this.setState({ approveMultiplepurchaseorderstocks: true }) }} >{Literals.Columns.Multipleapprove[Profile.Language]}</Button>
                                  : null}
                              </div>
                              <DataTable Columns={purchaseorderstockmovementColumns} Data={purchaseorderstockmovementlist} Config={purchaseorderstockmovementInitialconfig} />
                            </div>
                          }
                        </div> : <NoDataScreen message={Literals.Messages.Nodatafind[Profile.Language]} style={{ height: 'auto' }} />
                      }
                    </React.Fragment>
                  }
                },
              ]}
              renderActiveOnly={false} />
          </Contentwrapper>
        </Pagewrapper>
      </React.Fragment >
    )
  }

  patientstockamountCellhandler = (col) => {
    const { Patientstockmovements, Patientstocks, Stockdefines, Units } = this.props
    if (Patientstocks.isLoading || Stockdefines.isLoading || Units.isLoading || Patientstockmovements.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const stockmovement = (Patientstockmovements.list || []).find(u => u.Id === col?.row?.original?.Id)
      const stock = (Patientstocks.list || []).find(u => u.Uuid === stockmovement?.StockID)
      const stockdefine = (Stockdefines.list || []).find(u => u.Uuid === stock?.StockdefineID)
      const unit = (Units.list || []).filter(u => u.Isactive).find(u => u.Uuid === stockdefine?.UnitID)
      return <p>{`${col.value || ''}  ${unit?.Name || ''}`}</p>
    }
  }

  purchaseorderstockamountCellhandler = (col) => {
    const { Purchaseorderstockmovements, Purchaseorderstocks, Stockdefines, Units } = this.props
    if (Purchaseorderstocks.isLoading || Stockdefines.isLoading || Units.isLoading || Purchaseorderstockmovements.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const stockmovement = (Purchaseorderstockmovements.list || []).find(u => u.Id === col?.row?.original?.Id)
      const stock = (Purchaseorderstocks.list || []).find(u => u.Uuid === stockmovement?.StockID)
      const stockdefine = (Stockdefines.list || []).find(u => u.Uuid === stock?.StockdefineID)
      const unit = (Units.list || []).filter(u => u.Isactive).find(u => u.Uuid === stockdefine?.UnitID)
      return <p>{`${col.value || ''}  ${unit?.Name || ''}`}</p>
    }
  }

  stockamountCellhandler = (col) => {
    const { Stockmovements, Stocks, Stockdefines, Units } = this.props
    if (Stocks.isLoading || Stockdefines.isLoading || Units.isLoading || Stockmovements.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const stockmovement = (Stockmovements.list || []).find(u => u.Id === col?.row?.original?.Id)
      const stock = (Stocks.list || []).find(u => u.Uuid === stockmovement?.StockID)
      const stockdefine = (Stockdefines.list || []).find(u => u.Uuid === stock?.StockdefineID)
      const unit = (Units.list || []).filter(u => u.Isactive).find(u => u.Uuid === stockdefine?.UnitID)
      return <p>{`${col.value || ''}  ${unit?.Name || ''}`}</p>
    }
  }

  patientstockCellhandler = (col) => {
    const { Patientstocks, Stockdefines } = this.props
    if (Patientstocks.isLoading || Stockdefines.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const stock = (Patientstocks.list || []).find(u => u.Uuid === col.value)
      const stockdefine = (Stockdefines.list || []).find(u => u.Uuid === stock?.StockdefineID)
      return stockdefine?.Name
    }
  }

  purchaseorderstockCellhandler = (col) => {
    const { Purchaseorderstocks, Stockdefines } = this.props
    if (Purchaseorderstocks.isLoading || Stockdefines.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const stock = (Purchaseorderstocks.list || []).find(u => u.Uuid === col.value)
      const stockdefine = (Stockdefines.list || []).find(u => u.Uuid === stock?.StockdefineID)
      return stockdefine?.Name
    }
  }

  stockCellhandler = (col) => {
    const { Stocks, Stockdefines } = this.props
    if (Stocks.isLoading || Stockdefines.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const stock = (Stocks.list || []).find(u => u.Uuid === col.value)
      const stockdefine = (Stockdefines.list || []).find(u => u.Uuid === stock?.StockdefineID)
      return stockdefine?.Name
    }
  }

  dateCellhandler = (col) => {
    if (col.value) {
      return col.value.split('T').length > 0 ? col.value.split('T')[0] : col.value
    }
    return null
  }

  movementCellhandler = (col) => {
    return MOVEMENTTYPES.find(u => u.value === col.value) ? MOVEMENTTYPES.find(u => u.value === col.value).Name : col.value
  }

  boolCellhandler = (col) => {
    const { Profile } = this.props
    return col.value !== null && (col.value ? Literals.Messages.Yes[Profile.Language] : Literals.Messages.No[Profile.Language])
  }

}
