import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Grid, GridColumn, Icon, Loader } from 'semantic-ui-react'
import FilesDelete from '../../Containers/Files/FilesDelete'
import Literals from './Literals'
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
    const { isLoading } = Files

    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    const Columns = [
      { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id' },
      { Header: Literals.Columns.Uuid[Profile.Language], accessor: 'Uuid' },
      { Header: Literals.Columns.ParentID[Profile.Language], accessor: 'ParentID' },
      { Header: Literals.Columns.Name[Profile.Language], accessor: 'Name', Title: true },
      { Header: Literals.Columns.Filename[Profile.Language], accessor: 'Filename' },
      { Header: Literals.Columns.Filefolder[Profile.Language], accessor: 'Filefolder' },
      { Header: Literals.Columns.Filepath[Profile.Language], accessor: 'Filepath' },
      { Header: Literals.Columns.Filetype[Profile.Language], accessor: 'Filetype', Subtitle: true },
      { Header: Literals.Columns.Usagetype[Profile.Language], accessor: row => this.usagetypeCellhandler(row?.Usagetype), Lowtitle: true, Withtext: true },
      { Header: Literals.Columns.Createduser[Profile.Language], accessor: 'Createduser' },
      { Header: Literals.Columns.Updateduser[Profile.Language], accessor: 'Updateduser' },
      { Header: Literals.Columns.Createtime[Profile.Language], accessor: 'Createtime' },
      { Header: Literals.Columns.Updatetime[Profile.Language], accessor: 'Updatetime' },
      { Header: Literals.Columns.delete[Profile.Language], accessor: 'delete', disableProps: true }
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
      isLoading  ? <LoadingPage /> :
        <React.Fragment>
          <Pagewrapper>
            <Headerwrapper>
              <Grid columns='2' >
                <GridColumn width={8}>
                  <Breadcrumb size='big'>
                    <Link to={"/Files"}>
                      <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <Settings
                  Profile={Profile}
                  Pagecreateheader={Literals.Page.Pagecreateheader[Profile.Language]}
                  Pagecreatelink={"/Files/Create"}
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
              </div> : <NoDataScreen message={Literals.Messages.Nodatafind[Profile.Language]} />
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