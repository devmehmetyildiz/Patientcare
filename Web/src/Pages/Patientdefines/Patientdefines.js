import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Loader, Breadcrumb, Grid, GridColumn } from 'semantic-ui-react'
import Literals from './Literals'
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
    const { isLoading } = Patientdefines

    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    const Columns = [
      { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id' },
      { Header: Literals.Columns.Uuid[Profile.Language], accessor: 'Uuid' },
      { Header: Literals.Columns.Firstname[Profile.Language], accessor: 'Firstname', Lowtitle: true, Withtext: true },
      { Header: Literals.Columns.Lastname[Profile.Language], accessor: 'Lastname', Lowtitle: true, Withtext: true },
      { Header: Literals.Columns.Fathername[Profile.Language], accessor: 'Fathername' },
      { Header: Literals.Columns.Mothername[Profile.Language], accessor: 'Mothername' },
      { Header: Literals.Columns.Motherbiologicalaffinity[Profile.Language], accessor: 'Motherbiologicalaffinity' },
      { Header: Literals.Columns.Ismotheralive[Profile.Language], accessor: row => this.boolCellhandler(row?.Ismotheralive) },
      { Header: Literals.Columns.Fatherbiologicalaffinity[Profile.Language], accessor: 'Fatherbiologicalaffinity' },
      { Header: Literals.Columns.Isfatheralive[Profile.Language], accessor: row => this.boolCellhandler(row?.Isfatheralive) },
      { Header: Literals.Columns.CountryID[Profile.Language], accessor: 'CountryID', Title: true },
      { Header: Literals.Columns.Dateofbirth[Profile.Language], accessor: row => this.dateCellhandler(row?.Dateofbirth) },
      { Header: Literals.Columns.Placeofbirth[Profile.Language], accessor: 'Placeofbirth' },
      { Header: Literals.Columns.Dateofdeath[Profile.Language], accessor: row => this.dateCellhandler(row?.Dateofdeath) },
      { Header: Literals.Columns.Placeofdeath[Profile.Language], accessor: 'Placeofdeath' },
      { Header: Literals.Columns.Deathinfo[Profile.Language], accessor: 'Deathinfo' },
      { Header: Literals.Columns.Gender[Profile.Language], accessor: 'Gender' },
      { Header: Literals.Columns.Marialstatus[Profile.Language], accessor: 'Marialstatus' },
      { Header: Literals.Columns.Criminalrecord[Profile.Language], accessor: 'Criminalrecord' },
      { Header: Literals.Columns.Childnumber[Profile.Language], accessor: 'Childnumber' },
      { Header: Literals.Columns.Disabledchildnumber[Profile.Language], accessor: 'Disabledchildnumber' },
      { Header: Literals.Columns.Siblingstatus[Profile.Language], accessor: 'Siblingstatus' },
      { Header: Literals.Columns.Sgkstatus[Profile.Language], accessor: 'Sgkstatus' },
      { Header: Literals.Columns.Budgetstatus[Profile.Language], accessor: 'Budgetstatus' },
      { Header: Literals.Columns.City[Profile.Language], accessor: 'City' },
      { Header: Literals.Columns.Town[Profile.Language], accessor: 'Town' },
      { Header: Literals.Columns.Address1[Profile.Language], accessor: 'Address1' },
      { Header: Literals.Columns.Address2[Profile.Language], accessor: 'Address2' },
      { Header: Literals.Columns.Country[Profile.Language], accessor: 'Country' },
      { Header: Literals.Columns.Contactnumber1[Profile.Language], accessor: 'Contactnumber1' },
      { Header: Literals.Columns.Contactnumber2[Profile.Language], accessor: 'Contactnumber2' },
      { Header: Literals.Columns.Contactname1[Profile.Language], accessor: 'Contactname1' },
      { Header: Literals.Columns.Contactname2[Profile.Language], accessor: 'Contactname2' },
      { Header: Literals.Columns.CostumertypeName[Profile.Language], accessor: row => this.costumertypeCellhandler(row?.CostumertypeID), Lowtitle: true, Withtext: true },
      { Header: Literals.Columns.PatienttypeName[Profile.Language], accessor: row => this.patienttypeCellhandler(row?.PatienttypeID), Subtitle: true, Withtext: true },
      { Header: Literals.Columns.Medicalboardreport[Profile.Language], accessor: 'Medicalboardreport' },
      { Header: Literals.Columns.Createduser[Profile.Language], accessor: 'Createduser' },
      { Header: Literals.Columns.Updateduser[Profile.Language], accessor: 'Updateduser' },
      { Header: Literals.Columns.Createtime[Profile.Language], accessor: 'Createtime' },
      { Header: Literals.Columns.Updatetime[Profile.Language], accessor: 'Updatetime' },
      { Header: Literals.Columns.edit[Profile.Language], accessor: 'edit', disableProps: true },
      { Header: Literals.Columns.delete[Profile.Language], accessor: 'delete', disableProps: true }
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
          <PatientdefinesDelete />
        </React.Fragment>
    )
  }

  boolCellhandler = (value) => {
    const { Profile } = this.props
    return value !== null && (value ? Literals.Messages.Yes[Profile.Language] : Literals.Messages.No[Profile.Language])
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