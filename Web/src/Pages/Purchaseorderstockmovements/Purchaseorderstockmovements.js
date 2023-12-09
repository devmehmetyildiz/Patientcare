import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Breadcrumb, Grid, GridColumn, Loader } from 'semantic-ui-react'
import Literals from './Literals'
import { Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings, DataTable } from '../../Components'
import PurchaseorderstockmovementsDelete from '../../Containers/Purchaseorderstockmovements/PurchaseorderstockmovementsDelete'
import PurchaseorderstockmovementsApprove from '../../Containers/Purchaseorderstockmovements/PurchaseorderstockmovementsApprove'
import { MOVEMENTTYPES } from '../../Utils/Constants'

export default class Purchaseorderstockmovements extends Component {

  componentDidMount() {
    const { GetPurchaseorderstockmovements, GetUnits, GetStockdefines, GetPurchaseorderstocks } = this.props
    GetPurchaseorderstockmovements()
    GetUnits()
    GetStockdefines()
    GetPurchaseorderstocks()
  }

  render() {
    const { Purchaseorderstockmovements, Profile, handleSelectedPurchaseorderstockmovement, handleApprovemodal } = this.props
    const { isLoading, isDispatching } = Purchaseorderstockmovements

    const Columns = [
      { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Uuid[Profile.Language], accessor: 'Uuid', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Stockdefine[Profile.Language], accessor: 'StockID', sortable: true, canGroupBy: true, Firstheader: true, canFilter: true, Cell: col => this.stockCellhandler(col) },
      { Header: Literals.Columns.Movementdate[Profile.Language], accessor: 'Movementdate', sortable: true, canGroupBy: true, Subheader: true, canFilter: true, Cell: col => this.dateCellhandler(col) },
      { Header: Literals.Columns.Movementtype[Profile.Language], accessor: 'Movementtype', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.movementCellhandler(col) },
      { Header: Literals.Columns.Amount[Profile.Language], accessor: 'Amount', sortable: true, canGroupBy: true, Finalheader: true, canFilter: true, Cell: col => this.amountCellhandler(col) },
      { Header: Literals.Columns.Prevvalue[Profile.Language], accessor: 'Prevvalue', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.amountCellhandler(col) },
      { Header: Literals.Columns.Newvalue[Profile.Language], accessor: 'Newvalue', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.amountCellhandler(col) },
      { Header: Literals.Columns.Isapproved[Profile.Language], accessor: 'Isapproved', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.boolCellhandler(col) },
      { Header: Literals.Columns.Createduser[Profile.Language], accessor: 'Createduser', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Updateduser[Profile.Language], accessor: 'Updateduser', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Createtime[Profile.Language], accessor: 'Createtime', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Updatetime[Profile.Language], accessor: 'Updatetime', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.watch[Profile.Language], accessor: 'watch', canGroupBy: false, canFilter: false, disableFilters: true, sortable: false, className: 'text-center action-column' },
      { Header: Literals.Columns.approve[Profile.Language], accessor: 'approve', canGroupBy: false, canFilter: false, disableFilters: true, sortable: false, className: 'text-center action-column' },
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
        watch: item.Iscompleted ? <Icon size='large' color='black' name='minus' /> : <Link to={`/Purchaseorderstockmovements/${item.Uuid}`} ><Icon link size='large' className='text-[#7ec5bf] hover:text-[#5bbdb5]' name='sitemap' /></Link>,
        edit: item.Iscompleted ? <Icon size='large' color='black' name='minus' /> : <Link to={`/Purchaseorderstockmovements/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
        approve: item.Iscompleted ? <Icon size='large' color='black' name='minus' /> : (item.Isapproved ? <Icon size='large' color='black' name='minus' /> : <Icon link size='large' color='red' name='hand pointer' onClick={() => {
          handleSelectedPurchaseorderstockmovement(item)
          handleApprovemodal(true)
        }} />),
        delete: item.Iscompleted ? <Icon size='large' color='black' name='minus' /> : <Icon link size='large' color='red' name='alternate trash' onClick={() => {
          handleSelectedPurchaseorderstockmovement(item)
          handleApprovemodal(true)
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
                    <Link to={"/Purchaseorderstockmovements"}>
                      <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <Settings
                  Profile={Profile}
                  Pagecreateheader={Literals.Page.Pagecreateheader[Profile.Language]}
                  Pagecreatelink={"/Purchaseorderstockmovements/Create"}
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
          <PurchaseorderstockmovementsDelete />
          <PurchaseorderstockmovementsApprove />
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
      const stockmovement = (Purchaseorderstockmovements.list || []).find(u => u.Id === col?.row?.original?.Id)
      const stock = (Purchaseorderstocks.list || []).find(u => u.Uuid === stockmovement?.StockID)
      const stockdefine = (Stockdefines.list || []).find(u => u.Uuid === stock?.StockdefineID)
      const unit = (Units.list || []).find(u => u.Uuid === stockdefine?.UnitID)
      return <p>{`${col.value || ''}  ${unit?.Name || ''}`}</p>
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