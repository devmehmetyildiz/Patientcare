import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Breadcrumb, Grid, GridColumn, Loader } from 'semantic-ui-react'
import Literals from './Literals'
import CareplansDelete from '../../Containers/Careplans/CareplansDelete'
import CareplansApprove from '../../Containers/Careplans/CareplansApprove'
import { getInitialconfig } from '../../Utils/Constants'
import {
  DataTable, Headerwrapper, LoadingPage,
  MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings
} from '../../Components'

export default class Careplans extends Component {

  componentDidMount() {
    const { GetCareplans, GetPatients, GetPatientdefines } = this.props
    GetCareplans()
    GetPatients()
    GetPatientdefines()
  }

  render() {
    const { Careplans, Profile, handleSelectedCareplan, handleDeletemodal, handleApprovemodal } = this.props
    const { isLoading } = Careplans

    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    const Columns = [
      { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id' },
      { Header: Literals.Columns.Uuid[Profile.Language], accessor: 'Uuid' },
      { Header: Literals.Columns.Createdate[Profile.Language], accessor: row => this.dateCellhandler(row?.Createdate) },
      { Header: Literals.Columns.Startdate[Profile.Language], accessor: row => this.dateCellhandler(row?.Startdate) },
      { Header: Literals.Columns.Enddate[Profile.Language], accessor: row => this.dateCellhandler(row?.Enddate) },
      { Header: Literals.Columns.PatientID[Profile.Language], accessor: row => this.patientCellhandler(row?.PatientID), Title: true },
      { Header: Literals.Columns.Needapprove[Profile.Language], accessor: row => this.boolCellhandler(row?.Needapprove), Lowtitle: true, Withtext: true },
      { Header: Literals.Columns.Isapproved[Profile.Language], accessor: row => this.boolCellhandler(row?.Isapproved), Lowtitle: true, Withtext: true },
      { Header: Literals.Columns.Createduser[Profile.Language], accessor: 'Createduser' },
      { Header: Literals.Columns.Updateduser[Profile.Language], accessor: 'Updateduser' },
      { Header: Literals.Columns.Createtime[Profile.Language], accessor: 'Createtime' },
      { Header: Literals.Columns.Updatetime[Profile.Language], accessor: 'Updatetime' },
      { Header: Literals.Columns.approve[Profile.Language], accessor: 'approve', disableProps: true },
      { Header: Literals.Columns.edit[Profile.Language], accessor: 'edit', disableProps: true },
      { Header: Literals.Columns.delete[Profile.Language], accessor: 'delete', disableProps: true }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const metaKey = "Careplans"
    let initialConfig = getInitialconfig(Profile, metaKey)

    const list = (Careplans.list || []).map(item => {
      return {
        ...item,
        approve: item.Needapprove === true || item.Needapprove === 1
          ? item.Isapproved === true || item.Isapproved === 1
            ? <Icon size='large' color='black' name='minus' />
            : <Icon link size='large' color='red' name='hand pointer' onClick={() => {
              handleSelectedCareplan(item)
              handleApprovemodal(true)
            }}
            />
          : <Icon size='large' color='black' name='minus' />,
        edit: <Link to={`/Careplans/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
        delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
          handleSelectedCareplan(item)
          handleDeletemodal(true)
        }} />,
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
                    <Link to={"/Careplans"}>
                      <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <Settings
                  Profile={Profile}
                  Pagecreateheader={Literals.Page.Pagecreateheader[Profile.Language]}
                  Pagecreatelink={"/Careplans/Create"}
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
              </div> : <NoDataScreen message={Literals.Messages.Nocasefind[Profile.Language]} />
            }
          </Pagewrapper>
          <CareplansDelete />
          <CareplansApprove />
        </React.Fragment >
    )
  }

  patientCellhandler = (value) => {
    const { Patients, Patientdefines } = this.props
    if (Patientdefines.isLoading || Patients.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const patient = (Patients.list || []).find(u => u.Uuid === value)
      const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)
      return `${patientdefine?.Firstname} ${patientdefine?.Lastname}`
    }
  }

  dateCellhandler = (value) => {
    if (value) {
      return value.split('T').length > 0 ? value.split('T')[0] : value
    }
    return null
  }

  boolCellhandler = (value) => {
    const { Profile } = this.props
    return value !== null && (value ? Literals.Messages.Yes[Profile.Language] : Literals.Messages.No[Profile.Language])
  }

}