import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Breadcrumb, Grid, GridColumn } from 'semantic-ui-react'
import { Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings, DataTable } from '../../Components'
import StocktypesDelete from '../../Containers/Stocktypes/StocktypesDelete'
import GetInitialconfig from '../../Utils/GetInitialconfig'

export default class Stocktypes extends Component {

  componentDidMount() {
    const { GetStocktypes } = this.props
    GetStocktypes()
  }

  render() {
    const { Stocktypes, Profile, handleDeletemodal, handleSelectedStocktype } = this.props

    const t = Profile?.i18n?.t

    const { isLoading } = Stocktypes

    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    const Columns = [
      { Header: t('Common.Column.Id'), accessor: 'Id' },
      { Header: t('Common.Column.Uuid'), accessor: 'Uuid' },
      { Header: t('Pages.Stocktypes.Column.Name'), accessor: 'Name', Title: true },
      { Header: t('Pages.Stocktypes.Column.Issktneed'), accessor: row => this.boolCellhandler(row?.Issktneed) },
      { Header: t('Pages.Stocktypes.Column.Isbarcodeneed'), accessor: row => this.boolCellhandler(row?.Isbarcodeneed) },
      { Header: t('Pages.Stocktypes.Column.Isredpill'), accessor: row => this.boolCellhandler(row?.Isredpill) },
      { Header: t('Pages.Stocktypes.Column.Info'), accessor: 'Info', Title: true },
      { Header: t('Common.Column.Createduser'), accessor: 'Createduser' },
      { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser' },
      { Header: t('Common.Column.Createtime'), accessor: 'Createtime' },
      { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime' },
      { Header: t('Common.Column.edit'), accessor: 'edit', disableProps: true },
      { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true, }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const metaKey = "stocktype"
    let initialConfig = GetInitialconfig(Profile, metaKey)

    const list = (Stocktypes.list || []).filter(u => u.Isactive).map(item => {
      return {
        ...item,
        edit: <Link to={`/Stocktypes/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
        delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
          handleSelectedStocktype(item)
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
                  <Link to={"/Stocktypes"}>
                    <Breadcrumb.Section>{t('Pages.Stocktypes.Page.Header')}</Breadcrumb.Section>
                  </Link>
                </Breadcrumb>
              </GridColumn>
              <Settings
                Profile={Profile}
                Pagecreateheader={t('Pages.Stocktypes.Page.CreateHeader')}
                Pagecreatelink={"/Stocktypes/Create"}
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
        <StocktypesDelete />
      </React.Fragment>
    )
  }


  boolCellhandler = (value) => {
    const { Profile } = this.props

    const t = Profile?.i18n?.t

    return value !== null && (value ? t('Common.Yes') : t('Common.No'))
  }
}