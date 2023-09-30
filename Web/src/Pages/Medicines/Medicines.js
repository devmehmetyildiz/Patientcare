import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Loader } from 'semantic-ui-react'
import { Breadcrumb, Button, Grid, GridColumn } from 'semantic-ui-react'
import ColumnChooser from '../../Containers/Utils/ColumnChooser'
import DataTable from '../../Utils/DataTable'
import LoadingPage from '../../Utils/LoadingPage'
import NoDataScreen from '../../Utils/NoDataScreen'
import Notification from '../../Utils/Notification'
import Literals from './Literals'
import Pagedivider from '../../Common/Styled/Pagedivider'
import Pagewrapper from '../../Common/Wrappers/Pagewrapper'
import Headerwrapper from '../../Common/Wrappers/Headerwrapper'
import StocksDelete from '../../Containers/Stocks/StocksDelete'

export default class Medicines extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      openDeactivate: false,
      selectedrecord: {}
    }
  }

  componentDidMount() {
    const { GetStocks, GetStockdefines, GetDepartments, GetStockmovements, GetWarehouses } = this.props
    GetStocks()
    GetStockdefines()
    GetDepartments()
    GetStockmovements()
    GetWarehouses()
  }

  componentDidUpdate() {
    const { Stocks, Warehouses, removeWarehousenotification, removeStocknotification, Departments, Stockdefines, Stockmovements, removeStockdefinenotification, removeDepartmentnotification, removeStockmovementnotification } = this.props
    Notification(Stocks.notifications, removeStocknotification)
    Notification(Stockdefines.notifications, removeStockdefinenotification)
    Notification(Departments.notifications, removeDepartmentnotification)
    Notification(Stockmovements.notifications, removeStockmovementnotification)
    Notification(Warehouses.notifications, removeWarehousenotification)
  }


  render() {


    const { Stocks, Profile, handleDeletemodal, handleSelectedStock } = this.props
    const { isLoading, isDispatching } = Stocks

    const Columns = [
      { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Uuid[Profile.Language], accessor: 'Uuid', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.Warehouse[Profile.Language], accessor: 'WarehouseID', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.warehouseCellhandler(col) },
      { Header: Literals.Columns.Stockdefine[Profile.Language], accessor: 'StockdefineID', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.stockdefineCellhandler(col) },
      { Header: Literals.Columns.Department[Profile.Language], accessor: 'DepartmentID', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.departmentCellhandler(col) },
      { Header: Literals.Columns.Skt[Profile.Language], accessor: 'Skt', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.Barcodeno[Profile.Language], accessor: 'Barcodeno', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.Amount[Profile.Language], accessor: 'Amount', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.amountCellhandler(col) },
      { Header: Literals.Columns.Info[Profile.Language], accessor: 'Info', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.Source[Profile.Language], accessor: 'Source', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.Createduser[Profile.Language], accessor: 'Createduser', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Updateduser[Profile.Language], accessor: 'Updateduser', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Createtime[Profile.Language], accessor: 'Createtime', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Updatetime[Profile.Language], accessor: 'Updatetime', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.watch[Profile.Language], accessor: 'watch', canGroupBy: false, canFilter: false, disableFilters: true, sortable: false, className: 'text-center action-column' },
      { Header: Literals.Columns.edit[Profile.Language], accessor: 'edit', canGroupBy: false, canFilter: false, disableFilters: true, sortable: false, className: 'text-center action-column' },
      { Header: Literals.Columns.delete[Profile.Language], accessor: 'delete', canGroupBy: false, canFilter: false, disableFilters: true, sortable: false, className: 'text-center action-column' }]

    const metaKey = "Medicines"
    let tableMeta = (Profile.tablemeta || []).find(u => u.Meta === metaKey)
    const initialConfig = {
      hiddenColumns: tableMeta ? JSON.parse(tableMeta.Config).filter(u => u.isVisible === false).map(item => {
        return item.key
      }) : ["Uuid", "Createduser", "Updateduser", "Createtime", "Updatetime"],
      columnOrder: tableMeta ? JSON.parse(tableMeta.Config).sort((a, b) => a.order - b.order).map(item => {
        return item.key
      }) : [],
      groupBy: tableMeta ? JSON.parse(tableMeta.Config).filter(u => u.isGroup === true).map(item => {
        return item.key
      }) : [],
    };

    const list = (Stocks.list || []).filter(u => u.Isactive && u.Ismedicines).map(item => {
      return {
        ...item,
        watch: <Link to={`/Medicinemovement/${item.Uuid}`} ><Icon link size='large' className='text-[#7ec5bf] hover:text-[#5bbdb5]' name='sitemap' /></Link>,
        kill: <Icon link size='large' className='text-[#c5a47e] hover:text-[#ca975c]' name='bomb' onClick={() => { this.setState({ selectedrecord: item, openDeactivate: true }) }} />,
        edit: <Link to={`/Medicines/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
        delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
          handleSelectedStock(item)
          handleDeletemodal(true)
        }} />
      }
    })

    return (
      isLoading || isDispatching ? <LoadingPage /> :
        <React.Fragment>
          <Pagewrapper>
            <Headerwrapper>
              <Grid columns='2' >
                <GridColumn width={8} className="">
                  <Breadcrumb size='big'>
                    <Link to={"/Medicines"}>
                      <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <GridColumn width={8} >
                  <Link to={"/Medicines/Create"}>
                    <Button color='blue' floated='right' className='list-right-green-button'>
                      {Literals.Page.Pagecreateheader[Profile.Language]}
                    </Button>
                  </Link>
                  <ColumnChooser meta={Profile.tablemeta} columns={Columns} metaKey={metaKey} />
                </GridColumn>
              </Grid>
            </Headerwrapper>
            <Pagedivider />
            {list.length > 0 ?
              <div className='w-full mx-auto '>
                <DataTable Columns={Columns} Data={list} Config={initialConfig} />
              </div> : <NoDataScreen message={Literals.Messages.Nodatafind[Profile.Language]} />
            }
          </Pagewrapper>
          <StocksDelete />
        </React.Fragment>
    )
  }

  stockdefineCellhandler = (col) => {
    const { Stockdefines } = this.props
    if (Stockdefines.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return (Stockdefines.list || []).find(u => u.Uuid === col.value)?.Name
    }
  }
  warehouseCellhandler = (col) => {
    const { Warehouses } = this.props
    if (Warehouses.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return (Warehouses.list || []).find(u => u.Uuid === col.value)?.Name
    }
  }

  departmentCellhandler = (col) => {
    const { Departments } = this.props
    if (Departments.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return (Departments.list || []).find(u => u.Uuid === col.value)?.Name
    }
  }

  amountCellhandler = (col) => {
    const { Stockmovements, Stocks } = this.props
    if (Stockmovements.isLoading || Stocks.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const selectedStock = (Stocks.list || []).find(u => u.Id === col.row.original.Id)
      let amount = 0.0;
      let movements = (Stockmovements.list || []).filter(u => u.StockID === selectedStock.Uuid && u.Isactive)
      movements.forEach(movement => {
        amount += (movement.Amount * movement.Movementtype);
      });
      return amount
    }
  }
}