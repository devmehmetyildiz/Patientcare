import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Divider, Icon, Modal } from 'semantic-ui-react'
import { Breadcrumb, Button, Grid, GridColumn, Header } from 'semantic-ui-react'
import DataTable from '../../Utils/DataTable'
import LoadingPage from '../../Utils/LoadingPage'
import Notification from '../../Utils/Notification'
import NoDataScreen from '../../Utils/NoDataScreen'
import ColumnChooser from '../../Containers/Utils/ColumnChooser'

export default class Patientdefines extends Component {

  constructor(props) {
    super(props)
    this.state = {
      open: false,
      selectedrecord: {}
    }
  }

  componentDidMount() {
    const { GetPatientdefines } = this.props
    GetPatientdefines()
  }

  componentDidUpdate() {
    const { Patientdefines, removePatientdefinenotification } = this.props
    Notification(Patientdefines.notifications, removePatientdefinenotification)
  }

  render() {

    const Columns = [
      { Header: 'Id', accessor: 'id', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: 'Tekil ID', accessor: 'concurrencyStamp', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: 'İsim', accessor: 'firstname', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'Soyisim', accessor: 'lastname', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'Baba Adı', accessor: 'fathername', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'Anne Adı', accessor: 'mothername', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'Anne Yakınlık Derecesi', accessor: 'motherbiologicalaffinity', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'Anne Hayatta mı?', accessor: 'ismotheralive', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.boolCellhandler(col) },
      { Header: 'Baba Yakınlık Derecesi', accessor: 'fatherbiologicalaffinity', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'Baba Hayatta mı?', accessor: 'isfatheralive', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.boolCellhandler(col) },
      { Header: 'TC Kimlik No', accessor: 'countryID', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'Doğum Tarihi', accessor: 'dateofbirth', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'Doğum Yeri', accessor: 'placeofbirth', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'Ölüm Tarihi', accessor: 'dateofdeath', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'Ölüm Yeri', accessor: 'placeofdeath', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'Ölüm Nedeni', accessor: 'deathinfo', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'Cinsiyet', accessor: 'gender', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'Medeni Hal', accessor: 'marialstatus', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'Sabıka', accessor: 'criminalrecord', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'Çocuk Sayısı', accessor: 'childnumber', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'Engelli Çocuk Sayısı', accessor: 'disabledchildnumber', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'Engelli Kardeş Durumu', accessor: 'siblingstatus', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'SGK Durumu', accessor: 'sgkstatus', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'Maaş Durumu', accessor: 'budgetstatus', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'Kayıtlı İl', accessor: 'city', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'Kayıtlı İlçe', accessor: 'town', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'Kayıtlı Adres 1', accessor: 'address1', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'Kayıtlı Adres 2', accessor: 'address2', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'Kayıtlı Ülke', accessor: 'country', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'İletişim No 1', accessor: 'contactnumber1', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'İletişim No 2', accessor: 'contactnumber2', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'İletişim Adı 1', accessor: 'contactname1', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'İletişim Adı 2', accessor: 'contactname2', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'Müşteri Türü', accessor: 'costumertype.name', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'Hasta Türü', accessor: 'patienttype.name', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'Oluşturan Kullanıcı', accessor: 'Createduser', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: 'Güncelleyen Kullanıcı', accessor: 'Updateduser', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: 'Oluşturma Zamanı', accessor: 'Createtime', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: 'Güncelleme Zamanı', accessor: 'Updatetime', sortable: true, canGroupBy: true, canFilter: true, },
      { accessor: 'edit', Header: "Güncelle", canGroupBy: false, canFilter: false, disableFilters: true, sortable: false, className: 'text-center action-column' },
      { accessor: 'delete', Header: "Sil", canGroupBy: false, canFilter: false, disableFilters: true, sortable: false, className: 'text-center action-column' }]

    const { Patientdefines, DeletePatientdefines, Profile } = this.props
    const { list, isLoading, isDispatching } = Patientdefines

    const metaKey = "Patientdefines"
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
      item.edit = <Link to={`/Patientdefines/${item.concurrencyStamp}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>
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
                      <Link to={"/Patientdefines"}>
                        <Breadcrumb.Section>Hasta Detayları</Breadcrumb.Section>
                      </Link>
                    </Breadcrumb>
                  </GridColumn>
                  <GridColumn width={8} >
                    <Link to={"/Patientdefines/Create"}>
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
              </div> : <NoDataScreen message="Tanımlı Hasta Tanımı Yok" />
            }
          </div>
          <Modal
            onClose={() => this.setState({ open: false })}
            onOpen={() => this.setState({ open: true })}
            open={this.state.open}
          >
            <Modal.Header>Hasta Kayıt Silme</Modal.Header>
            <Modal.Content image>
              <Modal.Description>
                <p>
                  <span className='font-bold'>{Object.keys(this.state.selectedrecord).length > 0 ? `${this.state.selectedrecord?.firstname + " " + this.state.selectedrecord?.lastname} ` : null} </span>
                  hasta kaydını silmek istediğinize emin misiniz?
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
                  DeletePatientdefines(this.state.selectedrecord)
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