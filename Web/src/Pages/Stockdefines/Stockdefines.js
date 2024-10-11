import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Breadcrumb, Grid, GridColumn, Loader } from 'semantic-ui-react'
import { Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings, DataTable } from '../../Components'
import StockdefinesDelete from '../../Containers/Stockdefines/StockdefinesDelete'
import GetInitialconfig from '../../Utils/GetInitialconfig'

export default class Stockdefines extends Component {

  componentDidMount() {
    const { GetStockdefines, GetDepartments, GetUnits } = this.props
    GetStockdefines()
    GetDepartments()
    GetUnits()
  }

  render() {
    const { Stockdefines, Profile, handleDeletemodal, handleSelectedStockdefine } = this.props

    const t = Profile?.i18n?.t

    const { isLoading } = Stockdefines

    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    const Columns = [
      { Header: t('Common.Column.Id'), accessor: 'Id' },
      { Header: t('Common.Column.Uuid'), accessor: 'Uuid' },
      { Header: t('Pages.Stockdefines.Column.Name'), accessor: 'Name', Title: true },
      { Header: t('Pages.Stockdefines.Column.Stocktype'), accessor: row => this.stocktypeCellhandler(row?.StocktypeID), },
      { Header: t('Pages.Stockdefines.Column.Brand'), accessor: 'Brand', },
      { Header: t('Pages.Stockdefines.Column.Barcode'), accessor: 'Barcode', },
      { Header: t('Pages.Stockdefines.Column.Unit'), accessor: row => this.unitCellhandler(row?.UnitID), },
      { Header: t('Pages.Stockdefines.Column.Info'), accessor: 'Info', },
      { Header: t('Common.Column.Createduser'), accessor: 'Createduser' },
      { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser' },
      { Header: t('Common.Column.Createtime'), accessor: 'Createtime' },
      { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime' },
      { Header: t('Common.Column.edit'), accessor: 'edit', disableProps: true },
      { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true, }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const metaKey = "stockdefine"
    let initialConfig = GetInitialconfig(Profile, metaKey)

    const list = (Stockdefines.list || []).map(item => {
      return {
        ...item,
        edit: <Link to={`/Stockdefines/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
        delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
          handleSelectedStockdefine(item)
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
                    <Link to={"/Stockdefines"}>
                      <Breadcrumb.Section>{t('Pages.Stockdefines.Page.Header')}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <Settings
                  Profile={Profile}
                  Pagecreateheader={t('Pages.Stockdefines.Page.CreateHeader')}
                  Pagecreatelink={"/Stockdefines/Create"}
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
          <StockdefinesDelete />
        </React.Fragment>
    )
  }



  unitCellhandler = (value) => {
    const { Units } = this.props
    if (Units.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return (Units.list || []).find(u => u.Uuid === value)?.Name
    }
  }

  stocktypeCellhandler = (value) => {
    const { Stocktypes } = this.props
    if (Stocktypes.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return (Stocktypes.list || []).find(u => u.Uuid === value)?.Name
    }
  }

  boolCellhandler = (value) => {
    const { Profile } = this.props

    const t = Profile?.i18n?.t

    return value !== null && (value ? t('Common.Yes') : t('Common.No'))
  }
}