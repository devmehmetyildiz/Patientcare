import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Divider, Icon, Modal } from 'semantic-ui-react'
import { Breadcrumb, Button, Grid, GridColumn, Header } from 'semantic-ui-react'
import DataTable from '../../Utils/DataTable'
import LoadingPage from '../../Utils/LoadingPage'
import NoDataScreen from '../../Utils/NoDataScreen'
import ColumnChooser from '../../Containers/Utils/ColumnChooser'
import Notification from "../../Utils/Notification"
import { PATIENTMOVEMENTTYPE } from '../../Utils/Constants'

export default class Todos extends Component {

  constructor(props) {
    super(props)
    this.state = {
      open: false,
      selectedrecord: [],
      periodStatus: []
    }
  }

  componentDidMount() {
    const { GetTodos } = this.props
    GetTodos()
  }

  componentDidUpdate() {
    const { notifications, removeTodonotification } = this.props
    Notification(notifications, removeTodonotification)
  }

  render() {

    const Columns = [
      { Header: 'Id', accessor: 'id', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: 'Tekil ID', accessor: 'concurrencyStamp', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: 'İsim', accessor: 'patient.patientdefine.firstname', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.nameCellhandler(col) },
      { Header: 'Hareket Türü', accessor: 'movement.patientmovementtype', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.movementCellhandler(col) },
      { Header: 'Hareket Tarihi', accessor: 'movement.movementdate', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.dateCellhandler(col) },
      { Header: 'Hareket Saati', accessor: 'movement.movementdate1', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.timeCellhandler(col) },
      { Header: 'Yapılacak', accessor: 'tododefine.name', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'Sıra', accessor: 'order', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'Zorunlu alan mı?', accessor: 'tododefine.isRequired', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.boolCellhandler(col) },
      { Header: 'Onay Gerekli mi?', accessor: 'tododefine.isNeedactivation', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.boolCellhandler(col) },
      { Header: 'Tamamlandı mı?', accessor: 'isCompleted', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.boolCellhandler(col) },
      { Header: 'Açıklama', accessor: 'tododefine.info', sortable: true, canGroupBy: true, canFilter: true },
      { Header: 'Oluşturan Kullanıcı', accessor: 'Createduser', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: 'Güncelleyen Kullanıcı', accessor: 'Updateduser', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: 'Oluşturma Zamanı', accessor: 'Createtime', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: 'Güncelleme Zamanı', accessor: 'Updatetime', sortable: true, canGroupBy: true, canFilter: true, },
      { accessor: 'delete', Header: "Güncelle", canGroupBy: false, canFilter: false, disableFilters: true, sortable: false, className: 'text-center action-column' }]


    const { Todos, Profile } = this.props
    const { list, isLoading, isDispatching } = Todos

    const metaKey = "Todos"
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
      item.delete = <Icon link size='large' color='red' name='edit' onClick={() => { this.setState({ selectedrecord: item, open: true }) }} />
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
                      <Link to={"/Todos"}>
                        <Breadcrumb.Section>Yapılacaklar</Breadcrumb.Section>
                      </Link>
                    </Breadcrumb>
                  </GridColumn>
                  <GridColumn width={8} >
                    <ColumnChooser meta={Profile.tablemeta} columns={Columns} metaKey={metaKey} />
                  </GridColumn>
                </Grid>
              </Header>
            </div>
            <Divider className='w-full  h-[1px]' />
            {list.length > 0 ?
              <div className='w-full mx-auto '>
                <DataTable Columns={Columns} Data={list} Config={initialConfig} />
              </div> : <NoDataScreen message="Tanımlı Yapılacaklar Yok" />
            }
          </div>
          <Modal
            onClose={() => this.setState({ open: false })}
            onOpen={() => this.setState({ open: true })}
            open={this.state.open}
          >
            <Modal.Header>Yapılacaklar Silme</Modal.Header>
            <Modal.Content image>
              <Modal.Description>
                <p>
                  <span className='font-bold'>{Object.keys(this.state.selectedrecord).length > 0 ? `${this.state.selectedrecord.name} ` : null} </span>
                  yapılacağını silmek istediğinize emin misiniz?
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
                  // DeleteTododefines(this.state.selectedrecord)
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

  expandPeriods = (rowid) => {
    const prevData = this.state.periodStatus
    prevData.push(rowid)
    this.setState({ periodStatus: [...prevData] })
  }

  shrinkPeriods = (rowid) => {
    const index = this.state.periodStatus.indexOf(rowid)
    const prevData = this.state.periodStatus
    if (index > -1) {
      prevData.splice(index, 1)
      this.setState({ periodStatus: [...prevData] })
    }
  }

  periodCellhandler = (col) => {
    if (col.value) {
      if (!col.cell.isGrouped) {
        const itemId = col.row.original.id
        const itemPeriods = col.row.original.periods
        return col.value.length - 35 > 20 ?
          (
            !this.state.periodStatus.includes(itemId) ?
              [col.value.slice(0, 35) + ' ...(' + itemPeriods.length + ')', <Link to='#' className='showMoreOrLess' onClick={() => this.expandPeriods(itemId)}> ...Daha Fazla Göster</Link>] :
              [col.value, <Link to='#' className='showMoreOrLess' onClick={() => this.shrinkPeriods(itemId)}> ...Daha Az Göster</Link>]
          ) : col.value
      }
      return col.value
    }
    return null
  }

  boolCellhandler = (col) => {
    return col.value !== null && (col.value ? "EVET" : "HAYIR")
  }

  dateCellhandler = (col) => {
    return col ? col.cell.row.original?.movement ? Array.isArray(col.cell.row.original?.movement.movementdate.split('T')) ? col.cell.row.original?.movement.movementdate.split('T')[0] : "Tarih formatı hatalı" : "Hasta Kaydı Bulunamadı" : "Tanımsız"
  }

  timeCellhandler = (col) => {
    return col ? col.cell.row.original?.movement ? Array.isArray(col.cell.row.original?.movement.movementdate.split('T')) ? col.cell.row.original?.movement.movementdate.split('T')[1] : "Tarih formatı hatalı" : "Hasta Kaydı Bulunamadı" : "Tanımsız"
  }

  movementCellhandler = (col) => {
    return PATIENTMOVEMENTTYPE.find(u => u.value === col.value) ? PATIENTMOVEMENTTYPE.find(u => u.value === col.value).Name : col.value
  }

  nameCellhandler = (col) => {
    return col ? col.cell.row.original?.patient?.patientdefine ? `${col.cell.row.original?.patient?.patientdefine?.firstname} ${col.cell.row.original?.patient?.patientdefine?.lastname}` : "Hasta Kaydı Bulunamadı" : "Tanımsız"
  }
}


