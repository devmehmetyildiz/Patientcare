import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Loader, Breadcrumb, Grid, GridColumn } from 'semantic-ui-react'
import PatientcashmovementsDelete from '../../Containers/Patientcashmovements/PatientcashmovementsDelete'
import { CASHYPES } from '../../Utils/Constants'
import { Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings, DataTable } from '../../Components'
import GetInitialconfig from '../../Utils/GetInitialconfig'

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

    const t = Profile?.i18n?.t

    const { isLoading } = Patientcashmovements

    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    const Columns = [
      { Header: t('Common.Column.Id'), accessor: 'Id' },
      { Header: t('Common.Column.Uuid'), accessor: 'Uuid' },
      { Header: t('Pages.Patientcashmovements.Column.Patient'), accessor: row => this.patientCellhandler(row?.PatientID), Title: true },
      { Header: t('Pages.Patientcashmovements.Column.Register'), accessor: row => this.registerCellhandler(row?.RegisterID), Subtitle: true },
      { Header: t('Pages.Patientcashmovements.Column.Movementtype'), accessor: row => this.typeCellhandler(row?.Movementtype), Lowtitle: true, Withtext: true },
      { Header: t('Pages.Patientcashmovements.Column.Movementvalue'), accessor: row => this.cashCellhandler(row?.Movementvalue), Lowtitle: true, Withtext: true },
      { Header: t('Common.Column.Createduser'), accessor: 'Createduser' },
      { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser' },
      { Header: t('Common.Column.Createtime'), accessor: 'Createtime' },
      { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime' },
      { Header: t('Common.Column.edit'), accessor: 'edit', disableProps: true },
      { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true, }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const metaKey = "patientcashmovement"
    let initialConfig = GetInitialconfig(Profile, metaKey)

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
      isLoading ? <LoadingPage /> :
        <React.Fragment>
          <Pagewrapper>
            <Headerwrapper>
              <Grid columns='2' >
                <GridColumn width={8}>
                  <Breadcrumb size='big'>
                    <Link to={"/Patientcashmovements"}>
                      <Breadcrumb.Section>{t('Pages.Patientcashmovements.Page.Header')}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <Settings
                  Profile={Profile}
                  Pagecreateheader={t('Pages.Patientcashmovements.Page.CreateHeader')}
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
              </div> : <NoDataScreen message={t('Common.NoDataFound')} />
            }
          </Pagewrapper>
          <PatientcashmovementsDelete />
        </React.Fragment>
    )
  }

  typeCellhandler = (value) => {
    return CASHYPES.find(u => u.value === value) ? CASHYPES.find(u => u.value === value).Name : value
  }

  cashCellhandler = (value) => {
    return value + ' TL'
  }

  patientCellhandler = (value) => {
    const { Patients, Patientdefines } = this.props
    if (Patientdefines.isLoading || Patients.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const patient = (Patients.list || []).find(u => u.Uuid === value)
      const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)
      return `${patientdefine?.Firstname} ${patientdefine?.Lastname}-${patientdefine?.CountryID}`
    }
  }

  registerCellhandler = (value) => {
    const { Patientcashregisters, Profile } = this.props
    const t = Profile?.i18n?.t
    if (Patientcashregisters.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const register = (Patientcashregisters.list || []).find(u => u.Uuid === value)
      return register?.Name || t('Common.NoDataFound')
    }
  }
}