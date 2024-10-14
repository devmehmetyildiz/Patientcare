import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Breadcrumb, Grid, GridColumn } from 'semantic-ui-react'
import { Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings, DataTable } from '../../Components'
import ShiftdefinesDelete from '../../Containers/Shiftdefines/ShiftdefinesDelete'
import GetInitialconfig from '../../Utils/GetInitialconfig'

export default class Shiftdefines extends Component {

  componentDidMount() {
    const { GetShiftdefines } = this.props
    GetShiftdefines()
  }

  render() {
    const { Shiftdefines, Profile, handleDeletemodal, handleSelectedShiftdefine } = this.props

    const t = Profile?.i18n?.t

    const { isLoading } = Shiftdefines

    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    const Columns = [
      { Header: t('Common.Column.Id'), accessor: 'Id' },
      { Header: t('Common.Column.Uuid'), accessor: 'Uuid' },
      { Header: t('Pages.Shiftdefines.Column.Name'), accessor: 'Name', Title: true },
      { Header: t('Pages.Shiftdefines.Column.Starttime'), accessor: 'Starttime', Lowtitle: true, Withtext: true },
      { Header: t('Pages.Shiftdefines.Column.Endtime'), accessor: 'Endtime', Lowtitle: true, Withtext: true },
      { Header: t('Pages.Shiftdefines.Column.Priority'), accessor: 'Priority', Subtitle: true, Withtext: true },
      { Header: t('Pages.Shiftdefines.Column.Isjoker'), accessor: row => this.boolCellhandler(row?.Isjoker) },
      { Header: t('Common.Column.Createduser'), accessor: 'Createduser' },
      { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser' },
      { Header: t('Common.Column.Createtime'), accessor: 'Createtime' },
      { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime' },
      { Header: t('Common.Column.edit'), accessor: 'edit', disableProps: true },
      { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true, }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const metaKey = "shiftdefine"
    let initialConfig = GetInitialconfig(Profile, metaKey)

    const list = (Shiftdefines.list || []).filter(u => u.Isactive).map(item => {
      return {
        ...item,
        edit: <Link to={`/Shiftdefines/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
        delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
          handleSelectedShiftdefine(item)
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
                    <Link to={"/Shiftdefines"}>
                      <Breadcrumb.Section>{t('Pages.Shiftdefines.Page.Header')}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <Settings
                  Profile={Profile}
                  Pagecreateheader={t('Pages.Shiftdefines.Page.CreateHeader')}
                  Pagecreatelink={"/Shiftdefines/Create"}
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
          <ShiftdefinesDelete />
        </React.Fragment>
    )
  }

  boolCellhandler = (value) => {
    const { Profile } = this.props
    const t = Profile?.i18n?.t
    return value !== null && (value ? t('Common.Yes') : t('Common.No'))
  }
}