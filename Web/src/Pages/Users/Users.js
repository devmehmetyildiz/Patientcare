import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Divider, Grid, GridColumn, Header, Icon, Modal } from 'semantic-ui-react'
import ColumnChooser from '../../Containers/Utils/ColumnChooser'
import DataTable from '../../Utils/DataTable'
import LoadingPage from '../../Utils/LoadingPage'
import NoDataScreen from '../../Utils/NoDataScreen'
import Popup from '../../Utils/Popup'

export default class Users extends Component {

  constructor(props) {
    super(props)
    this.state = {
      open: false,
      selectedrecord: {},
      stationsStatus: [],
      rolesStatus: [],
      departmentsStatus: [],
    }
  }

  componentDidMount() {
    const { GetUsers } = this.props
    GetUsers()
  }

  render() {

    const Columns = [
      { Header: 'Id', accessor: 'id', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: 'Tekil ID', accessor: 'concurrencyStamp', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: 'Kullanıcı Adı', accessor: 'username', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'Kullanıcı Adı (Büyük)', accessor: 'normalizedUsername', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'E-Posta', accessor: 'email', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'E-Posta Doğrulama', accessor: 'emailConfirmed', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'Son Hatalı Giriş Sayısı', accessor: 'accessFailedCount', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'İsim', accessor: 'name', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'Soyisim', accessor: 'surname', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'Telefon numarası', accessor: 'phoneNumber', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'Telefon numarası Doğrulama', accessor: 'phoneNumberConfirmed', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'Şehir', accessor: 'city', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'İlçe', accessor: 'town', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'Adres', accessor: 'address', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'Dil', accessor: 'language', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'Kullanıcı ID', accessor: 'userID', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'İstasyonlar', accessor: 'stationstxt', sortable: true, canGroupBy: true, canFilter: true, isOpen: false, Cell: col => this.stationCellhandler(col) },
      { Header: 'Departmanlar', accessor: 'departmentstxt', sortable: true, canGroupBy: true, canFilter: true, isOpen: false, Cell: col => this.departmentCellhandler(col) },
      { Header: 'Roller', accessor: 'rolestxt', sortable: true, canGroupBy: true, canFilter: true, isOpen: false, Cell: col => this.rolesCellhandler(col) },
      { Header: 'Oluşturan Kullanıcı', accessor: 'createdUser', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: 'Güncelleyen Kullanıcı', accessor: 'updatedUser', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: 'Oluşturma Zamanı', accessor: 'createTime', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: 'Güncelleme Zamanı', accessor: 'updateTime', sortable: true, canGroupBy: true, canFilter: true, },
      { accessor: 'edit', Header: "Güncelle", canGroupBy: false, canFilter: false, disableFilters: true, sortable: false, className: 'text-center action-column' },
      { accessor: 'delete', Header: "Sil", canGroupBy: false, canFilter: false, disableFilters: true, sortable: false, className: 'text-center action-column' }]


    const { Users, removeUsernotification, DeleteUsers, Profile } = this.props
    const { notifications, list, isLoading, isDispatching } = Users
    if (notifications && notifications.length > 0) {
      let msg = notifications[0]
      Popup(msg.type, msg.code, msg.description)
      removeUsernotification()
    }

    const metaKey = "Users"
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
      var stationtext = item.stations.map((station) => {
        return station.name;
      }).join(", ")
      item.stationstxt = stationtext;
      var rolestext = item.roles.map((role) => {
        return role.name;
      }).join(", ")
      item.rolestxt = rolestext;
      var departmentext = item.departments.map((department) => {
        return department.name;
      }).join(", ")
      item.departmentstxt = departmentext;
      item.edit = <Link to={`/Users/${item.concurrencyStamp}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>
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
                      <Link to={"/Users"}>
                        <Breadcrumb.Section>Kullanıcılar</Breadcrumb.Section>
                      </Link>
                    </Breadcrumb>
                  </GridColumn>
                  <GridColumn width={8} >
                    <Link to={"/Users/Create"}>
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
              </div> : <NoDataScreen message="Tanımlı Kullanıcı Yok" />
            }
          </div>
          <Modal
            onClose={() => this.setState({ open: false })}
            onOpen={() => this.setState({ open: true })}
            open={this.state.open}
          >
            <Modal.Header>Kullanıcı Silme</Modal.Header>
            <Modal.Content image>
              <Modal.Description>
                <p>
                  <span className='font-bold'>{Object.keys(this.state.selectedrecord).length > 0 ? `${this.state.selectedrecord.name} ` : null} </span>
                  Kullanıcısını silmek istediğinize emin misiniz?
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
                  DeleteUsers(this.state.selectedrecord)
                  this.setState({ open: false, selectedrecord: {} })
                }}
                positive
              />
            </Modal.Actions>
          </Modal>
        </React.Fragment>
    )
  }

  expandStations = (rowid) => {
    const prevData = this.state.stationsStatus
    prevData.push(rowid)
    this.setState({ stationsStatus: [...prevData] })
  }

  shrinkStations = (rowid) => {
    const index = this.state.stationsStatus.indexOf(rowid)
    const prevData = this.state.stationsStatus
    if (index > -1) {
      prevData.splice(index, 1)
      this.setState({ stationsStatus: [...prevData] })
    }
  }
  expandRoles = (rowid) => {
    const prevData = this.state.rolesStatus
    prevData.push(rowid)
    this.setState({ rolesStatus: [...prevData] })
  }

  shrinkRoles = (rowid) => {
    const index = this.state.rolesStatus.indexOf(rowid)
    const prevData = this.state.rolesStatus
    if (index > -1) {
      prevData.splice(index, 1)
      this.setState({ rolesStatus: [...prevData] })
    }
  }
  expandDepartments = (rowid) => {
    const prevData = this.state.rolesStatus
    prevData.push(rowid)
    this.setState({ rolesStatus: [...prevData] })
  }

  shrinkDepartments = (rowid) => {
    const index = this.state.departmentsStatus.indexOf(rowid)
    const prevData = this.state.departmentsStatus
    if (index > -1) {
      prevData.splice(index, 1)
      this.setState({ departmentsStatus: [...prevData] })
    }
  }

  rolesCellhandler = (col) => {
    if (col.value) {
      if (!col.cell.isGrouped) {
        const itemId = col.row.original.id
        const itemRoles = col.row.original.roles
        return col.value.length - 35 > 20 ?
          (
            !this.state.rolesStatus.includes(itemId) ?
              [col.value.slice(0, 35) + ' ...(' + itemRoles.length + ')', <Link to='#' className='showMoreOrLess' onClick={() => this.expandRoles(itemId)}> ...Daha Fazla Göster</Link>] :
              [col.value, <Link to='#' className='showMoreOrLess' onClick={() => this.shrinkRoles(itemId)}> ...Daha Az Göster</Link>]
          ) : col.value
      }
      return col.value
    }
    return null
  }

  departmentCellhandler = (col) => {
    if (col.value) {
      if (!col.cell.isGrouped) {
        const itemId = col.row.original.id
        const itemDepartments = col.row.original.departments
        return col.value.length - 35 > 20 ?
          (
            !this.state.departmentsStatus.includes(itemId) ?
              [col.value.slice(0, 35) + ' ...(' + itemDepartments.length + ')', <Link to='#' className='showMoreOrLess' onClick={() => this.expandDepartments(itemId)}> ...Daha Fazla Göster</Link>] :
              [col.value, <Link to='#' className='showMoreOrLess' onClick={() => this.shrinkDepartments(itemId)}> ...Daha Az Göster</Link>]
          ) : col.value
      }
      return col.value
    }
    return null
  }

  stationCellhandler = (col) => {
    if (col.value) {
      if (!col.cell.isGrouped) {
        const itemId = col.row.original.id
        const itemStations = col.row.original.stations
        return col.value.length - 35 > 20 ?
          (
            !this.state.stationsStatus.includes(itemId) ?
              [col.value.slice(0, 35) + ' ...(' + itemStations.length + ')', <Link to='#' className='showMoreOrLess' onClick={() => this.expandStations(itemId)}> ...Daha Fazla Göster</Link>] :
              [col.value, <Link to='#' className='showMoreOrLess' onClick={() => this.shrinkStations(itemId)}> ...Daha Az Göster</Link>]
          ) : col.value
      }
      return col.value
    }
    return null
  }

}
