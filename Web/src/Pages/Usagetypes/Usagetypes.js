import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from 'semantic-ui-react'
import { Breadcrumb, Grid, GridColumn } from 'semantic-ui-react'
import GetInitialconfig from '../../Utils/GetInitialconfig'
import { DataTable, Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings } from '../../Components'
import UsagetypesDelete from '../../Containers/Usagetypes/UsagetypesDelete'
import { COL_PROPS } from '../../Utils/Constants'
import privileges from '../../Constants/Privileges'

export default class Usagetypes extends Component {

  componentDidMount() {
    const { GetUsagetypes } = this.props
    GetUsagetypes()
  }

  render() {
    const { Usagetypes, Profile, handleDeletemodal, handleSelectedUsagetype } = this.props

    const t = Profile?.i18n?.t

    const { isLoading } = Usagetypes

    const Columns = [
      { Header: t('Common.Column.Id'), accessor: 'Id' },
      { Header: t('Common.Column.Uuid'), accessor: 'Uuid' },
      { Header: t('Pages.Usagetypes.Column.Name'), accessor: 'Name', Title: true },
      { Header: t('Pages.Usagetypes.Column.Value'), accessor: 'Value' },
      { Header: t('Pages.Usagetypes.Column.Isrequiredpatientusagetype'), accessor: row => this.boolCellhandler(row?.Isrequiredpatientusagetype), Lowtitle: true, Withtext: true },
      { Header: t('Pages.Usagetypes.Column.Isrequiredpersonelusagetype'), accessor: row => this.boolCellhandler(row?.Isrequiredpersonelusagetype), Lowtitle: true, Withtext: true },
      { Header: t('Common.Column.Createduser'), accessor: 'Createduser' },
      { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser' },
      { Header: t('Common.Column.Createtime'), accessor: 'Createtime' },
      { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime' },
      { Header: t('Common.Column.edit'), accessor: 'edit', disableProps: true, role: privileges.usagetypeupdate },
      { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true, role: privileges.usagetypedelete }
    ].map(u => { return u.disableProps ? u : { ...u, ...COL_PROPS } })

    const metaKey = "usagetype"
    let initialConfig = GetInitialconfig(Profile, metaKey)

    const list = (Usagetypes.list || []).filter(u => u.Isactive).map(item => {
      return {
        ...item,
        edit: <Link to={`/Usagetypes/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
        delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
          handleSelectedUsagetype(item)
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
                    <Link to={"/Usagetypes"}>
                      <Breadcrumb.Section>{t('Pages.Usagetypes.Page.Header')}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <Settings
                  Profile={Profile}
                  Pagecreateheader={t('Pages.Usagetypes.Page.CreateHeader')}
                  Pagecreatelink={"/Usagetypes/Create"}
                  Columns={Columns}
                  list={list}
                  initialConfig={initialConfig}
                  metaKey={metaKey}
                  Showcreatebutton
                  Showcolumnchooser
                  Showexcelexport
                  CreateRole={privileges.usagetypeadd}
                  ReportRole={privileges.usagetypegetreport}
                  ViewRole={privileges.usagetypemanageview}
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
          <UsagetypesDelete />
        </React.Fragment>
    )
  }

  boolCellhandler = (value) => {
    const { Profile } = this.props
    const t = Profile?.i18n?.t
    return value !== null ? (value ? t('Common.Yes') : t('Common.No')) : t('Common.No')
  }
}