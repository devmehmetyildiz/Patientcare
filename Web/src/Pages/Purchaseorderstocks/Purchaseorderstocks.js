import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Divider, Icon, Modal } from 'semantic-ui-react'
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
import PurchaseorderstockmovementsDelete from '../../Containers/Purchaseorderstockmovements/PurchaseorderstockmovementsDelete'

export default class Purchaseorderstocks extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      openDeactivate: false,
      selectedrecord: {}
    }
  }

  componentDidMount() {
    const { GetPurchaseorderstocks } = this.props
    GetPurchaseorderstocks()
  }

  componentDidUpdate() {
    const { Purchaseorderstocks, removePurchaseorderstocknotification } = this.props
    Notification(Purchaseorderstocks, removePurchaseorderstocknotification)
  }

  render() {

    const { Purchaseorderstocks, DeletePurchaseorderstocks, Profile, handleDeletemodal, handleSelectedPurchaseorderstocks } = this.props
    const { isLoading, isDispatching } = Purchaseorderstocks

    const Columns = [
      { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Patient[Profile.Language], accessor: 'PatientPatientdefineFirstname', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.patientdefineCellhandler(col) },
      { Header: Literals.Columns.Uuid[Profile.Language], accessor: 'Uuid', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Stockdefine[Profile.Language], accessor: 'Stockdefine.Name', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.Department[Profile.Language], accessor: 'Stockdefine.Department.Name', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.Skt[Profile.Language], accessor: 'Skt', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.Barcodeno[Profile.Language], accessor: 'Barcodeno', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.Amount[Profile.Language], accessor: 'Amount', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.Info[Profile.Language], accessor: 'Info', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.Source[Profile.Language], accessor: 'Source', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.Createduser[Profile.Language], accessor: 'Createduser', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Updateduser[Profile.Language], accessor: 'Updateduser', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Createtime[Profile.Language], accessor: 'Createtime', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Updatetime[Profile.Language], accessor: 'Updatetime', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.watch[Profile.Language], accessor: 'watch', canGroupBy: false, canFilter: false, disableFilters: true, sortable: false, className: 'text-center action-column' },
      { Header: Literals.Columns.edit[Profile.Language], accessor: 'edit', canGroupBy: false, canFilter: false, disableFilters: true, sortable: false, className: 'text-center action-column' },
      { Header: Literals.Columns.delete[Profile.Language], accessor: 'delete', canGroupBy: false, canFilter: false, disableFilters: true, sortable: false, className: 'text-center action-column' }]

    const metaKey = "Purhcaseorderstocks"
    let tableMeta = (Profile.tablemeta || []).find(u => u.Meta === metaKey)
    const initialConfig = {
      hiddenColumns: tableMeta ? JSON.parse(tableMeta.Config).filter(u => u.isVisible === false).map(item => {
        return item.key
      }) : ["Uuid", "Createduser", "Updateduser", "Createtime", "Updatetime"],
      columnOrder: tableMeta ? JSON.parse(tableMeta.Config).sort((a, b) => a.order - b.order).map(item => {
        return item.key
      }) : []
    };

    const list = (Purchaseorderstocks.list || []).map(item => {
      return {
        ...item,
        watch: <Link to={`/Purchaseorderstockmovements/${item.Uuid}`} ><Icon link size='large' className='text-[#7ec5bf] hover:text-[#5bbdb5]' name='sitemap' /></Link>,
        edit: <Link to={`/Purchaseorderstocks/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
        delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
          handleSelectedPurchaseorderstocks(item)
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
                    <Link to={"/Purchaseorderstocks"}>
                      <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <GridColumn width={8} >
                  <Link to={"/Purchaseorderstocks/Create"}>
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

}