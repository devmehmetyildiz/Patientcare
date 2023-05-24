import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Divider, Icon, Modal } from 'semantic-ui-react'
import { Breadcrumb, Button, Grid, GridColumn, Header } from 'semantic-ui-react'
import ColumnChooser from '../../Containers/Utils/ColumnChooser'
import DataTable from '../../Utils/DataTable'
import LoadingPage from '../../Utils/LoadingPage'
import NoDataScreen from '../../Utils/NoDataScreen'
import Notification from '../../Utils/Notification'

export default class Costumertypes extends Component {

  constructor(props) {
    super(props)
    const open = false
    const selectedrecord = {}
    const departmentStatus = []
    this.state = {
      open,
      selectedrecord,
      departmentStatus
    }
  }


  componentDidMount() {
    const { GetCostumertypes } = this.props
    GetCostumertypes()
  }

  componentDidUpdate() {
    const { Costumertypes, removeCostumertypenotification } = this.props
    Notification(Costumertypes.notifications, removeCostumertypenotification)
  }

  render() {

    const Columns = [
      { Header: 'Id', accessor: 'id', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: 'Tekil ID', accessor: 'concurrencyStamp', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: 'İsim', accessor: 'name', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'Departmanlar', accessor: 'departmentstxt', sortable: true, canGroupBy: true, canFilter: true, isOpen: false, Cell: col => this.departmentCellhandler(col) },
      { Header: 'Oluşturan Kullanıcı', accessor: 'createdUser', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: 'Güncelleyen Kullanıcı', accessor: 'updatedUser', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: 'Oluşturma Zamanı', accessor: 'createTime', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: 'Güncelleme Zamanı', accessor: 'updateTime', sortable: true, canGroupBy: true, canFilter: true, },
      { accessor: 'edit', Header: "Güncelle", canGroupBy: false, canFilter: false, disableFilters: true, sortable: false, className: 'text-center action-column' },
      { accessor: 'delete', Header: "Sil", canGroupBy: false, canFilter: false, disableFilters: true, sortable: false, className: 'text-center action-column' }]


    const { Costumertypes, DeleteCostumertypes, Profile } = this.props
    const { list, isLoading, isDispatching } = Costumertypes

    const metaKey = "Costumertypes"
    let tableMeta = (Profile.tablemeta || []).find(u => u.meta === metaKey)
    const initialConfig = {
      hiddenColumns: tableMeta ? JSON.parse(tableMeta.config).filter(u => u.isVisible === false).map(item => {
        return item.key
      }) : ["concurrencyStamp", "createdUser", "updatedUser", "createTime", "updateTime"],
      columnOrder: tableMeta ? JSON.parse(tableMeta.config).sort((a, b) => a.order - b.order).map(item => {
        return item.key
      }) : []
    };


    (list || []).forEach(item => {
      var text = item.departments.map((department) => {
        return department.name;
      }).join(", ")
      item.departmentstxt = text;
      item.edit = <Link to={`/Costumertypes/${item.concurrencyStamp}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>
      item.delete = <Icon link size='large' color='red' name='alternate trash' onClick={() => { this.setState({ selectedrecord: item, open: true }) }} />
    })

    return (
      isLoading || isDispatching ? <LoadingPage /> :
        <React.Fragment>
          <div className='w-full h-[calc(100vh-59px-2rem)] mx-auto flex flex-col  justify-start items-center pb-[2rem] px-[2rem]'>
            <div className='w-full mx-auto align-middle'>
              <Header style={{ backgroundColor: 'transparent', border: 'none' }} as='h1' attached='top' >
                <Grid columns='2' >
                  <GridColumn width={8} className="">
                    <Breadcrumb size='big'>
                      <Link to={"/Costumertypes"}>
                        <Breadcrumb.Section>Müşteri Türleri</Breadcrumb.Section>
                      </Link>
                    </Breadcrumb>
                  </GridColumn>
                  <GridColumn width={8} >
                    <Link to={"/Costumertypes/Create"}>
                      <Button color='blue' floated='right' className='list-right-green-button'>
                        Oluştur
                      </Button>
                    </Link>
                    <ColumnChooser meta={Profile.tablemeta} columns={Columns} metaKey={metaKey} />
                  </GridColumn>
                </Grid>
              </Header>
            </div>
            <Divider className='w-full  h-[1px]' />
            {list.length > 0 ?
              <div className='w-full mx-auto '>
                <DataTable Columns={Columns} Data={list} Config={initialConfig} />
              </div> : <NoDataScreen message="Tanımlı Müşteri Türü Yok" />
            }
          </div>
          <Modal
            onClose={() => this.setState({ open: false })}
            onOpen={() => this.setState({ open: true })}
            open={this.state.open}
          >
            <Modal.Header>Müşteri Türü Silme</Modal.Header>
            <Modal.Content image>
              <Modal.Description>
                <p>
                  <span className='font-bold'>{Object.keys(this.state.selectedrecord).length > 0 ? `${this.state.selectedrecord.name} ` : null} </span>
                  müşteri türünü silmek istediğinize emin misiniz?
                </p>
              </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
              <Button color='black' onClick={() => this.setState({ open: false, selectedrecord: {} })}>
                Vazgeç
              </Button>
              <Button
                content="Sil"
                labelPosition='right'
                icon='checkmark'
                onClick={() => {
                  DeleteCostumertypes(this.state.selectedrecord)
                  this.setState({ open: false, selectedrecord: {} })
                }}
                positive
              />
            </Modal.Actions>
          </Modal>
        </React.Fragment >
    )
  }

  expandDepartments = (rowid) => {
    const prevData = this.state.departmentStatus
    prevData.push(rowid)
    this.setState({ departmentStatus: [...prevData] })
  }

  shrinkDepartments = (rowid) => {
    const index = this.state.departmentStatus.indexOf(rowid)
    const prevData = this.state.departmentStatus
    if (index > -1) {
      prevData.splice(index, 1)
      this.setState({ departmentStatus: [...prevData] })
    }
  }

  departmentCellhandler = (col) => {
    if (col.value) {
      if (!col.cell.isGrouped) {
        const itemId = col.row.original.id
        const itemDepartments = col.row.original.departments
        return col.value.length - 35 > 20 ?
          (
            !this.state.departmentStatus.includes(itemId) ?
              [col.value.slice(0, 35) + ' ...(' + itemDepartments.length + ')', <Link to='#' className='showMoreOrLess' onClick={() => this.expandDepartments(itemId)}> ...Daha Fazla Göster</Link>] :
              [col.value, <Link to='#' className='showMoreOrLess' onClick={() => this.shrinkDepartments(itemId)}> ...Daha Az Göster</Link>]
          ) : col.value
      }
      return col.value
    }
    return null
  }

}