import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Grid, GridColumn, Icon, Loader } from 'semantic-ui-react'
import FilesDelete from '../../Containers/Files/FilesDelete'
import GetInitialconfig from '../../Utils/GetInitialconfig'
import { Headerwrapper, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings, DataTable, Filepreview } from '../../Components'
import { COL_PROPS } from '../../Utils/Constants'

export default function Files(props) {
  const { GetFiles, GetUsagetypes, fillFilenotification } = props
  const { Usagetypes, Files, Profile } = props

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [record, setRecord] = useState(null)
  const [selectedfile, setSelectedfile] = useState(null)

  const t = Profile?.i18n?.t

  const { isLoading } = Files

  const usagetypeCellhandler = (value) => {
    if (Usagetypes.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return (value || '').split(',').map(type => (Usagetypes.list || []).find(u => u.Uuid === type)?.Name).join(',')
    }
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
    { Header: t('Pages.Files.Column.Usagetype'), accessor: row => usagetypeCellhandler(row?.Usagetype), Lowtitle: true, Withtext: true },
    { Header: t('Common.Column.Createduser'), accessor: 'Createduser' },
    { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser' },
    { Header: t('Common.Column.Createtime'), accessor: 'Createtime' },
    { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime' },
    { Header: t('Common.Column.preview'), accessor: 'preview', disableProps: true, },
    { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true, }
  ].map(u => { return u.disableProps ? u : { ...u, ...COL_PROPS } })

  const metaKey = "file"
  let initialConfig = GetInitialconfig(Profile, metaKey)

  const list = (Files.list || []).filter(u => u.Isactive).map(item => {
    return {
      ...item,
      edit: <Link to={`/Files/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
      preview: <Icon link size='large' color='blue' name='file' onClick={() => {
        setSelectedfile(item?.Uuid || '')
      }}
      />,
      delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
        setRecord(item)
        setDeleteOpen(true)
      }}
      />
    }
  })

  useEffect(() => {
    GetFiles()
    GetUsagetypes()
  }, [])

  return (
    <React.Fragment>
      <Pagewrapper dimmer isLoading={isLoading}>
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
      <FilesDelete
        open={deleteOpen}
        setOpen={setDeleteOpen}
        record={record}
        setRecord={setRecord}
      />
      <Filepreview
        fileurl={selectedfile}
        setFileurl={setSelectedfile}
        Profile={Profile}
        fillnotification={fillFilenotification}
      />
    </React.Fragment>
  )
}