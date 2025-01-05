import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Confirm, Icon, Loader } from 'semantic-ui-react'
import { Breadcrumb, Grid, GridColumn } from 'semantic-ui-react'
import { DataTable, Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings } from '../../Components'
import PatienthealthcasedefinesDelete from '../../Containers/Patienthealthcasedefines/PatienthealthcasedefinesDelete'
import GetInitialconfig from '../../Utils/GetInitialconfig'

export default class Patienthealthcasedefines extends Component {

  componentDidMount() {
    const { GetPatienthealthcasedefines, } = this.props
    GetPatienthealthcasedefines()
  }

  render() {
    const { Patienthealthcasedefines, Profile, handleDeletemodal, handleSelectedPatienthealthcasedefine, } = this.props
    const t = Profile?.i18n?.t
    const { isLoading } = Patienthealthcasedefines

    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    const Columns = [
      { Header: t('Common.Column.Id'), accessor: 'Id' },
      { Header: t('Common.Column.Uuid'), accessor: 'Uuid' },
      { Header: t('Pages.Patienthealthcasedefines.Column.Name'), accessor: 'Name', Title: true },
      { Header: t('Common.Column.Createduser'), accessor: 'Createduser' },
      { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser' },
      { Header: t('Common.Column.Createtime'), accessor: 'Createtime' },
      { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime' },
      { Header: t('Common.Column.edit'), accessor: 'edit', disableProps: true },
      { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true, }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const metaKey = "patienthealthcasedefine"
    let initialConfig = GetInitialconfig(Profile, metaKey)

    const list = (Patienthealthcasedefines.list || []).filter(u => u.Isactive).map(item => {
      return {
        ...item,
        edit: <Link to={`/Patienthealthcasedefines/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
        delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
          handleSelectedPatienthealthcasedefine(item)
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
                  <Link to={"/Patienthealthcasedefines"}>
                    <Breadcrumb.Section>{t('Pages.Patienthealthcasedefines.Page.Header')}</Breadcrumb.Section>
                  </Link>
                </Breadcrumb>
              </GridColumn>
              <Settings
                Profile={Profile}
                Pagecreateheader={t('Pages.Patienthealthcasedefines.Page.CreateHeader')}
                Pagecreatelink={"/Patienthealthcasedefines/Create"}
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
        <PatienthealthcasedefinesDelete />
      </React.Fragment>
    )
  }
}