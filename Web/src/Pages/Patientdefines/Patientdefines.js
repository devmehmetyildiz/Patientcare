import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Loader } from 'semantic-ui-react'
import { Breadcrumb, Button, Grid, GridColumn } from 'semantic-ui-react'
import DataTable from '../../Utils/DataTable'
import LoadingPage from '../../Utils/LoadingPage'
import Notification from '../../Utils/Notification'
import NoDataScreen from '../../Utils/NoDataScreen'
import ColumnChooser from '../../Containers/Utils/ColumnChooser'
import Literals from './Literals'
import Pagedivider from '../../Common/Styled/Pagedivider'
import Pagewrapper from '../../Common/Wrappers/Pagewrapper'
import Headerwrapper from '../../Common/Wrappers/Headerwrapper'
import PatientdefinesDelete from "../../Containers/Patientdefines/PatientdefinesDelete"
import MobileTable from '../../Utils/MobileTable'
import Settings from '../../Common/Settings'
export default class Patientdefines extends Component {

  componentDidMount() {
    const { GetPatientdefines, GetPatienttypes, GetCostumertypes } = this.props
    GetPatientdefines()
    GetPatienttypes()
    GetCostumertypes()
  }


  render() {

    const { Patientdefines, Profile, handleSelectedPatientdefine, handleDeletemodal, AddRecordPatientdefines } = this.props
    const { isLoading, isDispatching } = Patientdefines

    const Columns = [
      { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Uuid[Profile.Language], accessor: 'Uuid', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Firstname[Profile.Language], accessor: 'Firstname', sortable: true, canGroupBy: true, canFilter: true, Firstheader: true },
      { Header: Literals.Columns.Lastname[Profile.Language], accessor: 'Lastname', sortable: true, canGroupBy: true, canFilter: true, Subheader: true },
      { Header: Literals.Columns.Fathername[Profile.Language], accessor: 'Fathername', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.Mothername[Profile.Language], accessor: 'Mothername', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.Motherbiologicalaffinity[Profile.Language], accessor: 'Motherbiologicalaffinity', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.Ismotheralive[Profile.Language], accessor: 'Ismotheralive', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.boolCellhandler(col) },
      { Header: Literals.Columns.Fatherbiologicalaffinity[Profile.Language], accessor: 'Fatherbiologicalaffinity', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.Isfatheralive[Profile.Language], accessor: 'Isfatheralive', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.boolCellhandler(col) },
      { Header: Literals.Columns.CountryID[Profile.Language], accessor: 'CountryID', sortable: true, canGroupBy: true, canFilter: true ,Finalheader:true},
      { Header: Literals.Columns.Dateofbirth[Profile.Language], accessor: 'Dateofbirth', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.Placeofbirth[Profile.Language], accessor: 'Placeofbirth', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.Dateofdeath[Profile.Language], accessor: 'Dateofdeath', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.Placeofdeath[Profile.Language], accessor: 'Placeofdeath', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.Deathinfo[Profile.Language], accessor: 'Deathinfo', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.Gender[Profile.Language], accessor: 'Gender', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.Marialstatus[Profile.Language], accessor: 'Marialstatus', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.Criminalrecord[Profile.Language], accessor: 'Criminalrecord', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.Childnumber[Profile.Language], accessor: 'Childnumber', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.Disabledchildnumber[Profile.Language], accessor: 'Disabledchildnumber', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.Siblingstatus[Profile.Language], accessor: 'Siblingstatus', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.Sgkstatus[Profile.Language], accessor: 'Sgkstatus', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.Budgetstatus[Profile.Language], accessor: 'Budgetstatus', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.City[Profile.Language], accessor: 'City', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.Town[Profile.Language], accessor: 'Town', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.Address1[Profile.Language], accessor: 'Address1', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.Address2[Profile.Language], accessor: 'Address2', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.Country[Profile.Language], accessor: 'Country', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.Contactnumber1[Profile.Language], accessor: 'Contactnumber1', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.Contactnumber2[Profile.Language], accessor: 'Contactnumber2', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.Contactname1[Profile.Language], accessor: 'Contactname1', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.Contactname2[Profile.Language], accessor: 'Contactname2', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.CostumertypeName[Profile.Language], accessor: 'CostumertypeID', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.costumertypeCellhandler(col) },
      { Header: Literals.Columns.PatienttypeName[Profile.Language], accessor: 'PatienttypeID', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.patienttypeCellhandler(col) },
      { Header: Literals.Columns.Createduser[Profile.Language], accessor: 'Createduser', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Updateduser[Profile.Language], accessor: 'Updateduser', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Createtime[Profile.Language], accessor: 'Createtime', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Updatetime[Profile.Language], accessor: 'Updatetime', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.edit[Profile.Language], accessor: 'edit', canGroupBy: false, canFilter: false, disableFilters: true, sortable: false, className: 'text-center action-column' },
      { Header: Literals.Columns.delete[Profile.Language], accessor: 'delete', canGroupBy: false, canFilter: false, disableFilters: true, sortable: false, className: 'text-center action-column' }]

    const metaKey = "Patientdefines"
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


    const list = (Patientdefines.list || []).map(item => {
      return {
        ...item,
        edit: <Link to={`/Patientdefines/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
        delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
          handleSelectedPatientdefine(item)
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
                    <Link to={"/Patientdefines"}>
                      <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <Settings
                  Profile={Profile}
                  Pagecreateheader={Literals.Page.Pagecreateheader[Profile.Language]}
                  Pagecreatelink={"/Patientdefines/Create"}
                  Columns={Columns}
                  list={list}
                  initialConfig={initialConfig}
                  metaKey={metaKey}
                  AddRecord={AddRecordPatientdefines}
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
          <PatientdefinesDelete />
        </React.Fragment>
    )
  }

  boolCellhandler = (col) => {
    const { Profile } = this.props
    return col.value !== null && (col.value ? Literals.Messages.Yes[Profile.Language] : Literals.Messages.No[Profile.Language])
  }

  costumertypeCellhandler = (col) => {
    const { Costumertypes } = this.props
    if (Costumertypes.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return (Costumertypes.list || []).find(u => u.Uuid === col.value)?.Name
    }
  }

  patienttypeCellhandler = (col) => {
    const { Patienttypes } = this.props
    if (Patienttypes.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return (Patienttypes.list || []).find(u => u.Uuid === col.value)?.Name
    }
  }

}