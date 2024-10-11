import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Grid, GridColumn, Icon, Loader } from 'semantic-ui-react'
import FilesDelete from '../../Containers/Files/FilesDelete'
import GetInitialconfig from '../../Utils/GetInitialconfig'
import { Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings, DataTable } from '../../Components'
export class Files extends Component {

  componentDidMount() {
    const { GetFiles, GetUsagetypes } = this.props
    GetFiles()
    GetUsagetypes()
  }

  render() {

    const { Files, Profile, handleSelectedFile, handleDeletemodal } = this.props

    const t = Profile?.i18n?.t

    const { isLoading } = Files

    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    const Columns = [
      { Header: t('Common.Column.Id'), accessor: 'Id' },
      { Header: t('Common.Column.Uuid'), accessor: 'Uuid' },
      { Header: t('Pages.Files.Column.Parent'), accessor: 'ParentID' },
      { Header: t('Pages.Files.Column.Name'), accessor: 'Name', Title: true },
      { Header: t('Pages.Files.Column.Filename'), accessor: 'Filename' },
      { Header: t('Pages.Files.Column.Filefolder'), accessor: 'Filefolder' },
      { Header: t('Pages.Files.Column.Filepath'), accessor: 'Filepath' },
      { Header: t('Pages.Files.Column.Filetype'), accessor: 'Filetype', Subtitle: true },
      { Header: t('Pages.Files.Column.Usagetype'), accessor: row => this.usagetypeCellhandler(row?.Usagetype), Lowtitle: true, Withtext: true },
      { Header: t('Common.Column.Createduser'), accessor: 'Createduser' },
      { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser' },
      { Header: t('Common.Column.Createtime'), accessor: 'Createtime' },
      { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime' },
      { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true, }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const metaKey = "file"
    let initialConfig = GetInitialconfig(Profile, metaKey)

    const list = (Files.list || []).map(item => {
      return {
        ...item,
        edit: <Link to={`/Files/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
        delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
          handleSelectedFile(item)
          handleDeletemodal(true)
        }}
        />
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
                    <Link to={"/Files"}>
                      <Breadcrumb.Section>{t('Pages.Files.Page.Header')}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <Settings
                  Profile={Profile}
                  Columns={Columns}
                  list={list}
                  initialConfig={initialConfig}
                  metaKey={metaKey}
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
          <FilesDelete />
        </React.Fragment>
    )
  }

  usagetypeCellhandler = (value) => {
    const { Usagetypes } = this.props
    if (Usagetypes.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return (value || '').split(',').map(type => (Usagetypes.list || []).find(u => u.Uuid === type)?.Name).join(',')
    }
  }
}
export default Files