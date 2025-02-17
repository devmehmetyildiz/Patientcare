import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Confirm, Icon, Loader } from 'semantic-ui-react'
import { Breadcrumb, Grid, GridColumn } from 'semantic-ui-react'
import { DataTable, Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings } from '../../Components'
import PatienteventdefinesDelete from '../../Containers/Patienteventdefines/PatienteventdefinesDelete'
import GetInitialconfig from '../../Utils/GetInitialconfig'
import { COL_PROPS } from '../../Utils/Constants'
import privileges from '../../Constants/Privileges'

export default class Patienteventdefines extends Component {

  componentDidMount() {
    const { GetPatienteventdefines, } = this.props
    GetPatienteventdefines()
  }

  render() {
    const { Patienteventdefines, Profile, handleDeletemodal, handleSelectedPatienteventdefine, } = this.props
    const t = Profile?.i18n?.t
    const { isLoading } = Patienteventdefines


    const Columns = [
      { Header: t('Common.Column.Id'), accessor: 'Id' },
      { Header: t('Common.Column.Uuid'), accessor: 'Uuid' },
      { Header: t('Pages.Patienteventdefines.Column.Eventname'), accessor: 'Eventname', Title: true },
      { Header: t('Common.Column.Createduser'), accessor: 'Createduser' },
      { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser' },
      { Header: t('Common.Column.Createtime'), accessor: 'Createtime' },
      { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime' },
      { Header: t('Common.Column.edit'), accessor: 'edit', disableProps: true, role: privileges.patienteventdefineupdate },
      { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true, role: privileges.patienteventdefinedelete }
    ].map(u => { return u.disableProps ? u : { ...u, ...COL_PROPS } })

    const metaKey = "patienteventdefine"
    let initialConfig = GetInitialconfig(Profile, metaKey)

    const list = (Patienteventdefines.list || []).filter(u => u.Isactive).map(item => {
      return {
        ...item,
        edit: <Link to={`/Patienteventdefines/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
        delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
          handleSelectedPatienteventdefine(item)
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
                  <Link to={"/Patienteventdefines"}>
                    <Breadcrumb.Section>{t('Pages.Patienteventdefines.Page.Header')}</Breadcrumb.Section>
                  </Link>
                </Breadcrumb>
              </GridColumn>
              <Settings
                Profile={Profile}
                Pagecreateheader={t('Pages.Patienteventdefines.Page.CreateHeader')}
                Pagecreatelink={"/Patienteventdefines/Create"}
                Columns={Columns}
                list={list}
                initialConfig={initialConfig}
                metaKey={metaKey}
                Showcreatebutton
                Showcolumnchooser
                Showexcelexport
                CreateRole={privileges.patienteventdefineadd}
                ReportRole={privileges.patienteventdefinegetreport}
                ViewRole={privileges.patienteventdefinemanageview}
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
        <PatienteventdefinesDelete />
      </React.Fragment>
    )
  }
}