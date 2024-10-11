import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Breadcrumb, Grid, GridColumn, Loader } from 'semantic-ui-react'
import { DataTable, Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings } from '../../Components'
import WarehousesDelete from '../../Containers/Warehouses/WarehousesDelete'
import GetInitialconfig from '../../Utils/GetInitialconfig'

export default class Warehouses extends Component {

  componentDidMount() {
    const { GetWarehouses } = this.props
    GetWarehouses()
  }

  render() {
    const { Warehouses, handleDeletemodal, handleSelectedWarehouse, Profile } = this.props

    const t = Profile?.i18n?.t

    const { isLoading } = Warehouses

    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    const Columns = [
     /*  { Header: '', id: 'expander', accessor: 'expander', Cell: col => this.expandCellhandler(col), disableProps: true, disableMobile: true }, */
      { Header: t('Common.Column.Id'), accessor: 'Id' },
      { Header: t('Common.Column.Uuid'), accessor: 'Uuid' },
      { Header: t('Pages.Warehouses.Column.Name'), accessor: 'Name', Title: true },
      { Header: t('Pages.Warehouses.Column.Info'), accessor: 'Info', },
      { Header: t('Common.Column.Createduser'), accessor: 'Createduser' },
      { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser' },
      { Header: t('Common.Column.Createtime'), accessor: 'Createtime' },
      { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime' },
      { Header: t('Common.Column.edit'), accessor: 'edit', disableProps: true },
      { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true, }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const metaKey = "warehouse"
    let initialConfig = GetInitialconfig(Profile, metaKey)

    const list = (Warehouses.list || []).filter(u => u.Isactive).map(item => {
      return {
        ...item,
        edit: <Link to={`/Warehouses/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
        delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
          handleSelectedWarehouse(item)
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
                    <Link to={"/Warehouses"}>
                      <Breadcrumb.Section>{t('Pages.Warehouses.Page.Header')}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <Settings
                  Profile={Profile}
                  Pagecreateheader={t('Pages.Warehouses.Page.CreateHeader')}
                  Pagecreatelink={"/Warehouses/Create"}
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
          <WarehousesDelete />
        </React.Fragment>
    )
  }

  boolCellhandler = (value) => {
    const { Profile } = this.props
    const t = Profile?.i18n?.t
    return value !== null && (value ? t('Common.Yes') : t('Common.No'))
  }

  expandCellhandler = (col) => {
    const { Profile } = this.props
    return (!Profile.Ismobile && col?.row) && <span {...col?.row?.getToggleRowExpandedProps()}>
      {col?.row?.isExpanded ? <Icon name='triangle down' /> : <Icon name='triangle right' />}
    </span>
  }
}