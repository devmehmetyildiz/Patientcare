import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Breadcrumb, Grid, GridColumn, Loader } from 'semantic-ui-react'
import Literals from './Literals'
import { Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings } from '../../Components'
import WarehousesList from './WarehousesList'
import WarehousesDelete from '../../Containers/Warehouses/WarehousesDelete'
import GetInitialconfig from '../../Utils/GetInitialconfig'

export default class Warehouses extends Component {

  componentDidMount() {
    const { GetWarehouses, GetUnits, GetStockdefines, GetStockmovements, GetStocks, GetStocktypegroups } = this.props
    GetUnits()
    GetStockdefines()
    GetStockmovements()
    GetWarehouses()
    GetStocks()
    GetStocktypegroups()
  }

  render() {
    const { Warehouses,  Units, Stocks, Stockmovements, Stockdefines, handleDeletemodal, handleSelectedWarehouse, Profile } = this.props
    const { isLoading } = Warehouses

    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    const Columns = [
      { Header: '', id: 'expander', accessor: 'expander', Cell: col => this.expandCellhandler(col), disableProps: true, disableMobile: true },
      { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id', },
      { Header: Literals.Columns.Uuid[Profile.Language], accessor: 'Uuid', },
      { Header: Literals.Columns.Name[Profile.Language], accessor: 'Name', Title: true },
      { Header: Literals.Columns.Info[Profile.Language], accessor: 'Info', },
      { Header: Literals.Columns.Createduser[Profile.Language], accessor: 'Createduser', },
      { Header: Literals.Columns.Updateduser[Profile.Language], accessor: 'Updateduser', },
      { Header: Literals.Columns.Createtime[Profile.Language], accessor: 'Createtime', },
      { Header: Literals.Columns.Updatetime[Profile.Language], accessor: 'Updatetime', },
      { Header: Literals.Columns.edit[Profile.Language], accessor: 'edit', disableProps: true },
      { Header: Literals.Columns.delete[Profile.Language], accessor: 'delete', disableProps: true }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const metaKey = "warehouse"
    let initialConfig = GetInitialconfig(Profile, metaKey)

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
      isLoading ? <LoadingPage /> :
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
                {Profile.Ismobile ?
                  <MobileTable Columns={Columns} Data={list} Config={initialConfig} Profile={Profile} /> :
                  <WarehousesList
                    Data={list}
                    Columns={Columns}
                    initialConfig={initialConfig}
                    Profile={Profile}
                    Units={Units}
                    Stockmovements={Stockmovements}
                    Stockdefines={Stockdefines}
                    Stocks={Stocks}
                  />
                }
              </div> : <NoDataScreen message={Literals.Messages.Nodatafind[Profile.Language]} />
            }
          </Pagewrapper>
          <WarehousesDelete />
        </React.Fragment>
    )
  }

  boolCellhandler = (value) => {
    const { Profile } = this.props
    return value !== null && (value ? Literals.Messages.Yes[Profile.Language] : Literals.Messages.No[Profile.Language])
  }

  expandCellhandler = (col) => {
    const { Profile } = this.props
    return (!Profile.Ismobile && col?.row) && <span {...col?.row?.getToggleRowExpandedProps()}>
      {col?.row?.isExpanded ? <Icon name='triangle down' /> : <Icon name='triangle right' />}
    </span>
  }
}