import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from 'semantic-ui-react'
import { Breadcrumb, Button, Grid, GridColumn } from 'semantic-ui-react'
import ColumnChooser from '../../Containers/Utils/ColumnChooser'
import DataTable from '../../Utils/DataTable'
import LoadingPage from '../../Utils/LoadingPage'
import NoDataScreen from '../../Utils/NoDataScreen'
import Notification from '../../Utils/Notification'
import Literals from './Literals'
import Pagedivider from '../../Common/Styled/Pagedivider'
import Pagewrapper from '../../Common/Wrappers/Pagewrapper'
import Headerwrapper from '../../Common/Wrappers/Headerwrapper'
import PatientstocksDelete from "../../Containers/Patientstocks/PatientstocksDelete"
export default class Patientstocks extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
    }
  }

  componentDidMount() {
    const { GetPatientstocks } = this.props
    GetPatientstocks()
  }

  componentDidUpdate() {
    const { Patientstocks, removePatientstocknotification } = this.props
    Notification(Patientstocks.notifications, removePatientstocknotification)
  }

  render() {


    const { Patientstocks, Profile, handleDeletemodal, handleSelectedPatientstock } = this.props
    const { isLoading, isDispatching } = Patientstocks

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

    const metaKey = "Patientstocks"
    let tableMeta = (Profile.tablemeta || []).find(u => u.Meta === metaKey)
    const initialConfig = {
      hiddenColumns: tableMeta ? JSON.parse(tableMeta.Config).filter(u => u.isVisible === false).map(item => {
        return item.key
      }) : ["Uuid", "Createduser", "Updateduser", "Createtime", "Updatetime"],
      columnOrder: tableMeta ? JSON.parse(tableMeta.Config).sort((a, b) => a.order - b.order).map(item => {
        return item.key
      }) : []
    };

    const list = (Patientstocks.list || []).map(item => {
      return {
        ...item,
        watch: <Link to={`/Patientstockmovements/${item.Uuid}`} ><Icon link size='large' className='text-[#7ec5bf] hover:text-[#5bbdb5]' name='sitemap' /></Link>,
        edit: <Link to={`/Patientstocks/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
        delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
          handleSelectedPatientstock(item)
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
                    <Link to={"/Patientstocks"}>
                      <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <GridColumn width={8} >
                  <Link to={"/Patientstocks/Create"}>
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
          <PatientstocksDelete />
        </React.Fragment>
    )
  }

  handleChangeModal = (value) => {
    this.setState({ modal: value })
  }

  patientdefineCellhandler = (col) => {

    const { Profile } = this.props
    const Error1 = {
      tr: "Hasta Kaydı Bulunamadı",
      en: "Didnt find patient "
    }
    const Error2 = {
      tr: "Hata",
      en: "Error"
    }
    let value = col?.row?.original
    if (value) {
      let define = value?.Patient?.Patientdefine
      if (define) {
        return `${define.Firstname} ${define.Lastname} - ${define.CountryID}`
      } else {
        return Error1[Profile.Language]
      }
    } else {
      return Error2[Profile.Language]
    }
  }
}