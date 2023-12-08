import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Loader } from 'semantic-ui-react'
import { Breadcrumb, Grid, GridColumn } from 'semantic-ui-react'
import DataTable from '../../Utils/DataTable'
import LoadingPage from '../../Utils/LoadingPage'
import NoDataScreen from '../../Utils/NoDataScreen'
import Literals from './Literals'
import Pagewrapper from '../../Common/Wrappers/Pagewrapper'
import Headerwrapper from '../../Common/Wrappers/Headerwrapper'
import Pagedivider from '../../Common/Styled/Pagedivider'
import PatientcashmovementsDelete from '../../Containers/Patientcashmovements/PatientcashmovementsDelete'
import MobileTable from '../../Utils/MobileTable'
import Settings from '../../Common/Settings'
import { CASHYPES, getInitialconfig } from '../../Utils/Constants'

export default class Patientcashmovements extends Component {

  componentDidMount() {
    const { GetPatientcashmovements, GetPatients,
      GetPatientdefines, GetPatientcashregisters } = this.props
    GetPatientcashmovements()
    GetPatients()
    GetPatientdefines()
    GetPatientcashregisters()
  }


  render() {
    const { Patientcashmovements, Profile, handleDeletemodal, handleSelectedPatientcashmovement } = this.props
    const { isLoading, isDispatching } = Patientcashmovements

    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    const Columns = [
      { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id', },
      { Header: Literals.Columns.Uuid[Profile.Language], accessor: 'Uuid' },
      { Header: Literals.Columns.Patient[Profile.Language], accessor: 'PatientID', Cell: col => this.patientCellhandler(col) },
      { Header: Literals.Columns.Register[Profile.Language], accessor: 'RegisterID', Cell: col => this.registerCellhandler(col) },
      { Header: Literals.Columns.Movementtype[Profile.Language], accessor: 'Movementtype', Cell: col => this.typeCellhandler(col) },
      { Header: Literals.Columns.Movementvalue[Profile.Language], accessor: 'Movementvalue', Cell: col => this.cashCellhandler(col) },
      { Header: Literals.Columns.Report[Profile.Language], accessor: 'ReportID' },
      { Header: Literals.Columns.Createduser[Profile.Language], accessor: 'Createduser' },
      { Header: Literals.Columns.Updateduser[Profile.Language], accessor: 'Updateduser' },
      { Header: Literals.Columns.Createtime[Profile.Language], accessor: 'Createtime' },
      { Header: Literals.Columns.Updatetime[Profile.Language], accessor: 'Updatetime' },
      { Header: Literals.Columns.edit[Profile.Language], accessor: 'edit', disableProps: true },
      { Header: Literals.Columns.delete[Profile.Language], accessor: 'delete', disableProps: true }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const metaKey = "Patientcashmovements"
    let initialConfig = getInitialconfig(Profile, metaKey)

    const list = (Patientcashmovements.list || []).map(item => {
      return {
        ...item,
        edit: <Link to={`/Patientcashmovements/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
        delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
          handleSelectedPatientcashmovement(item)
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
                    <Link to={"/Patientcashmovements"}>
                      <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <Settings
                  Profile={Profile}
                  Pagecreateheader={Literals.Page.Pagecreateheader[Profile.Language]}
                  Pagecreatelink={"/Patientcashmovements/Create"}
                  Columns={Columns}
                  list={list}
                  initialConfig={initialConfig}
                  metaKey={metaKey}
                  Showcreatebutton
                  Showcolumnchooser
                  Showexcelexport
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
          <PatientcashmovementsDelete />
        </React.Fragment>
    )
  }

  typeCellhandler = (col) => {
    return CASHYPES.find(u => u.value === col.value) ? CASHYPES.find(u => u.value === col.value).Name : col.value
  }

  cashCellhandler = (col) => {
    return col.value + ' TL'
  }

  patientCellhandler = (col) => {
    const { Patients, Patientdefines } = this.props
    if (Patientdefines.isLoading || Patients.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const patient = (Patients.list || []).find(u => u.Uuid === col.value)
      const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)
      return `${patientdefine?.Firstname} ${patientdefine?.Lastname}-${patientdefine?.CountryID}`
    }
  }

  registerCellhandler = (col) => {
    const { Patientcashregisters } = this.props
    if (Patientcashregisters.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const register = (Patientcashregisters.list || []).find(u => u.Uuid === col.value)
      return register?.Name || "tanımsız"
    }
  }
}