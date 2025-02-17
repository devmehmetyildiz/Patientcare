import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Breadcrumb, Grid, GridColumn } from 'semantic-ui-react'
import PatientcashregistersDelete from '../../Containers/Patientcashregisters/PatientcashregistersDelete'
import { Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings, DataTable } from '../../Components'
import GetInitialconfig from '../../Utils/GetInitialconfig'
import privileges from '../../Constants/Privileges'
import { COL_PROPS } from '../../Utils/Constants'

export default class Patientcashregisters extends Component {

  componentDidMount() {
    const { GetPatientcashregisters } = this.props
    GetPatientcashregisters()
  }


  render() {
    const { Patientcashregisters, Profile, handleDeletemodal, handleSelectedPatientcashregister } = this.props

    const t = Profile?.i18n?.t

    const { isLoading } = Patientcashregisters

    const Columns = [
      { Header: t('Common.Column.Id'), accessor: 'Id' },
      { Header: t('Common.Column.Uuid'), accessor: 'Uuid' },
      { Header: t('Pages.Patientcashregisters.Column.Name'), accessor: 'Name', Title: true },
      { Header: t('Pages.Patientcashregisters.Column.Iseffectcompany'), accessor: row => this.boolCellhandler(row?.Iseffectcompany), Lowtitle: true, Withtext: true },
      { Header: t('Common.Column.Createduser'), accessor: 'Createduser' },
      { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser' },
      { Header: t('Common.Column.Createtime'), accessor: 'Createtime' },
      { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime' },
      { Header: t('Common.Column.edit'), accessor: 'edit', disableProps: true, role: privileges.patientcashregisterupdate },
      { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true, role: privileges.patientcashregisterdelete }
    ].map(u => { return u.disableProps ? u : { ...u, ...COL_PROPS } })

    const metaKey = "patientcashregister"
    let initialConfig = GetInitialconfig(Profile, metaKey)

    const list = (Patientcashregisters.list || []).filter(u => u.Isactive).map(item => {
      return {
        ...item,
        edit: <Link to={`/Patientcashregisters/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
        delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
          handleSelectedPatientcashregister(item)
          handleDeletemodal(true)
        }} />
      }
    })

    return (
      <React.Fragment>
        <Pagewrapper dimmer isLoading={isLoading}>
          <Headerwrapper>
            <Grid columns='2' >
              <GridColumn width={8}>
                <Breadcrumb size='big'>
                  <Link to={"/Patientcashregisters"}>
                    <Breadcrumb.Section>{t('Pages.Patientcashregisters.Page.Header')}</Breadcrumb.Section>
                  </Link>
                </Breadcrumb>
              </GridColumn>
              <Settings
                Profile={Profile}
                Pagecreateheader={t('Pages.Patientcashregisters.Page.CreateHeader')}
                Pagecreatelink={"/Patientcashregisters/Create"}
                Columns={Columns}
                list={list}
                initialConfig={initialConfig}
                metaKey={metaKey}
                Showcreatebutton
                Showcolumnchooser
                Showexcelexport
                CreateRole={privileges.patientcashregisteradd}
                ReportRole={privileges.patientcashregistergetreport}
                ViewRole={privileges.patientcashregistermanageview}
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
        <PatientcashregistersDelete />
      </React.Fragment>
    )
  }

  boolCellhandler = (value) => {
    const { Profile } = this.props
    const t = Profile?.i18n?.t

    return value !== null && (value ? t('Common.Yes') : t('Common.No'))
  }
}