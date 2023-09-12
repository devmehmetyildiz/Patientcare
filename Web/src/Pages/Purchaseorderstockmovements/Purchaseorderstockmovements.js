import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Divider, Icon, Loader, Modal } from 'semantic-ui-react'
import { Breadcrumb, Button, Grid, GridColumn, Header } from 'semantic-ui-react'
import ColumnChooser from '../../Containers/Utils/ColumnChooser'
import { MOVEMENTTYPES } from '../../Utils/Constants'
import DataTable from '../../Utils/DataTable'
import LoadingPage from '../../Utils/LoadingPage'
import NoDataScreen from '../../Utils/NoDataScreen'
import Notification from '../../Utils/Notification'
import Literals from './Literals'
import Pagewrapper from '../../Common/Wrappers/Pagewrapper'
import Headerwrapper from '../../Common/Wrappers/Headerwrapper'
import Pagedivider from '../../Common/Styled/Pagedivider'
import PurchaseorderstockmovementsDelete from '../../Containers/Purchaseorderstockmovements/PurchaseorderstockmovementsDelete'

export default class Purchaseorderstockmovements extends Component {

  constructor(props) {
    super(props)
    this.state = {
      open: false,
      selectedrecord: {}
    }
  }

  componentDidMount() {
    const { GetPurchaseorderstockmovements, GetUnits, GetStockdefines, GetPurchaseorderstocks } = this.props
    GetPurchaseorderstockmovements()
    GetUnits()
    GetStockdefines()
    GetPurchaseorderstocks()
  }

  componentDidUpdate() {
    const { Purchaseorderstockmovements, removePurchaseorderstockmovementnotification, Units, Stockdefines, Purchaseorderstocks,
      removeUnitnotification, removeStockdefinenotification, removePurchaseorderstocknotification } = this.props
    Notification(Purchaseorderstockmovements.notifications, removePurchaseorderstockmovementnotification)
    Notification(Units.notifications, removeUnitnotification)
    Notification(Stockdefines.notifications, removeStockdefinenotification)
    Notification(Purchaseorderstocks.notifications, removePurchaseorderstocknotification)
  }

  render() {
    const { Purchaseorderstockmovements, Profile, handleDeletemodal, handleSelectedPurchaseorderstockmovement } = this.props
    const { isLoading, isDispatching } = Purchaseorderstockmovements

    const Columns = [
      { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Uuid[Profile.Language], accessor: 'Uuid', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Stockdefine[Profile.Language], accessor: 'StockID', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.stockCellhandler(col) },
      { Header: Literals.Columns.Username[Profile.Language], accessor: 'Username', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.Movementdate[Profile.Language], accessor: 'Movementdate', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.Movementtype[Profile.Language], accessor: 'Movementtype', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.movementCellhandler(col) },
      { Header: Literals.Columns.Amount[Profile.Language], accessor: 'Amount', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.amountCellhandler(col) },
      { Header: Literals.Columns.Prevvalue[Profile.Language], accessor: 'Prevvalue', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.amountCellhandler(col) },
      { Header: Literals.Columns.Newvalue[Profile.Language], accessor: 'Newvalue', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.amountCellhandler(col) },
      { Header: Literals.Columns.Createduser[Profile.Language], accessor: 'Createduser', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Updateduser[Profile.Language], accessor: 'Updateduser', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Createtime[Profile.Language], accessor: 'Createtime', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Updatetime[Profile.Language], accessor: 'Updatetime', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.watch[Profile.Language], accessor: 'watch', canGroupBy: false, canFilter: false, disableFilters: true, sortable: false, className: 'text-center action-column' },
      { Header: Literals.Columns.edit[Profile.Language], accessor: 'edit', canGroupBy: false, canFilter: false, disableFilters: true, sortable: false, className: 'text-center action-column' },
      { Header: Literals.Columns.delete[Profile.Language], accessor: 'delete', canGroupBy: false, canFilter: false, disableFilters: true, sortable: false, className: 'text-center action-column' }]

    const metaKey = "Purchaseorderstockmovements"
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

    const list = (Purchaseorderstockmovements.list || []).filter(u => u.Isactive).map(item => {
      return {
        ...item,
        watch: <Link to={`/Purchaseorderstockmovements/${item.Uuid}`} ><Icon link size='large' className='text-[#7ec5bf] hover:text-[#5bbdb5]' name='sitemap' /></Link>,
        edit: <Link to={`/Purchaseorderstockmovements/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
        delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
          handleSelectedPurchaseorderstockmovement(item)
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
                    <Link to={"/Purchaseorderstockmovements"}>
                      <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <GridColumn width={8} >
                  <Link to={"/Purchaseorderstockmovements/Create"}>
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
          <PurchaseorderstockmovementsDelete />
        </React.Fragment>
    )
  }

  handleChangeModal = (value) => {
    this.setState({ modal: value })
  }

  amountCellhandler = (col) => {
    const { Purchaseorderstockmovements, Purchaseorderstocks, Stockdefines, Units } = this.props
    if (Purchaseorderstocks.isLoading || Stockdefines.isLoading || Units.isLoading || Purchaseorderstockmovements.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const stockmovement = (Purchaseorderstockmovements.list || []).find(u => u.Id === col.row.original.Id)
      const stock = (Purchaseorderstocks.list || []).find(u => u.Uuid === stockmovement?.StockID)
      const stockdefine = (Stockdefines.list || []).find(u => u.Uuid === stock?.StockdefineID)
      const unit = (Units.list || []).find(u => u.Uuid === stockdefine?.UnitID)
      return <p>{`${col.value}  ${unit?.Name}`}</p>
    }

  }

  stockCellhandler = (col) => {
    const { Purchaseorderstocks, Stockdefines } = this.props
    if (Purchaseorderstocks.isLoading || Stockdefines.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const stock = (Purchaseorderstocks.list || []).find(u => u.Uuid === col.value)
      const stockdefine = (Stockdefines.list || []).find(u => u.Uuid === stock?.StockdefineID)
      return stockdefine?.Name
    }

  }

  movementCellhandler = (col) => {
    return MOVEMENTTYPES.find(u => u.value === col.value) ? MOVEMENTTYPES.find(u => u.value === col.value).Name : col.value
  }

}