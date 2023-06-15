import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Divider, Icon, Modal } from 'semantic-ui-react'
import { Breadcrumb, Button, Grid, GridColumn, Header } from 'semantic-ui-react'
import ColumnChooser from '../../Containers/Utils/ColumnChooser'
import DataTable from '../../Utils/DataTable'
import LoadingPage from '../../Utils/LoadingPage'
import NoDataScreen from '../../Utils/NoDataScreen'
import Notification from '../../Utils/Notification'

export default class Stocks extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      openDeactivate: false,
      selectedrecord: {}
    }
  }

  componentDidMount() {
    const { GetStocks } = this.props
    GetStocks()
  }

  componentDidUpdate() {
    const { Stocks, removeStocknotification } = this.props
    Notification(Stocks.notifications, removeStocknotification)
  }


  render() {

    const Columns = [
      { Header: 'Id', accessor: 'Id', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: 'Tekil ID', accessor: 'Uuid', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: 'Ürün', accessor: 'Stockdefine.Name', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'Departman', accessor: 'Stockdefine.Department.Name', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'Skt', accessor: 'Skt', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'Barkod No', accessor: 'Barcodeno', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'Toplam Miktar', accessor: 'Maxamount', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'Aktüel Miktar', accessor: 'Amount', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'Kullanılan Miktar', accessor: 'Usageamount', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'Açıklama', accessor: 'Info', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'Kaynak', accessor: 'Source', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'Oluşturan Kullanıcı', accessor: 'Createduser', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: 'Güncelleyen Kullanıcı', accessor: 'Updateduser', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: 'Oluşturma Zamanı', accessor: 'Createtime', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: 'Güncelleme Zamanı', accessor: 'Updatetime', sortable: true, canGroupBy: true, canFilter: true, },
      { accessor: 'watch', Header: "Hareket İzle", canGroupBy: false, canFilter: false, disableFilters: true, sortable: false, className: 'text-center action-column' },
      { accessor: 'kill', Header: "İtlaf Et", canGroupBy: false, canFilter: false, disableFilters: true, sortable: false, className: 'text-center action-column' },
      { accessor: 'edit', Header: "Güncelle", canGroupBy: false, canFilter: false, disableFilters: true, sortable: false, className: 'text-center action-column' },
      { accessor: 'delete', Header: "Sil", canGroupBy: false, canFilter: false, disableFilters: true, sortable: false, className: 'text-center action-column' }]

    const { Stocks, DeleteStocks, DeactivateStocks, Profile } = this.props
    const { list, isLoading, isDispatching } = Stocks


    const metaKey = "Stocks"
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
      item.watch = <Link to={`/Stockmovement/${item.Uuid}`} ><Icon link size='large' className='text-[#7ec5bf] hover:text-[#5bbdb5]' name='sitemap' /></Link>
      item.kill = <Icon link size='large' className='text-[#c5a47e] hover:text-[#ca975c]' name='bomb' onClick={() => { this.setState({ selectedrecord: item, openDeactivate: true }) }} />
      item.edit = <Link to={`/Stocks/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>
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
                      <Link to={"/Stocks"}>
                        <Breadcrumb.Section>Ürünler</Breadcrumb.Section>
                      </Link>
                    </Breadcrumb>
                  </GridColumn>
                  <GridColumn width={8} >
                    <Link to={"/Stocks/Create"}>
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
              </div> : <NoDataScreen message="Tanımlı Ürün Yok" />
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
                  <span className='font-bold'>{Object.keys(this.state.selectedrecord).length > 0 ? `${this.state.selectedrecord.Stockdefine.Name} ` : null} </span>
                  ürününü silmek istediğinize emin misiniz?
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
                  DeleteStocks(this.state.selectedrecord)
                  this.setState({ open: false, selectedrecord: {} })
                }}
                positive
              />
            </Modal.Actions>
          </Modal>
          <Modal
            onClose={() => this.setState({ openDeactivate: false })}
            onOpen={() => this.setState({ openDeactivate: true })}
            open={this.state.openDeactivate}
          >
            <Modal.Header>Ürün İtlaf Etme</Modal.Header>
            <Modal.Content image>
              <Modal.Description>
                <p>
                  <span className='font-bold'>{Object.keys(this.state.selectedrecord).length > 0 ? `${this.state.selectedrecord.stockdefine.name} ` : null} </span>
                  ürününü itlaf istediğinize emin misiniz?
                </p>
              </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
              <Button color='black' onClick={() => this.setState({ openDeactivate: false, selectedrecord: {} })}>
                Vazgeç
              </Button>
              <Button
                content="Sil"
                labelPosition='right'
                icon='checkmark'
                onClick={() => {
                  DeactivateStocks(this.state.selectedrecord.Uuid)
                  this.setState({ openDeactivate: false, selectedrecord: {} })
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