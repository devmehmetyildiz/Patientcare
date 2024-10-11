import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Breadcrumb, Grid, GridColumn, Loader } from 'semantic-ui-react'
import { Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings, DataTable } from '../../Components'
import StocktypegroupsDelete from '../../Containers/Stocktypegroups/StocktypegroupsDelete'
import GetInitialconfig from '../../Utils/GetInitialconfig'

export default class Stocktypegroups extends Component {

  componentDidMount() {
    const { GetStocktypegroups, GetStocktypes } = this.props
    GetStocktypegroups()
    GetStocktypes()
  }

  render() {
    const { Stocktypegroups, Profile, handleDeletemodal, handleSelectedStocktypegroup } = this.props

    const t = Profile?.i18n?.t

    const { isLoading } = Stocktypegroups

    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    const Columns = [
      { Header: t('Common.Column.Id'), accessor: 'Id' },
      { Header: t('Common.Column.Uuid'), accessor: 'Uuid' },
      { Header: t('Pages.Stocktypegroups.Column.Name'), accessor: 'Name', Title: true },
      { Header: t('Pages.Stocktypegroups.Column.Stocktypes'), accessor: row => this.stocktypesCellhandler(row?.Stocktypes), Lowtitle: true, Withtext: true },
      { Header: t('Pages.Stocktypegroups.Column.Info'), accessor: 'Info' },
      { Header: t('Common.Column.Createduser'), accessor: 'Createduser' },
      { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser' },
      { Header: t('Common.Column.Createtime'), accessor: 'Createtime' },
      { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime' },
      { Header: t('Common.Column.edit'), accessor: 'edit', disableProps: true },
      { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true, }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const metaKey = "stocktypegroup"
    let initialConfig = GetInitialconfig(Profile, metaKey)

    const list = (Stocktypegroups.list || []).map(item => {
      return {
        ...item,
        edit: <Link to={`/Stocktypegroups/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
        delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
          handleSelectedStocktypegroup(item)
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
                    <Link to={"/Stocktypegroups"}>
                      <Breadcrumb.Section>{t('Pages.Stocktypegroups.Page.Header')}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <Settings
                  Profile={Profile}
                  Pagecreateheader={t('Pages.Stocktypegroups.Page.CreateHeader')}
                  Pagecreatelink={"/Stocktypegroups/Create"}
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
          <StocktypegroupsDelete />
        </React.Fragment>
    )
  }

  stocktypesCellhandler = (value) => {
    const { Stocktypes } = this.props
    if (Stocktypes.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return (value || '').split(',').map(type => (Stocktypes.list || []).find(u => u.Uuid === type)?.Name).join(',')
    }
  }

  boolCellhandler = (value) => {
    const { Profile } = this.props

    const t = Profile?.i18n?.t

    return value !== null && (value ? t('Common.Yes') : t('Common.No'))
  }
}