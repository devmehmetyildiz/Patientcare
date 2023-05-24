import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Divider, Icon, Modal } from 'semantic-ui-react'
import { Breadcrumb, Button, Grid, GridColumn, Header } from 'semantic-ui-react'
import ColumnChooser from '../../Containers/Utils/ColumnChooser'
import { MOVEMENTTYPES } from '../../Utils/Constants'
import DataTable from '../../Utils/DataTable'
import LoadingPage from '../../Utils/LoadingPage'
import NoDataScreen from '../../Utils/NoDataScreen'
import Popup from '../../Utils/Popup'

export default class Stockmovements extends Component {

  constructor(props) {
    super(props)
    this.state = {
      open:false,
      selectedrecord:{}
    }
  }

  componentDidMount() {
    const { GetStockmovements } = this.props
    GetStockmovements()
  }

  render() {

    const Columns = [
      { Header: 'Id', accessor: 'id', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: 'Tekil ID', accessor: 'concurrencyStamp', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: 'Ürün', accessor: 'stock.stockdefine.name', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: 'Departman', accessor: 'stock.department.name', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: 'Kullanıcı', accessor: 'username', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'Hareket Zamanı', accessor: 'movementdate', sortable: true, canGroupBy: true, canFilter: true },
      {
        Header: 'Hareket Türü', accessor: 'movementtype', sortable: true, canGroupBy: true, canFilter: true,
        Cell: col => {
          return MOVEMENTTYPES.find(u => u.value === col.value) ? MOVEMENTTYPES.find(u => u.value === col.value).Name : col.value
        },
      },
      {
        Header: 'Hareket Miktarı', accessor: 'amount', sortable: true, canGroupBy: true, canFilter: true,
        Cell: col => {
          return <p>{`${col.value}  ${col.row.original.stock.stockdefine.unit.name}`}</p>
        },
      },
      {
        Header: 'Önceki Değer', accessor: 'prevvalue', sortable: true, canGroupBy: true, canFilter: true,
        Cell: col => {
          return <p>{`${col.value}  ${col.row.original.stock.stockdefine.unit.name}`}</p>
        },
      },
      {
        Header: 'Yeni Değer', accessor: 'newvalue', sortable: true, canGroupBy: true, canFilter: true,
        Cell: col => {
          return <p>{`${col.value}  ${col.row.original.stock.stockdefine.unit.name}`}</p>
        },
      },
      { Header: 'Oluşturan Kullanıcı', accessor: 'createdUser', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: 'Güncelleyen Kullanıcı', accessor: 'updatedUser', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: 'Oluşturma Zamanı', accessor: 'createTime', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: 'Güncelleme Zamanı', accessor: 'updateTime', sortable: true, canGroupBy: true, canFilter: true, },
      { accessor: 'watch', Header: "Hareket İzle", canGroupBy: false, canFilter: false, disableFilters: true, sortable: false, className: 'text-center action-column' },
      { accessor: 'edit', Header: "Güncelle", canGroupBy: false, canFilter: false, disableFilters: true, sortable: false, className: 'text-center action-column' },
      { accessor: 'delete', Header: "Sil", canGroupBy: false, canFilter: false, disableFilters: true, sortable: false, className: 'text-center action-column' }]

    const {  Stockmovements, removeStockmovementnotification, Profile,DeleteStockmovements } = this.props
    const { notifications, list, isLoading, isDispatching } = Stockmovements
    if (notifications && notifications.length > 0) {
      let msg = notifications[0]
      Popup(msg.type, msg.code, msg.description)
      removeStockmovementnotification()
    }

    const metaKey = "Stockmovements"
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
      item.watch = <Link to={`/Stockmovements/${item.concurrencyStamp}`} ><Icon link size='large' className='text-[#7ec5bf] hover:text-[#5bbdb5]' name='sitemap' /></Link>
      item.edit = <Link to={`/Stockmovements/${item.concurrencyStamp}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>
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
                      <Link to={"/Stockmovements"}>
                        <Breadcrumb.Section>Ürün Hareketi</Breadcrumb.Section>
                      </Link>
                    </Breadcrumb>
                  </GridColumn>
                  <GridColumn width={8} >
                    <Link to={"/Stockmovements/Create"}>
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
              </div> : <NoDataScreen message="Tanımlı Ürün Hareketi Yok" />
            }
          </div>
          <Modal
            onClose={() => this.setState({ open: false })}
            onOpen={() => this.setState({ open: true })}
            open={this.state.open}
          >
            <Modal.Header>Ürün Silme</Modal.Header>
            <Modal.Content image>
              <Modal.Description>
                <p>
                  <span className='font-bold'>{Object.keys(this.state.selectedrecord).length > 0 ? `${this.state.selectedrecord?.stock?.stockdefine?.name} ` : null} </span>
                  ürününü hareketini silmek istediğinize emin misiniz?
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
                  DeleteStockmovements(this.state.selectedrecord.concurrencyStamp)
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

}
