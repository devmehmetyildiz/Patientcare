import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Divider, Icon, Loader, Modal } from 'semantic-ui-react'
import { Breadcrumb, Button, Grid, GridColumn, Header } from 'semantic-ui-react'
import ColumnChooser from '../../Containers/Utils/ColumnChooser'
import DataTable from '../../Utils/DataTable'
import LoadingPage from '../../Utils/LoadingPage'
import NoDataScreen from '../../Utils/NoDataScreen'
import Notification from '../../Utils/Notification'
import Literals from './Literals'
import Pagewrapper from '../../Common/Wrappers/Pagewrapper'
import Headerwrapper from '../../Common/Wrappers/Headerwrapper'
import Pagedivider from '../../Common/Styled/Pagedivider'
import PurchaseordersuppliesDelete from '../../Containers/Purchaseordersupplies/PurchaseordersuppliesDelete'
import PurchaseordersuppliesApprove from '../../Containers/Purchaseordersupplies/PurchaseordersuppliesApprove'
import MobileTable from '../../Utils/MobileTable'
import Settings from '../../Common/Settings'

export default class Purchaseordersupplies extends Component {

  componentDidMount() {
    const { GetPurchaseorderstocks, GetStockdefines, GetDepartments, GetPurchaseorderstockmovements, GetPurchaseorders } = this.props
    GetPurchaseorderstocks()
    GetStockdefines()
    GetDepartments()
    GetPurchaseorders()
    GetPurchaseorderstockmovements()
  }

  render() {

    const { Purchaseorderstocks, Profile, handleDeletemodal, handleSelectedPurchaseorderstock, handleApprovemodal } = this.props
    const { isLoading, isDispatching } = Purchaseorderstocks

    const Columns = [
      { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Purchaseorder[Profile.Language], accessor: 'PurchaseorderID', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.purchaseorderCellhandler(col) },
      { Header: Literals.Columns.Uuid[Profile.Language], accessor: 'Uuid', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Stockdefine[Profile.Language], accessor: 'StockdefineID', Firstheader: true, sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.stockdefineCellhandler(col) },
      { Header: Literals.Columns.Department[Profile.Language], accessor: 'DepartmentID', Subheader: true, sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.departmentCellhandler(col) },
      { Header: Literals.Columns.Skt[Profile.Language], accessor: 'Skt', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.dateCellhandler(col) },
      { Header: Literals.Columns.Barcodeno[Profile.Language], accessor: 'Barcodeno', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.Amount[Profile.Language], accessor: 'Amount', sortable: true, Finalheader: true, canGroupBy: true, canFilter: true, Cell: col => this.amountCellhandler(col) },
      { Header: Literals.Columns.Info[Profile.Language], accessor: 'Info', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.Isapproved[Profile.Language], accessor: 'Isapproved', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.boolCellhandler(col) },
      { Header: Literals.Columns.Createduser[Profile.Language], accessor: 'Createduser', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Updateduser[Profile.Language], accessor: 'Updateduser', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Createtime[Profile.Language], accessor: 'Createtime', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Updatetime[Profile.Language], accessor: 'Updatetime', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.change[Profile.Language], accessor: 'change', canGroupBy: false, canFilter: false, disableFilters: true, sortable: false, className: 'text-center action-column' },
      { Header: Literals.Columns.approve[Profile.Language], accessor: 'approve', canGroupBy: false, canFilter: false, disableFilters: true, sortable: false, className: 'text-center action-column' },
      { Header: Literals.Columns.edit[Profile.Language], accessor: 'edit', canGroupBy: false, canFilter: false, disableFilters: true, sortable: false, className: 'text-center action-column' },
      { Header: Literals.Columns.delete[Profile.Language], accessor: 'delete', canGroupBy: false, canFilter: false, disableFilters: true, sortable: false, className: 'text-center action-column' }]

    const metaKey = "Purchaseordersupplies"
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

    const list = (Purchaseorderstocks.list || []).filter(u => u.Isactive && !u.Ismedicine && u.Issupply).map(item => {
      return {
        ...item,
        change: item.Iscompleted ? <Icon size='large' color='black' name='minus' /> : <Link to={`/Purchaseorderstockmovements/Create?StockID=${item.Uuid}`} ><Icon link size='large' className='text-[#7ec5bf] hover:text-[#5bbdb5]' name='sitemap' /></Link>,
        edit: item.Iscompleted ? <Icon size='large' color='black' name='minus' /> : <Link to={`/Purchaseordersupplies/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
        approve: item.Iscompleted ? <Icon size='large' color='black' name='minus' /> : (item.Isapproved ? <Icon size='large' color='black' name='minus' /> : <Icon link size='large' color='red' name='hand pointer' onClick={() => {
          handleSelectedPurchaseorderstock(item)
          handleApprovemodal(true)
        }} />),
        delete: item.Iscompleted ? <Icon size='large' color='black' name='minus' /> : <Icon link size='large' color='red' name='alternate trash' onClick={() => {
          handleSelectedPurchaseorderstock(item)
          handleDeletemodal(true)
        }} />,
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
                    <Link to={"/Purchaseordersupplies"}>
                      <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <Settings
                  Profile={Profile}
                  Pagecreateheader={Literals.Page.Pagecreateheader[Profile.Language]}
                  Pagecreatelink={"/Purchaseordersupplies/Create"}
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
          <PurchaseordersuppliesDelete />
          <PurchaseordersuppliesApprove />
        </React.Fragment>
    )
  }

  handleChangeModal = (value) => {
    this.setState({ modal: value })
  }

  stockdefineCellhandler = (col) => {
    const { Stockdefines } = this.props
    if (Stockdefines.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return (Stockdefines.list || []).find(u => u.Uuid === col.value)?.Name
    }
  }
  purchaseorderCellhandler = (col) => {
    const { Purchaseorders } = this.props
    if (Purchaseorders.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return (Purchaseorders.list || []).find(u => u.Uuid === col.value)?.Purchasenumber
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
    const { Purchaseorderstockmovements, Purchaseorderstocks } = this.props
    if (Purchaseorderstockmovements.isLoading || Purchaseorderstocks.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const selectedStock = (Purchaseorderstocks.list || []).find(u => u.Id === col?.row?.original?.Id)
      let amount = 0.0;
      let movements = (Purchaseorderstockmovements.list || []).filter(u => u.StockID === selectedStock?.Uuid && u.Isactive && u.Isapproved)
      movements.forEach(movement => {
        amount += (movement.Amount * movement.Movementtype);
      });
      return amount
    }
  }


  dateCellhandler = (col) => {
    if (col.value) {
      return col.value.split('T').length > 0 ? col.value.split('T')[0] : col.value
    }
    return null
  }

  boolCellhandler = (col) => {
    const { Profile } = this.props
    return col.value !== null && (col.value ? Literals.Messages.Yes[Profile.Language] : Literals.Messages.No[Profile.Language])
  }

}