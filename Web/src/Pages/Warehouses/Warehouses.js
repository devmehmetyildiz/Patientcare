import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Divider, Icon, Modal } from 'semantic-ui-react'
import { Breadcrumb, Button, Grid, GridColumn, Header } from 'semantic-ui-react'
import LoadingPage from '../../Utils/LoadingPage'
import Notification from '../../Utils/Notification'
import NoDataScreen from '../../Utils/NoDataScreen'
import ColumnChooser from '../../Containers/Utils/ColumnChooser'
import WarehousesList from './WarehousesList'
import Literals from './Literals'
import Pagedivider from '../../Common/Styled/Pagedivider'
import Pagewrapper from '../../Common/Wrappers/Pagewrapper'
import Headerwrapper from '../../Common/Wrappers/Headerwrapper'
import WarehousesDelete from '../../Containers/Warehouses/WarehousesDelete'
import ExcelImport from '../../Containers/Utils/ExcelImport'
import ExcelExport from '../../Containers/Utils/ExcelExport'
import Settings from '../../Common/Settings'

export default class Warehouses extends Component {

  componentDidMount() {
    const { GetWarehouses, GetDepartments, GetUnits, GetStockdefines, GetStockmovements, GetStocks } = this.props
    GetDepartments()
    GetUnits()
    GetStockdefines()
    GetStockmovements()
    GetWarehouses()
    GetStocks()
  }

  render() {
    const { Warehouses, Departments, Units, Stocks, Stockmovements, Stockdefines, handleDeletemodal, handleSelectedWarehouse, Profile, AddRecordCases } = this.props
    const { isLoading, isDispatching } = Warehouses

    const Columns = [
      {
        Header: () => null,
        id: 'expander', accessor: 'expander', sortable: false, canGroupBy: false, canFilter: false, filterDisable: true, newWidht: '10px',
        Cell: ({ row }) => (
          <span {...row.getToggleRowExpandedProps()}>
            {row.isExpanded ? <Icon name='triangle down' /> : <Icon name='triangle right' />}
          </span>
        ),
      },
      { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Uuid[Profile.Language], accessor: 'Uuid', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Name[Profile.Language], accessor: 'Name', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.Info[Profile.Language], accessor: 'Info', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.Ismedicine[Profile.Language], accessor: 'Ismedicine', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.boolCellhandler(col) },
      { Header: Literals.Columns.Createduser[Profile.Language], accessor: 'Createduser', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Updateduser[Profile.Language], accessor: 'Updateduser', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Createtime[Profile.Language], accessor: 'Createtime', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Updatetime[Profile.Language], accessor: 'Updatetime', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.edit[Profile.Language], accessor: 'edit', canGroupBy: false, canFilter: false, disableFilters: true, sortable: false, className: 'text-center action-column' },
      { Header: Literals.Columns.delete[Profile.Language], accessor: 'delete', canGroupBy: false, canFilter: false, disableFilters: true, sortable: false, className: 'text-center action-column' }]

    const metaKey = "Warehouses"
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

    const list = (Warehouses.list || []).filter(u => u.Isactive).map(item => {
      return {
        ...item,
        edit: <Link to={`/Warehouses/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
        delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
          handleSelectedWarehouse(item)
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
                <GridColumn width={8}>
                  <Breadcrumb size='big'>
                    <Link to={"/Warehouses"}>
                      <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <Settings
                  Profile={Profile}
                  Pagecreateheader={Literals.Page.Pagecreateheader[Profile.Language]}
                  Pagecreatelink={"/Warehouses/Create"}
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
                <WarehousesList
                  Data={list}
                  Columns={Columns}
                  initialConfig={initialConfig}
                  Profile={Profile}
                  Departments={Departments}
                  Units={Units}
                  Stockmovements={Stockmovements}
                  Stockdefines={Stockdefines}
                  Stocks={Stocks}
                />
              </div> : <NoDataScreen message={Literals.Messages.Nodatafind[Profile.Language]} />
            }
          </Pagewrapper>
          <WarehousesDelete />
        </React.Fragment>
    )
  }

  boolCellhandler = (col) => {
    const { Profile } = this.props
    return col.value !== null && (col.value ? Literals.Messages.Yes[Profile.Language] : Literals.Messages.No[Profile.Language])
  }
}