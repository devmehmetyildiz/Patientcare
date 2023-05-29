import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Divider, Icon, Modal } from 'semantic-ui-react'
import { Breadcrumb, Button, Grid, GridColumn, Header } from 'semantic-ui-react'
import ColumnChooser from '../../Containers/Utils/ColumnChooser'
import DataTable from '../../Utils/DataTable'
import LoadingPage from '../../Utils/LoadingPage'
import NoDataScreen from '../../Utils/NoDataScreen'
import Notification from '../../Utils/Notification'
export class Roles extends Component {

  constructor(props) {
    super(props)
    this.state = {
      open: false,
      selectedrecord: {},
      privilegesStatus: []
    }
  }


  componentDidMount() {
    const { GetRoles } = this.props
    GetRoles()
  }

  componentDidUpdate() {
    const { Roles, removeRolenotification } = this.props
    Notification(Roles.notifications, removeRolenotification)
  }

  render() {

    const Columns = [
      { Header: 'Id', accessor: 'Id', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: 'Tekil ID', accessor: 'Uuid', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: 'İsim', accessor: 'Name', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'Yetkiler', accessor: 'Privilegestxt', sortable: true, canGroupBy: true, canFilter: true, isOpen: false, Cell: col => this.authoryCellhandler(col) },
      { Header: 'Oluşturan Kullanıcı', accessor: 'Createduser', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'Güncelleyen Kullanıcı', accessor: 'Updateduser', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: 'Oluşturma Zamanı', accessor: 'Createtime', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: 'Güncelleme Zamanı', accessor: 'Updatetime', sortable: true, canGroupBy: true, canFilter: true, },
      { accessor: 'edit', Header: "Güncelle", canGroupBy: false, canFilter: false, disableFilters: true, sortable: false, className: 'text-center action-column' },
      { accessor: 'delete', Header: "Sil", canGroupBy: false, canFilter: false, disableFilters: true, sortable: false, className: 'text-center action-column' }]



    const { Roles, DeleteRoles, Profile } = this.props
    const { list, isLoading, isDispatching } = Roles

    const metaKey = "Roles"
    let tableMeta = (Profile.tablemeta || []).find(u => u.Meta === metaKey)
    const initialConfig = {
      hiddenColumns: tableMeta ? JSON.parse(tableMeta.Config).filter(u => u.isVisible === false).map(item => {
        return item.key
      }) : ["Uuid", "Createduser", "Updateduser", "Createtime", "Updatetime"],
      columnOrder: tableMeta ? JSON.parse(tableMeta.Config).sort((a, b) => a.order - b.order).map(item => {
        return item.key
      }) : []
    };

    (list || []).forEach(item => {
      var text = item.Privileges.map((privilege) => {
        return privilege.text;
      }).join(", ")
      item.Privilegestxt = text;
      item.edit = <Link to={`/roles/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>
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
                      <Link to={"/Roles"}>
                        <Breadcrumb.Section>Roller</Breadcrumb.Section>
                      </Link>
                    </Breadcrumb>
                  </GridColumn>
                  <GridColumn width={8} >
                    <Link to={"/Roles/Create"}>
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
              </div> : <NoDataScreen message="Tanımlı Durum Yok" />
            }
          </div>
          <Modal
            onClose={() => this.setState({ open: false })}
            onOpen={() => this.setState({ open: true })}
            open={this.state.open}
          >
            <Modal.Header>Rol Silme</Modal.Header>
            <Modal.Content image>
              <Modal.Description>
                <p>
                  <span className='font-bold'>{Object.keys(this.state.selectedrecord).length > 0 ? `${this.state.selectedrecord.Name} ` : null} </span>
                  rolünü silmek istediğinize emin misiniz?
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
                  DeleteRoles(this.state.selectedrecord)
                  this.setState({ open: false, selectedrecord: {} })
                }}
                positive
              />
            </Modal.Actions>
          </Modal>
        </React.Fragment>
    )
  }

  expandAuthory = (rowid) => {
    const prevData = this.state.privilegesStatus
    prevData.push(rowid)
    this.setState({ privilegesStatus: [...prevData] })
  }

  shrinkAuthory = (rowid) => {
    const index = this.state.privilegesStatus.indexOf(rowid)
    const prevData = this.state.privilegesStatus
    if (index > -1) {
      prevData.splice(index, 1)
      this.setState({ privilegesStatus: [...prevData] })
    }
  }

  authoryCellhandler = (col) => {
    if (col.value) {
      if (!col.cell.isGrouped) {
        const itemId = col.row.original.Id
        const itemPrivileges = col.row.original.Privileges
        return col.value.length - 35 > 20 ?
          (
            !this.state.privilegesStatus.includes(itemId) ?
              [col.value.slice(0, 35) + ' ...(' + itemPrivileges.length + ')', <Link to='#' className='showMoreOrLess' onClick={() => this.expandAuthory(itemId)}> ...Daha Fazla Göster</Link>] :
              [col.value, <Link to='#' className='showMoreOrLess' onClick={() => this.shrinkAuthory(itemId)}> ...Daha Az Göster</Link>]
          ) : col.value
      }
      return col.value
    }
    return null
  }

}
export default Roles