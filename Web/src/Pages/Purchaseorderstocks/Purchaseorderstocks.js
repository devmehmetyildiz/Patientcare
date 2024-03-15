import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Breadcrumb, Grid, GridColumn, Loader } from 'semantic-ui-react'
import Literals from './Literals'
import { Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings, DataTable } from '../../Components'
import PurchaseorderstocksDelete from '../../Containers/Purchaseorderstocks/PurchaseorderstocksDelete'
import PurchaseorderstocksApprove from '../../Containers/Purchaseorderstocks/PurchaseorderstocksApprove'
import { getInitialconfig } from '../../Utils/Constants'

export default class Purchaseorderstocks extends Component {

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
    const { isLoading} = Purchaseorderstocks

    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    const Columns = [
      { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id', },
      { Header: Literals.Columns.Purchaseorder[Profile.Language], accessor: row => this.purchaseorderCellhandler(row?.PurchaseorderID), Subtitle: true, Withtext: true },
      { Header: Literals.Columns.Uuid[Profile.Language], accessor: 'Uuid', },
      { Header: Literals.Columns.Stockdefine[Profile.Language], accessor: row => this.stockdefineCellhandler(row?.StockdefineID), Title: true },
      { Header: Literals.Columns.Department[Profile.Language], accessor: row => this.departmentCellhandler(row?.DepartmentID) },
      { Header: Literals.Columns.Amount[Profile.Language], accessor: row => this.amountCellhandler(row), Lowtitle: true, Withtext: true },
      { Header: Literals.Columns.Info[Profile.Language], accessor: 'Info', },
      { Header: Literals.Columns.Isapproved[Profile.Language], accessor: row => this.boolCellhandler(row?.Isapproved) },
      { Header: Literals.Columns.Createduser[Profile.Language], accessor: 'Createduser', },
      { Header: Literals.Columns.Updateduser[Profile.Language], accessor: 'Updateduser', },
      { Header: Literals.Columns.Createtime[Profile.Language], accessor: 'Createtime', },
      { Header: Literals.Columns.Updatetime[Profile.Language], accessor: 'Updatetime', },
      { Header: Literals.Columns.change[Profile.Language], accessor: 'change', disableProps: true },
      { Header: Literals.Columns.approve[Profile.Language], accessor: 'approve', disableProps: true },
      { Header: Literals.Columns.edit[Profile.Language], accessor: 'edit', disableProps: true },
      { Header: Literals.Columns.delete[Profile.Language], accessor: 'delete', disableProps: true },
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const metaKey = "Purchaseorderstocks"
    let initialConfig = getInitialconfig(Profile, metaKey)

    const list = (Purchaseorderstocks.list || []).filter(u => u.Isactive && !u.Ismedicine && !u.Issupply).map(item => {
      return {
        ...item,
        change: item.Iscompleted ? <Icon size='large' color='black' name='minus' /> : <Link to={`/Purchaseorderstockmovements/Create?StockID=${item.Uuid}`} ><Icon link size='large' className='text-[#7ec5bf] hover:text-[#5bbdb5]' name='sitemap' /></Link>,
        edit: item.Iscompleted ? <Icon size='large' color='black' name='minus' /> : <Link to={`/Purchaseorderstocks/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
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
      isLoading  ? <LoadingPage /> :
        <React.Fragment>
          <Pagewrapper>
            <Headerwrapper>
              <Grid columns='2' >
                <GridColumn width={8}>
                  <Breadcrumb size='big'>
                    <Link to={"/Purchaseorderstocks"}>
                      <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <Settings
                  Profile={Profile}
                  Pagecreateheader={Literals.Page.Pagecreateheader[Profile.Language]}
                  Pagecreatelink={"/Purchaseorderstocks/Create"}
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
          <PurchaseorderstocksDelete />
          <PurchaseorderstocksApprove />
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
  purchaseorderCellhandler = (value) => {
    const { Purchaseorders } = this.props
    if (Purchaseorders.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return (Purchaseorders.list || []).find(u => u.Uuid === value)?.Purchasenumber
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
    const { Purchaseorderstockmovements, Purchaseorderstocks } = this.props
    if (Purchaseorderstockmovements.isLoading || Purchaseorderstocks.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const selectedStock = (Purchaseorderstocks.list || []).find(u => u.Id === row?.Id)
      let amount = 0.0;
      let movements = (Purchaseorderstockmovements.list || []).filter(u => u.StockID === selectedStock?.Uuid && u.Isactive && u.Isapproved)
      movements.forEach(movement => {
        amount += (movement.Amount * movement.Movementtype);
      });
      return amount
    }
  }


  boolCellhandler = (value) => {
    const { Profile } = this.props
    return value !== null && (value ? Literals.Messages.Yes[Profile.Language] : Literals.Messages.No[Profile.Language])
  }
}