import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Loader, Breadcrumb, Grid, GridColumn } from 'semantic-ui-react'
import PatientdefinesDelete from "../../Containers/Patientdefines/PatientdefinesDelete"
import { Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings, DataTable } from '../../Components'
import GetInitialconfig from '../../Utils/GetInitialconfig'
export default class Patientdefines extends Component {

  componentDidMount() {
    const { GetPatientdefines, GetPatienttypes, GetCostumertypes } = this.props
    GetPatientdefines()
    GetPatienttypes()
    GetCostumertypes()
  }


  render() {

    const { Patientdefines, Profile, handleSelectedPatientdefine, handleDeletemodal } = this.props

    const t = Profile?.i18n?.t

    const { isLoading } = Patientdefines

    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    const Columns = [
      { Header: t('Common.Column.Id'), accessor: 'Id' },
      { Header: t('Common.Column.Uuid'), accessor: 'Uuid' },
      { Header: t('Pages.Patientdefines.Column.Firstname'), accessor: 'Firstname', Lowtitle: true, Withtext: true },
      { Header: t('Pages.Patientdefines.Column.Lastname'), accessor: 'Lastname', Lowtitle: true, Withtext: true },
      { Header: t('Pages.Patientdefines.Column.Fathername'), accessor: 'Fathername' },
      { Header: t('Pages.Patientdefines.Column.Mothername'), accessor: 'Mothername' },
      { Header: t('Pages.Patientdefines.Column.Motherbiologicalaffinity'), accessor: 'Motherbiologicalaffinity' },
      { Header: t('Pages.Patientdefines.Column.Ismotheralive'), accessor: row => this.boolCellhandler(row?.Ismotheralive) },
      { Header: t('Pages.Patientdefines.Column.Fatherbiologicalaffinity'), accessor: 'Fatherbiologicalaffinity' },
      { Header: t('Pages.Patientdefines.Column.Isfatheralive'), accessor: row => this.boolCellhandler(row?.Isfatheralive) },
      { Header: t('Pages.Patientdefines.Column.CountryID'), accessor: 'CountryID', Title: true },
      { Header: t('Pages.Patientdefines.Column.Dateofbirth'), accessor: row => this.dateCellhandler(row?.Dateofbirth) },
      { Header: t('Pages.Patientdefines.Column.Placeofbirth'), accessor: 'Placeofbirth' },
      { Header: t('Pages.Patientdefines.Column.Gender'), accessor: 'Gender' },
      { Header: t('Pages.Patientdefines.Column.Marialstatus'), accessor: 'Marialstatus' },
      { Header: t('Pages.Patientdefines.Column.Criminalrecord'), accessor: 'Criminalrecord' },
      { Header: t('Pages.Patientdefines.Column.Childnumber'), accessor: 'Childnumber' },
      { Header: t('Pages.Patientdefines.Column.Disabledchildnumber'), accessor: 'Disabledchildnumber' },
      { Header: t('Pages.Patientdefines.Column.Siblingstatus'), accessor: 'Siblingstatus' },
      { Header: t('Pages.Patientdefines.Column.Sgkstatus'), accessor: 'Sgkstatus' },
      { Header: t('Pages.Patientdefines.Column.Budgetstatus'), accessor: 'Budgetstatus' },
      { Header: t('Pages.Patientdefines.Column.City'), accessor: 'City' },
      { Header: t('Pages.Patientdefines.Column.Town'), accessor: 'Town' },
      { Header: t('Pages.Patientdefines.Column.Address1'), accessor: 'Address1' },
      { Header: t('Pages.Patientdefines.Column.Address2'), accessor: 'Address2' },
      { Header: t('Pages.Patientdefines.Column.Country'), accessor: 'Country' },
      { Header: t('Pages.Patientdefines.Column.Contactnumber1'), accessor: 'Contactnumber1' },
      { Header: t('Pages.Patientdefines.Column.Contactnumber2'), accessor: 'Contactnumber2' },
      { Header: t('Pages.Patientdefines.Column.Contactname1'), accessor: 'Contactname1' },
      { Header: t('Pages.Patientdefines.Column.Contactname2'), accessor: 'Contactname2' },
      { Header: t('Pages.Patientdefines.Column.CostumertypeID'), accessor: row => this.costumertypeCellhandler(row?.CostumertypeID), Lowtitle: true, Withtext: true },
      { Header: t('Pages.Patientdefines.Column.PatienttypeID'), accessor: row => this.patienttypeCellhandler(row?.PatienttypeID), Subtitle: true, Withtext: true },
      { Header: t('Pages.Patientdefines.Column.Medicalboardreport'), accessor: 'Medicalboardreport' },
      { Header: t('Pages.Patientdefines.Column.Dependency'), accessor: 'Dependency' },
      { Header: t('Common.Column.Createduser'), accessor: 'Createduser' },
      { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser' },
      { Header: t('Common.Column.Createtime'), accessor: 'Createtime' },
      { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime' },
      { Header: t('Common.Column.edit'), accessor: 'edit', disableProps: true },
      { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true, }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const metaKey = "patientdefine"
    let initialConfig = GetInitialconfig(Profile, metaKey)

    const list = (Patientdefines.list || []).filter(u => u.Isactive).map(item => {
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
      isLoading ? <LoadingPage /> :
        <React.Fragment>
          <Pagewrapper>
            <Headerwrapper>
              <Grid columns='2' >
                <GridColumn width={8}>
                  <Breadcrumb size='big'>
                    <Link to={"/Patientdefines"}>
                      <Breadcrumb.Section>{t('Pages.Patientdefines.Page.Header')}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <Settings
                  Profile={Profile}
                  Pagecreateheader={t('Pages.Patientdefines.Page.CreateHeader')}
                  Pagecreatelink={"/Patientdefines/Create"}
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
          <PatientdefinesDelete />
        </React.Fragment>
    )
  }

  boolCellhandler = (value) => {
    const { Profile } = this.props
    const t = Profile?.i18n?.t
    return value !== null && (value ? t('Common.Yes') : t('Common.No'))
  }

  costumertypeCellhandler = (value) => {
    const { Costumertypes } = this.props
    if (Costumertypes.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return (Costumertypes.list || []).find(u => u.Uuid === value)?.Name
    }
  }

  dateCellhandler = (value) => {
    if (value) {
      return value.split('T')[0]
    }
    return null
  }


  patienttypeCellhandler = (value) => {
    const { Patienttypes } = this.props
    if (Patienttypes.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return (Patienttypes.list || []).find(u => u.Uuid === value)?.Name
    }
  }

}