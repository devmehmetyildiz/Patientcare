import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Loader, Breadcrumb, Grid, GridColumn } from 'semantic-ui-react'
import { PATIENTMOVEMENTTYPE, getInitialconfig } from '../../Utils/Constants'
import Literals from './Literals'
import PatientmovementsDelete from "../../Containers/Patientmovements/PatientmovementsDelete"
import { Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings, DataTable } from '../../Components'
import { Formatfulldate } from '../../Utils/Formatdate'
export default class Patientmovements extends Component {

  componentDidMount() {
    const { GetPatientmovements, GetPatients, GetPatientdefines } = this.props
    GetPatientmovements()
    GetPatients()
    GetPatientdefines()
  }

  render() {

    const { Patientmovements, Profile, handleSelectedPatientmovement, handleDeletemodal } = this.props
    const { isLoading } = Patientmovements

    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    const Columns = [
      { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id' },
      { Header: Literals.Columns.Uuid[Profile.Language], accessor: 'Uuid' },
      { Header: Literals.Columns.PatientdefineFirstname[Profile.Language], accessor: row => this.nameCellhandler(row?.PatientID), Title: true },
      { Header: Literals.Columns.Patientmovementtype[Profile.Language], accessor: row => this.movementCellhandler(row?.Patientmovementtype), Subtitle: true, Withtext: true },
      { Header: Literals.Columns.OldPatientmovementtype[Profile.Language], accessor: row => this.movementCellhandler(row?.OldPatientmovementtype) },
      { Header: Literals.Columns.NewPatientmovementtype[Profile.Language], accessor: row => this.movementCellhandler(row?.NewPatientmovementtype) },
      { Header: Literals.Columns.Movementdate[Profile.Language], accessor: row => this.dateCellhandler(row?.Movementdate) },
      { Header: Literals.Columns.Createduser[Profile.Language], accessor: 'Createduser' },
      { Header: Literals.Columns.Updateduser[Profile.Language], accessor: 'Updateduser' },
      { Header: Literals.Columns.Createtime[Profile.Language], accessor: 'Createtime' },
      { Header: Literals.Columns.Updatetime[Profile.Language], accessor: 'Updatetime' },
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const metaKey = "Patientmovements"
    let initialConfig = getInitialconfig(Profile, metaKey)

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
      isLoading ? <LoadingPage /> :
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
          <PatientmovementsDelete />
        </React.Fragment>
    )
  }

  boolCellhandler = (value) => {
    return value !== null && (value ? "EVET" : "HAYIR")
  }

  movementCellhandler = (value) => {
    return PATIENTMOVEMENTTYPE.find(u => u.value === value) ? PATIENTMOVEMENTTYPE.find(u => u.value === value).Name : value
  }

  nameCellhandler = (value) => {
    const { Patients, Patientdefines } = this.props
    if (Patientdefines.isLoading || Patients.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const patient = (Patients.list || []).find(u => u.Uuid === value)
      const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)
      return `${patientdefine?.Firstname} ${patientdefine?.Lastname}-${patientdefine?.CountryID}`
    }
  }

  dateCellhandler = (value) => {
    if (value) {
      return Formatfulldate(value)
    }
    return value
  }

}