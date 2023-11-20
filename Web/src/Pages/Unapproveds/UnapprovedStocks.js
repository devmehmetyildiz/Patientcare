import React, { Component } from 'react'
import Pagewrapper from '../../Common/Wrappers/Pagewrapper'
import Contentwrapper from '../../Common/Wrappers/Contentwrapper'
import Headerwrapper from '../../Common/Wrappers/Headerwrapper'
import { Breadcrumb, Grid, Icon, Loader, Tab } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import Settings from '../../Common/Settings'
import Pagedivider from '../../Common/Styled/Pagedivider'
import Literals from './Literals'
import NoDataScreen from '../../Utils/NoDataScreen'
import { MOVEMENTTYPES, getInitialconfig } from '../../Utils/Constants'
import DataTable from '../../Utils/DataTable'
import MobileTable from '../../Utils/MobileTable'

export default class UnapprovedStocks extends Component {

  componentDidMount() {

    const {
      GetPatientstocks,
      GetStocks,
      GetPurchaseorderstocks,
      GetPatients,
      GetPatientdefines,
      GetPatientstockmovements,
      GetPurchaseorders,
      GetPurchaseorderstockmovements,
      GetStockmovements,
      GetDepartments,
      GetStockdefines,
      GetUnits
    } = this.props

    GetPatientstocks()
    GetStocks()
    GetPurchaseorderstocks()
    GetPatients()
    GetPatientdefines()
    GetPatientstockmovements()
    GetPurchaseorders()
    GetPurchaseorderstockmovements()
    GetStockmovements()
    GetDepartments()
    GetStockdefines()
    GetUnits()
  }



  render() {

    const { Profile, Purchaseorderstocks, Stocks, Patientstocks } = this.props

    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    const purchaseordermedicinesupplyColumns = [
      { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id' },
      { Header: Literals.Columns.Purchaseorder[Profile.Language], accessor: 'PurchaseorderID', Cell: col => this.purchaseorderCellhandler(col) },
      { Header: Literals.Columns.Uuid[Profile.Language], accessor: 'Uuid', },
      { Header: Literals.Columns.Stockdefine[Profile.Language], accessor: 'StockdefineID', Firstheader: true, Cell: col => this.stockdefineCellhandler(col) },
      { Header: Literals.Columns.Department[Profile.Language], accessor: 'DepartmentID', Subheader: true, Cell: col => this.departmentCellhandler(col) },
      { Header: Literals.Columns.Skt[Profile.Language], accessor: 'Skt', Cell: col => this.dateCellhandler(col) },
      { Header: Literals.Columns.Barcodeno[Profile.Language], accessor: 'Barcodeno', },
      { Header: Literals.Columns.Amount[Profile.Language], accessor: 'Amount', Finalheader: true, Cell: col => this.amountCellhandler(col) },
      { Header: Literals.Columns.Info[Profile.Language], accessor: 'Info', },
      { Header: Literals.Columns.Isredprescription[Profile.Language], accessor: 'Isredprescription', Cell: col => this.boolCellhandler(col) },
      { Header: Literals.Columns.Isapproved[Profile.Language], accessor: 'Isapproved', Cell: col => this.boolCellhandler(col) },
      { Header: Literals.Columns.Createduser[Profile.Language], accessor: 'Createduser' },
      { Header: Literals.Columns.Updateduser[Profile.Language], accessor: 'Updateduser' },
      { Header: Literals.Columns.Createtime[Profile.Language], accessor: 'Createtime' },
      { Header: Literals.Columns.Updatetime[Profile.Language], accessor: 'Updatetime' },
      { Header: Literals.Columns.approve[Profile.Language], accessor: 'approve', disableFilters: true, disableProps: true },
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const purchaseorderstockColumns = [
      { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id', },
      { Header: Literals.Columns.Purchaseorder[Profile.Language], accessor: 'PurchaseorderID', Cell: col => this.purchaseorderCellhandler(col) },
      { Header: Literals.Columns.Uuid[Profile.Language], accessor: 'Uuid', },
      { Header: Literals.Columns.Stockdefine[Profile.Language], accessor: 'StockdefineID', Firstheader: true, Cell: col => this.stockdefineCellhandler(col) },
      { Header: Literals.Columns.Department[Profile.Language], accessor: 'DepartmentID', Subheader: true, Cell: col => this.departmentCellhandler(col) },
      { Header: Literals.Columns.Amount[Profile.Language], accessor: 'Amount', Finalheader: true, Cell: col => this.amountCellhandler(col) },
      { Header: Literals.Columns.Info[Profile.Language], accessor: 'Info', },
      { Header: Literals.Columns.Isapproved[Profile.Language], accessor: 'Isapproved', Cell: col => this.boolCellhandler(col) },
      { Header: Literals.Columns.Createduser[Profile.Language], accessor: 'Createduser', },
      { Header: Literals.Columns.Updateduser[Profile.Language], accessor: 'Updateduser', },
      { Header: Literals.Columns.Createtime[Profile.Language], accessor: 'Createtime', },
      { Header: Literals.Columns.Updatetime[Profile.Language], accessor: 'Updatetime', },
      { Header: Literals.Columns.approve[Profile.Language], accessor: 'approve', disableFilters: true, disableProps: true },
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const patientmedicinesupplyColumns = [
      { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id', },
      { Header: Literals.Columns.Patient[Profile.Language], accessor: 'PatientID', Cell: col => this.patientCellhandler(col) },
      { Header: Literals.Columns.Uuid[Profile.Language], accessor: 'Uuid', },
      { Header: Literals.Columns.Stockdefine[Profile.Language], accessor: 'StockdefineID', Cell: col => this.stockdefineCellhandler(col) },
      { Header: Literals.Columns.Department[Profile.Language], accessor: 'DepartmentID', Cell: col => this.departmentCellhandler(col) },
      { Header: Literals.Columns.Skt[Profile.Language], accessor: 'Skt', Cell: col => this.dateCellhandler(col) },
      { Header: Literals.Columns.Barcodeno[Profile.Language], accessor: 'Barcodeno', },
      { Header: Literals.Columns.Amount[Profile.Language], accessor: 'Amount', Cell: col => this.amountCellhandler(col) },
      { Header: Literals.Columns.Info[Profile.Language], accessor: 'Info', },
      { Header: Literals.Columns.Isredprescription[Profile.Language], accessor: 'Isredprescription', Cell: col => this.boolCellhandler(col) },
      { Header: Literals.Columns.Isapproved[Profile.Language], accessor: 'Isapproved', Cell: col => this.boolCellhandler(col) },
      { Header: Literals.Columns.Createduser[Profile.Language], accessor: 'Createduser' },
      { Header: Literals.Columns.Updateduser[Profile.Language], accessor: 'Updateduser' },
      { Header: Literals.Columns.Createtime[Profile.Language], accessor: 'Createtime' },
      { Header: Literals.Columns.Updatetime[Profile.Language], accessor: 'Updatetime' },
      { Header: Literals.Columns.approve[Profile.Language], accessor: 'approve', disableFilters: true, disableProps: true },
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const patientstockColumns = [
      { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id', },
      { Header: Literals.Columns.Patient[Profile.Language], accessor: 'PatientID', Cell: col => this.patientCellhandler(col) },
      { Header: Literals.Columns.Uuid[Profile.Language], accessor: 'Uuid', },
      { Header: Literals.Columns.Stockdefine[Profile.Language], accessor: 'StockdefineID', Firstheader: true, Cell: col => this.stockdefineCellhandler(col) },
      { Header: Literals.Columns.Department[Profile.Language], accessor: 'DepartmentID', Subheader: true, Cell: col => this.departmentCellhandler(col) },
      { Header: Literals.Columns.Amount[Profile.Language], accessor: 'Amount', Finalheader: true, Cell: col => this.amountCellhandler(col) },
      { Header: Literals.Columns.Info[Profile.Language], accessor: 'Info' },
      { Header: Literals.Columns.Isapproved[Profile.Language], accessor: 'Isapproved', Cell: col => this.boolCellhandler(col) },
      { Header: Literals.Columns.Createduser[Profile.Language], accessor: 'Createduser' },
      { Header: Literals.Columns.Updateduser[Profile.Language], accessor: 'Updateduser' },
      { Header: Literals.Columns.Createtime[Profile.Language], accessor: 'Createtime' },
      { Header: Literals.Columns.Updatetime[Profile.Language], accessor: 'Updatetime' },
      { Header: Literals.Columns.approve[Profile.Language], accessor: 'approve', disableFilters: true, disableProps: true },
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const stockColumns = [
      { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id' },
      { Header: Literals.Columns.Uuid[Profile.Language], accessor: 'Uuid' },
      { Header: Literals.Columns.Warehouse[Profile.Language], accessor: 'WarehouseID', Cell: col => this.warehouseCellhandler(col) },
      { Header: Literals.Columns.Stockdefine[Profile.Language], accessor: 'StockdefineID', Firstheader: true, Cell: col => this.stockdefineCellhandler(col) },
      { Header: Literals.Columns.Department[Profile.Language], accessor: 'DepartmentID', Subheader: true, Cell: col => this.departmentCellhandler(col) },
      { Header: Literals.Columns.Amount[Profile.Language], accessor: 'Amount', Finalheader: true, Cell: col => this.amountCellhandler(col) },
      { Header: Literals.Columns.Info[Profile.Language], accessor: 'Info' },
      { Header: Literals.Columns.Isapproved[Profile.Language], accessor: 'Isapproved', Cell: col => this.boolCellhandler(col) },
      { Header: Literals.Columns.Createduser[Profile.Language], accessor: 'Createduser' },
      { Header: Literals.Columns.Updateduser[Profile.Language], accessor: 'Updateduser' },
      { Header: Literals.Columns.Createtime[Profile.Language], accessor: 'Createtime' },
      { Header: Literals.Columns.Updatetime[Profile.Language], accessor: 'Updatetime' },
      { Header: Literals.Columns.approve[Profile.Language], accessor: 'approve', disableFilters: true, disableProps: true },
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const medicinesupplyColumns = [
      { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id', },
      { Header: Literals.Columns.Uuid[Profile.Language], accessor: 'Uuid', },
      { Header: Literals.Columns.Warehouse[Profile.Language], accessor: 'WarehouseID', Cell: col => this.warehouseCellhandler(col) },
      { Header: Literals.Columns.Stockdefine[Profile.Language], accessor: 'StockdefineID', Firstheader: true, Cell: col => this.stockdefineCellhandler(col) },
      { Header: Literals.Columns.Department[Profile.Language], accessor: 'DepartmentID', Subheader: true, Cell: col => this.departmentCellhandler(col) },
      { Header: Literals.Columns.Skt[Profile.Language], accessor: 'Skt', Cell: col => this.dateCellhandler(col) },
      { Header: Literals.Columns.Barcodeno[Profile.Language], accessor: 'Barcodeno', },
      { Header: Literals.Columns.Amount[Profile.Language], accessor: 'Amount', Finalheader: true, Cell: col => this.amountCellhandler(col) },
      { Header: Literals.Columns.Info[Profile.Language], accessor: 'Info', },
      { Header: Literals.Columns.Isredprescription[Profile.Language], accessor: 'Isredprescription', Cell: col => this.boolCellhandler(col) },
      { Header: Literals.Columns.Isapproved[Profile.Language], accessor: 'Isapproved', Cell: col => this.boolCellhandler(col) },
      { Header: Literals.Columns.Createduser[Profile.Language], accessor: 'Createduser' },
      { Header: Literals.Columns.Updateduser[Profile.Language], accessor: 'Updateduser' },
      { Header: Literals.Columns.Createtime[Profile.Language], accessor: 'Createtime' },
      { Header: Literals.Columns.Updatetime[Profile.Language], accessor: 'Updatetime' },
      { Header: Literals.Columns.approve[Profile.Language], accessor: 'approve', disableFilters: true, disableProps: true },
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const purchaseorderstocklist = (Purchaseorderstocks.list || []).filter(u => u.Isactive && !u.Isapproved && !u.Iscompleted).map(item => {
      return {
        ...item,
        approve: item.Isapproved ? <Icon size='large' color='black' name='minus' /> : <Icon link size='large' color='red' name='hand pointer' onClick={() => {
        }} />,
      }
    })

    const patientstocklist = (Patientstocks.list || []).filter(u => u.Isactive && !u.Isapproved).map(item => {
      return {
        ...item,
        approve: item.Iscompleted ? <Icon size='large' color='black' name='minus' /> : (item.Isapproved ? <Icon size='large' color='black' name='minus' /> : <Icon link size='large' color='red' name='hand pointer' onClick={() => {
        }} />),
      }
    })

    const stockslist = (Stocks.list || []).filter(u => u.Isactive && !u.Isapproved).map(item => {
      return {
        ...item,
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
                  menuItem: Literals.Page.Movement.PagePatientheader[Profile.Language],
                  pane: {
                    key: 'patient',
                    content: <React.Fragment>
                      {patientstockmovementlist.length > 0 ?
                        <div className='w-full mx-auto '>
                          {Profile.Ismobile ?
                            <MobileTable Columns={movementColumns} Data={patientstockmovementlist} Config={patientstockmovementInitialconfig} Profile={Profile} /> :
                            <DataTable Columns={movementColumns} Data={patientstockmovementlist} Config={patientstockmovementInitialconfig} />}
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
                            <MobileTable Columns={movementColumns} Data={purchaseorderstockmovementlist} Config={purchaseorderstockmovementInitialconfig} Profile={Profile} /> :
                            <DataTable Columns={movementColumns} Data={purchaseorderstockmovementlist} Config={purchaseorderstockmovementInitialconfig} />}
                        </div> : <NoDataScreen message={Literals.Messages.Nodatafind[Profile.Language]} style={{ height: 'auto' }} />
                      }
                    </React.Fragment>
                  }
                },
                {
                  menuItem: Literals.Page.Movement.PageStockheader[Profile.Language],
                  pane: {
                    key: 'stock',
                    content: <React.Fragment>
                      {stockmovementlist.length > 0 ?
                        <div className='w-full mx-auto '>
                          {Profile.Ismobile ?
                            <MobileTable Columns={movementColumns} Data={stockmovementlist} Config={stockmovementInitialconfig} Profile={Profile} /> :
                            <DataTable Columns={movementColumns} Data={stockmovementlist} Config={stockmovementInitialconfig} />}
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

  amountCellhandler = (col) => {
    const { Patientstockmovements, Patientstocks, Stockdefines, Units } = this.props
    if (Patientstocks.isLoading || Stockdefines.isLoading || Units.isLoading || Patientstockmovements.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const stockmovement = (Patientstockmovements.list || []).find(u => u.Id === col?.row?.original?.Id)
      const stock = (Patientstocks.list || []).find(u => u.Uuid === stockmovement?.StockID)
      const stockdefine = (Stockdefines.list || []).find(u => u.Uuid === stock?.StockdefineID)
      const unit = (Units.list || []).find(u => u.Uuid === stockdefine?.UnitID)
      return <p>{`${col.value || ''}  ${unit?.Name || ''}`}</p>
    }

  }

  stockCellhandler = (col) => {
    const { Patientstocks, Stockdefines } = this.props
    if (Patientstocks.isLoading || Stockdefines.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const stock = (Patientstocks.list || []).find(u => u.Uuid === col.value)
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
