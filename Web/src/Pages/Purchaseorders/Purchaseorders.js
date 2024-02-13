import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Icon, Loader, Grid, GridColumn } from 'semantic-ui-react'
import Literals from './Literals'
import { Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings } from '../../Components'
import PurchaseordersList from './PurchaseordersList'
import PurchaseordersDelete from '../../Containers/Purchaseorders/PurchaseordersDelete'
import PurchaseordersComplete from '../../Containers/Purchaseorders/PurcaseordersComplete'
import { getInitialconfig } from '../../Utils/Constants'

export default class Purchaseorders extends Component {

  constructor(props) {
    super(props)
    this.state = {
      expandedRow: []
    }
  }

  componentDidMount() {
    const { GetUsers, GetWarehouses, GetPurchaseorders, GetPurchaseorderstocks, GetStockdefines, GetDepartments, GetPurchaseorderstockmovements, GetCases
    } = this.props
    GetWarehouses()
    GetPurchaseorders()
    GetPurchaseorderstocks()
    GetStockdefines()
    GetDepartments()
    GetPurchaseorderstockmovements()
    GetCases()
    GetUsers()
  }

  render() {

    const { Purchaseorders, Profile, handleCompletemodal, handleDeletemodal, handleSelectedPurchaseorder,
      Departments, Stockdefines, Purchaseorderstocks, Purchaseorderstockmovements } = this.props
    const { isLoading, isDispatching } = Purchaseorders

    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    const Columns = [
      { Header: '', id: 'expander', accessor: 'expander', Cell: col => this.expandCellhandler(col), disableProps: true, disableMobile: true },
      { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id' },
      { Header: Literals.Columns.Uuid[Profile.Language], accessor: 'Uuid' },
      { Header: Literals.Columns.Warehouse[Profile.Language], accessor: row => this.warehouseCellhandler(row?.WarehouseID) },
      { Header: Literals.Columns.Company[Profile.Language], accessor: 'Company', Subtitle: true },
      { Header: Literals.Columns.Purchasenumber[Profile.Language], accessor: 'Purchasenumber', Title: true },
      { Header: Literals.Columns.RecievedUserID[Profile.Language], accessor: row => this.userCellhandler(row?.RecievedUserID) },
      { Header: Literals.Columns.Companypersonelname[Profile.Language], accessor: 'Companypersonelname', },
      { Header: Literals.Columns.Username[Profile.Language], accessor: 'Username' },
      { Header: Literals.Columns.Purchasedate[Profile.Language], accessor: row => this.dateCellhandler(row?.Purchasedate), Lowtitle: true, Withtext: true },
      { Header: Literals.Columns.CaseName[Profile.Language], accessor: row => this.caseCellhandler(row?.CaseID), Lowtitle: true, Withtext: true },
      { Header: Literals.Columns.Createduser[Profile.Language], accessor: 'Createduser' },
      { Header: Literals.Columns.Updateduser[Profile.Language], accessor: 'Updateduser' },
      { Header: Literals.Columns.Createtime[Profile.Language], accessor: 'Createtime' },
      { Header: Literals.Columns.Updatetime[Profile.Language], accessor: 'Updatetime' },
      { Header: Literals.Columns.complete[Profile.Language], accessor: 'complete', disableProps: true },
      { Header: Literals.Columns.edit[Profile.Language], accessor: 'edit', disableProps: true },
      { Header: Literals.Columns.delete[Profile.Language], accessor: 'delete', disableProps: true }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })


    const metaKey = "Purchaseorders"
    let initialConfig = getInitialconfig(Profile, metaKey)

    const list = (Purchaseorders.list || []).filter(u => u.Isactive).map(item => {
      return {
        ...item,
        complete: item.Iscompleted ? <Icon size='large' color='black' name='minus' /> : <Icon link size='large' color='red' name='check square' onClick={() => {
          handleSelectedPurchaseorder(item)
          handleCompletemodal(true)
        }} />,
        edit: item.Iscompleted ? <Icon size='large' color='black' name='minus' /> : <Link to={`/Purchaseorders/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
        delete: item.Iscompleted ? <Icon size='large' color='black' name='minus' /> : <Icon link size='large' color='red' name='alternate trash' onClick={() => {
          handleSelectedPurchaseorder(item)
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
                    <Link to={"/Purchaseorders"}>
                      <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <Settings
                  Profile={Profile}
                  Pagecreateheader={Literals.Page.Pagecreateheader[Profile.Language]}
                  Pagecreatelink={"/Purchaseorders/Create"}
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
                  <PurchaseordersList
                    Data={list}
                    Columns={Columns}
                    initialConfig={initialConfig}
                    Profile={Profile}
                    Departments={Departments}
                    Stockdefines={Stockdefines}
                    Purchaseorderstocks={Purchaseorderstocks}
                    Purchaseorderstockmovements={Purchaseorderstockmovements}
                  />
                }
              </div> : <NoDataScreen message={Literals.Messages.Nodatafind[Profile.Language]} />
            }
          </Pagewrapper>
          <PurchaseordersDelete />
          <PurchaseordersComplete />
        </React.Fragment >
    )
  }


  caseCellhandler = (value) => {
    const { Cases } = this.props
    if (Cases.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return (Cases.list || []).find(u => u.Uuid === value)?.Name
    }
  }

  userCellhandler = (value) => {
    const { Users } = this.props
    if (Users.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const user = (Users.list || []).find(u => u.Uuid === value)
      return `${user?.Name} ${user?.Surname} (${user?.Username})`
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

  dateCellhandler = (value) => {
    if (value) {
      return value.split('T').length > 0 ? value.split('T')[0] : value
    }
    return null
  }

  expandCellhandler = (col) => {
    const { Profile } = this.props
    return (!Profile.Ismobile && col?.row) && <span {...col?.row?.getToggleRowExpandedProps()}>
      {col?.row?.isExpanded ? <Icon name='triangle down' /> : <Icon name='triangle right' />}
    </span>
  }
}