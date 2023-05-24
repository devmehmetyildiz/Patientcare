import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Divider, Icon, Modal } from 'semantic-ui-react'
import { Breadcrumb, Button, Grid, GridColumn, Header } from 'semantic-ui-react'
import DataTable from '../../Utils/DataTable'
import LoadingPage from '../../Utils/LoadingPage'
import Notification from '../../Utils/Notification'
import NoDataScreen from '../../Utils/NoDataScreen'
import ColumnChooser from '../../Containers/Utils/ColumnChooser'

export default class Mailsettings extends Component {

  constructor(props) {
    super(props)
    this.state = {
      open: false,
      selectedrecord: {}
    }
  }

  componentDidMount() {
    const { GetMailsettings } = this.props
    GetMailsettings()
  }

  componentDidUpdate() {
    const { Mailsettings, removeMailsettingnotification } = this.props
    Notification(Mailsettings.notifications, removeMailsettingnotification)
  }

  render() {

    const Columns = [
      { Header: 'Id', accessor: 'id', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: 'Tekil ID', accessor: 'concurrencyStamp', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: 'Mail Kural Adı', accessor: 'name', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'Mail Kullanıcı Adı', accessor: 'user', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'Smtp Host', accessor: 'smtphost', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'Smtp Port', accessor: 'smtpport', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'Mail Adresi', accessor: 'mailaddress', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'Body Html mi?', accessor: 'isbodyhtml', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.boolCellhandler(col) },
      { Header: 'Ayar Aktif mi?', accessor: 'issettingactive', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.boolCellhandler(col) },
      { Header: 'Oluşturan Kullanıcı', accessor: 'createdUser', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: 'Güncelleyen Kullanıcı', accessor: 'updatedUser', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: 'Oluşturma Zamanı', accessor: 'createTime', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: 'Güncelleme Zamanı', accessor: 'updateTime', sortable: true, canGroupBy: true, canFilter: true, },
      { accessor: 'edit', Header: "Güncelle", canGroupBy: false, canFilter: false, disableFilters: true, sortable: false, className: 'text-center action-column' },
      { accessor: 'delete', Header: "Sil", canGroupBy: false, canFilter: false, disableFilters: true, sortable: false, className: 'text-center action-column' }]

    const { Mailsettings, Profile, DeleteMailsettings } = this.props
    const { list, isLoading, isDispatching } = Mailsettings


    const metaKey = "Mailsettings"
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
      item.edit = <Link to={`/Mailsettings/${item.concurrencyStamp}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>
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
                      <Link to={"/Mailsettings"}>
                        <Breadcrumb.Section>Mail Ayarları</Breadcrumb.Section>
                      </Link>
                    </Breadcrumb>
                  </GridColumn>
                  <GridColumn width={8} >
                    <Link to={"/Mailsettings/Create"}>
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
              </div> : <NoDataScreen message="Tanımlı Mail Ayarı Yok" />
            }
          </div>
          <Modal
            onClose={() => this.setState({ open: false })}
            onOpen={() => this.setState({ open: true })}
            open={this.state.open}
          >
            <Modal.Header>Mail Ayarı Silme</Modal.Header>
            <Modal.Content image>
              <Modal.Description>
                <p>
                  <span className='font-bold'>{Object.keys(this.state.selectedrecord).length > 0 ? `${this.state.selectedrecord.name} ` : null} </span>
                  ayarını silmek istediğinize emin misiniz?
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
                  DeleteMailsettings(this.state.selectedrecord)
                  this.setState({ open: false, selectedrecord: {} })
                }}
                positive
              />
            </Modal.Actions>
          </Modal>
        </React.Fragment >
    )
  }

  handleChangeModal = (value) => {
    this.setState({ modal: value })
  }

  boolCellhandler = (col) => {
    return col.value !== null && (col.value ? "EVET" : "HAYIR")
  }
}
