import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Loader, Breadcrumb, Grid, GridColumn } from 'semantic-ui-react'
import Literals from './Literals'
import MedicinesDelete from '../../Containers/Medicines/MedicinesDelete'
import MedicinesApprove from '../../Containers/Medicines/MedicinesApprove'
import { Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings, DataTable } from '../../Components'
import { getInitialconfig } from '../../Utils/Constants'

export default class Medicines extends Component {

  componentDidMount() {
    const { GetStocks, GetStockdefines, GetDepartments, GetStockmovements, GetWarehouses } = this.props
    GetStocks()
    GetStockdefines()
    GetDepartments()
    GetStockmovements()
    GetWarehouses()
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
      { Header: Literals.Columns.Department[Profile.Language], accessor: row => this.departmentCellhandler(row?.DepartmentID) },
      { Header: Literals.Columns.Skt[Profile.Language], accessor: row => this.dateCellhandler(row?.Skt) },
      { Header: Literals.Columns.Barcodeno[Profile.Language], accessor: 'Barcodeno' },
      { Header: Literals.Columns.Amount[Profile.Language], accessor: row => this.amountCellhandler(row), Subtitle: true, Withtext: true },
      { Header: Literals.Columns.Info[Profile.Language], accessor: 'Info' },
      { Header: Literals.Columns.Isredprescription[Profile.Language], accessor: row => this.boolCellhandler(row?.Isredprescription) },
      { Header: Literals.Columns.Isapproved[Profile.Language], accessor: row => this.boolCellhandler(row?.Isapproved) },
      { Header: Literals.Columns.Createduser[Profile.Language], accessor: 'Createduser' },
      { Header: Literals.Columns.Updateduser[Profile.Language], accessor: 'Updateduser' },
      { Header: Literals.Columns.Createtime[Profile.Language], accessor: 'Createtime' },
      { Header: Literals.Columns.Updatetime[Profile.Language], accessor: 'Updatetime' },
      { Header: Literals.Columns.change[Profile.Language], accessor: 'change', disableProps: true },
      { Header: Literals.Columns.approve[Profile.Language], accessor: 'approve', disableProps: true },
      { Header: Literals.Columns.edit[Profile.Language], accessor: 'edit', disableProps: true },
      { Header: Literals.Columns.delete[Profile.Language], accessor: 'delete', disableProps: true }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const metaKey = "medicine"
    let initialConfig = getInitialconfig(Profile, metaKey)

    const list = (Stocks.list || []).filter(u => u.Isactive && u.Ismedicine).map(item => {
      return {
        ...item,
        change: <Link to={`/Stockmovements/Create?StockID=${item.Uuid}`} ><Icon link size='large' className='text-[#7ec5bf] hover:text-[#5bbdb5]' name='sitemap' /></Link>,
        edit: <Link to={`/Medicines/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
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
                    <Link to={"/Medicines"}>
                      <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <Settings
                  Profile={Profile}
                  Pagecreateheader={Literals.Page.Pagecreateheader[Profile.Language]}
                  Pagecreatelink={"/Medicines/Create"}
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
          <MedicinesDelete />
          <MedicinesApprove />
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
  warehouseCellhandler = (value) => {
    const { Warehouses } = this.props
    if (Warehouses.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return (Warehouses.list || []).find(u => u.Uuid === value)?.Name
    }
  }

  departmentCellhandler = (value) => {
    const { Departments } = this.props
    if (Departments.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return (Departments.list || []).find(u => u.Uuid === value)?.Name
    }
  }

  amountCellhandler = (row) => {
    const { Stockmovements, Stocks } = this.props
    if (Stockmovements.isLoading || Stocks.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const selectedStock = (Stocks.list || []).find(u => u.Id === row?.Id)
      let amount = 0.0;
      let movements = (Stockmovements.list || []).filter(u => u.StockID === selectedStock?.Uuid && u.Isactive && u.Isapproved)
      movements.forEach(movement => {
        amount += (movement.Amount * movement.Movementtype);
      });
      return amount
    }
  }

  dateCellhandler = (value) => {
    if (value) {
      return value.split('T').length > 0 ? value.split('T')[0] : value
    }
    return null
  }

  boolCellhandler = (value) => {
    const { Profile } = this.props
    return value !== null && (value ? Literals.Messages.Yes[Profile.Language] : Literals.Messages.No[Profile.Language])
  }
}