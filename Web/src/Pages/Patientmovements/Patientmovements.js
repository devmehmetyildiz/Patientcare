import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Loader } from 'semantic-ui-react'
import { Breadcrumb, Button, Grid, GridColumn } from 'semantic-ui-react'
import ColumnChooser from '../../Containers/Utils/ColumnChooser'
import { PATIENTMOVEMENTTYPE } from '../../Utils/Constants'
import DataTable from '../../Utils/DataTable'
import LoadingPage from '../../Utils/LoadingPage'
import NoDataScreen from '../../Utils/NoDataScreen'
import Notification from '../../Utils/Notification'
import Literals from './Literals'
import Pagedivider from '../../Common/Styled/Pagedivider'
import Pagewrapper from '../../Common/Wrappers/Pagewrapper'
import Headerwrapper from '../../Common/Wrappers/Headerwrapper'
import PatientmovementsDelete from "../../Containers/Patientmovements/PatientmovementsDelete"
import Settings from '../../Common/Settings'
import MobileTable from '../../Utils/MobileTable'
export default class Patientmovements extends Component {

  componentDidMount() {
    const { GetPatientmovements, GetPatients, GetPatientdefines } = this.props
    GetPatientmovements()
    GetPatients()
    GetPatientdefines()
  }

  render() {

    const { Patientmovements, Profile, handleSelectedPatientmovement, handleDeletemodal, AddRecordPatientmovements } = this.props
    const { isLoading, isDispatching } = Patientmovements

    const Columns = [
      { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Uuid[Profile.Language], accessor: 'Uuid', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.PatientdefineFirstname[Profile.Language], accessor: 'PatientID', Firstheader: true, sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.nameCellhandler(col) },
      { Header: Literals.Columns.Patientmovementtype[Profile.Language], accessor: 'Patientmovementtype', Finalheader: true, sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.movementCellhandler(col) },
      { Header: Literals.Columns.IsDeactive[Profile.Language], accessor: 'IsDeactive', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.boolCellhandler(col) },
      { Header: Literals.Columns.OldPatientmovementtype[Profile.Language], accessor: 'OldPatientmovementtype', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.movementCellhandler(col) },
      { Header: Literals.Columns.NewPatientmovementtype[Profile.Language], accessor: 'NewPatientmovementtype', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.movementCellhandler(col) },
      { Header: Literals.Columns.IsTodoneed[Profile.Language], accessor: 'IsTodoneed', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.boolCellhandler(col) },
      { Header: Literals.Columns.IsTodocompleted[Profile.Language], accessor: 'IsTodocompleted', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.boolCellhandler(col) },
      { Header: Literals.Columns.IsComplated[Profile.Language], accessor: 'IsComplated', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.boolCellhandler(col) },
      { Header: Literals.Columns.Iswaitingactivation[Profile.Language], accessor: 'Iswaitingactivation', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.boolCellhandler(col) },
      { Header: Literals.Columns.Movementdate[Profile.Language], accessor: 'Movementdate', sortable: true, Subheader: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.Createduser[Profile.Language], accessor: 'Createduser', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Updateduser[Profile.Language], accessor: 'Updateduser', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Createtime[Profile.Language], accessor: 'Createtime', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Updatetime[Profile.Language], accessor: 'Updatetime', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.edit[Profile.Language], accessor: 'edit', canGroupBy: false, canFilter: false, disableFilters: true, sortable: false, className: 'text-center action-column' },
      { Header: Literals.Columns.delete[Profile.Language], accessor: 'delete', canGroupBy: false, canFilter: false, disableFilters: true, sortable: false, className: 'text-center action-column' }]

    const metaKey = "Patientmovements"
    let tableMeta = (Profile.tablemeta || []).find(u => u.Meta === metaKey)
    const initialConfig = {
      hiddenColumns: tableMeta ? JSON.parse(tableMeta.Config).filter(u => u.isVisible === false).map(item => {
        return item.key
      }) : ["Uuid", "Createduser", "Updateduser", "Createtime", "Updatetime"],
      columnOrder: tableMeta ? JSON.parse(tableMeta.Config).sort((a, b) => a.order - b.order).map(item => {
        return item.key
      }) : [],
      groupBy: tableMeta ? JSON.parse(tableMeta.Config).filter(u => u.isGroup === true).map(item => {
        return item.key
      }) : [],
    };

    const list = (Patientmovements.list || []).map(item => {
      return {
        ...item,
        edit: <Link to={`/Patientmovements/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
        delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
          handleSelectedPatientmovement(item)
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
                <GridColumn width={8}>
                  <Breadcrumb size='big'>
                    <Link to={"/Patientmovements"}>
                      <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <Settings
                  Profile={Profile}
                  Pagecreateheader={Literals.Page.Pagecreateheader[Profile.Language]}
                  Pagecreatelink={"/Patientmovements/Create"}
                  Columns={Columns}
                  list={list}
                  initialConfig={initialConfig}
                  metaKey={metaKey}
                  AddRecord={AddRecordPatientmovements}
                />
              </Grid>
            </Headerwrapper>
            <Pagedivider />
            {list.length > 0 ?
              <div className='w-full mx-auto '>
                {Profile.Ismobile ?
                  <MobileTable Columns={Columns} Data={list} Config={initialConfig} Profile={Profile} /> :
                  <DataTable Columns={Columns} Data={list} Config={initialConfig} />}
              </div> : <NoDataScreen message={Literals.Messages.Nodatafind[Profile.Language]} />
            }
          </Pagewrapper>
          <PatientmovementsDelete />
        </React.Fragment>
    )
  }

  boolCellhandler = (col) => {
    return col.value !== null && (col.value ? "EVET" : "HAYIR")
  }

  movementCellhandler = (col) => {
    return PATIENTMOVEMENTTYPE.find(u => u.value === col.value) ? PATIENTMOVEMENTTYPE.find(u => u.value === col.value).Name : col.value
  }

  nameCellhandler = (col) => {

    const { Patients, Patientdefines } = this.props
    if (Patientdefines.isLoading || Patients.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const patient = (Patients.list || []).find(u => u.Uuid === col.value)
      const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)
      return `${patientdefine?.Firstname} ${patientdefine?.Lastname}-${patientdefine?.CountryID}`
    }
  }

}