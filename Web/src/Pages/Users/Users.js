import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Breadcrumb, Grid, GridColumn, Tab, Loader } from 'semantic-ui-react'
import { Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings, DataTable, Contentwrapper } from '../../Components'
import UsersDelete from '../../Containers/Users/UsersDelete'
import GetInitialconfig from '../../Utils/GetInitialconfig'
import Formatdate from '../../Utils/Formatdate'
import UsersLeft from '../../Containers/Users/UsersLeft'

export default function Users(props) {

  const { GetUsers, GetRoles, GetCases, GetProfessions, Users, Profile, handleDeletemodal, handleSelectedUser, Cases, Professions } = props

  const [record, setRecord] = useState(null)
  const [isLeftModalOpen, setIsLeftModalOpen] = useState(false)

  const t = Profile?.i18n?.t
  const { isLoading } = Users

  useEffect(() => {
    GetUsers()
    GetRoles()
    GetCases()
    GetProfessions()
  }, [])

  const list = (Users.list || []).filter(u => u.Isactive).map(item => {
    return {
      ...item,
      detail: <Link to={`/Users/${item.Uuid}`} ><Icon size='large' color='grey' name='history' /></Link>,
      edit: <Link to={`/Users/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
      delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
        handleSelectedUser(item)
        handleDeletemodal(true)
      }} />,
      remove: <Icon link size='large' color='red' name='recycle' onClick={() => {
        setRecord(item)
        setIsLeftModalOpen(true)
      }} />
    }
  })

  const workerList = list.filter(u => u.Isworker && u.Isworking)
  const leftList = list.filter(u => u.Isworker && !u.Isworking)
  const appList = list.filter(u => !u.Isworker)

  return (
    <React.Fragment>
      <Pagewrapper dimmer isLoading={isLoading}>
        <Headerwrapper>
          <Grid columns='2' >
            <GridColumn width={8}>
              <Breadcrumb size='big'>
                <Link to={"/Users"}>
                  <Breadcrumb.Section>{t('Pages.Users.Page.Header')}</Breadcrumb.Section>
                </Link>
              </Breadcrumb>
            </GridColumn>
            <Settings
              Profile={Profile}
              Pagecreateheader={t('Pages.Users.Page.CreateHeader')}
              Pagecreatelink={"/Users/Create"}
              Showcreatebutton
            />
          </Grid>
        </Headerwrapper>
        <Pagedivider />
        <Contentwrapper>
          <Tab
            className="w-full !bg-transparent"
            panes={[
              {
                menuItem: `${t('Pages.Users.Page.Tab.Worketlist')} (${(workerList || []).length})`,
                pane: {
                  key: 'worker',
                  content: <UsersWorkerList
                    Profile={Profile}
                    Cases={Cases}
                    Professions={Professions}
                    list={workerList.filter(u => u.Isworking)}
                  />
                }
              },
              {
                menuItem: `${t('Pages.Users.Page.Tab.LeftWorketlist')} (${leftList.length})`,
                pane: {
                  key: 'workerleft',
                  content: <UsersWorkerleftList
                    Profile={Profile}
                    Professions={Professions}
                    list={leftList}
                  />
                }
              },
              {
                menuItem: `${t('Pages.Users.Page.Tab.Appuserlist')} (${(appList || []).length})`,
                pane: {
                  key: 'app',
                  content: <UsersAppList
                    Profile={Profile}
                    list={appList}
                  />
                }
              },
            ]}
            renderActiveOnly={false}
          />
        </Contentwrapper>
      </Pagewrapper>
      <UsersDelete />
      <UsersLeft
        record={record}
        setRecord={setRecord}
        open={isLeftModalOpen}
        setOpen={setIsLeftModalOpen}
      />
    </React.Fragment>
  )
}



function UsersWorkerList({ Profile, list, Cases, Professions }) {

  const colProps = {
    sortable: true,
    canGroupBy: true,
    canFilter: true
  }

  const metaKey = "user"
  let initialConfig = GetInitialconfig(Profile, metaKey)
  const t = Profile?.i18n?.t || null

  const caseCellhandler = (value) => {
    if (Cases.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return `${(Cases.list || []).find(u => u.Uuid === value)?.Name || ''}`
    }
  }

  const professionCellhandler = (value) => {
    if (Professions.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return `${(Professions.list || []).find(u => u.Uuid === value)?.Name || ''}`
    }
  }

  const dateCellhandler = (value) => {
    if (value) {
      return Formatdate(value, true)
    }
    return null
  }

  const boolCellhandler = (value) => {
    return value !== null && (value ? t('Common.Yes') : t('Common.No'))
  }

  const Columns = [
    { Header: t('Common.Column.Id'), accessor: 'Id', },
    { Header: t('Common.Column.Uuid'), accessor: 'Uuid', },
    { Header: t('Pages.Users.Columns.Username'), accessor: 'Username', Title: true },
    { Header: t('Pages.Users.Columns.Email'), accessor: 'Email', Subheader: true, Subtitle: true },
    { Header: t('Pages.Users.Columns.Name'), accessor: 'Name', },
    { Header: t('Pages.Users.Columns.Surname'), accessor: 'Surname', },
    { Header: t('Pages.Users.Columns.Workstarttime'), accessor: row => dateCellhandler(row?.Workstarttime), Subtitle: true },
    { Header: t('Pages.Users.Columns.Profession'), accessor: row => professionCellhandler(row?.ProfessionID), Subtitle: true },
    { Header: t('Pages.Users.Columns.Includeshift'), accessor: row => boolCellhandler(row?.Includeshift) },
    { Header: t('Pages.Users.Columns.Case'), accessor: row => caseCellhandler(row?.CaseID), Subtitle: true },
    { Header: t('Common.Column.Createduser'), accessor: 'Createduser', },
    { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser', },
    { Header: t('Common.Column.Createtime'), accessor: 'Createtime', },
    { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime', },
    { Header: t('Common.Column.remove'), accessor: 'remove', disableProps: true },
    { Header: t('Common.Column.detail'), accessor: 'detail', disableProps: true },
    { Header: t('Common.Column.edit'), accessor: 'edit', disableProps: true },
    { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true }
  ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

  return (
    <>
      <Headerwrapper>
        <Grid columns='2' >
          <GridColumn width={8} />
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
      {list.length > 0 ?
        <div className='w-full mx-auto '>
          {Profile.Ismobile ?
            <MobileTable Columns={Columns} Data={list} Config={initialConfig} Profile={Profile} /> :
            <DataTable Columns={Columns} Data={list} Config={initialConfig} />}
        </div> : <NoDataScreen style={{ height: 'auto' }} message={t('Common.NoDataFound')} />
      }
    </>
  )
}

function UsersWorkerleftList({ Profile, list, Professions }) {

  const colProps = {
    sortable: true,
    canGroupBy: true,
    canFilter: true
  }

  const metaKey = "user"
  let initialConfig = GetInitialconfig(Profile, metaKey)
  const t = Profile?.i18n?.t || null

  const professionCellhandler = (value) => {
    if (Professions.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return `${(Professions.list || []).find(u => u.Uuid === value)?.Name || ''}`
    }
  }

  const dateCellhandler = (value) => {
    if (value) {
      return Formatdate(value, true)
    }
    return null
  }

  const Columns = [
    { Header: t('Common.Column.Id'), accessor: 'Id', },
    { Header: t('Common.Column.Uuid'), accessor: 'Uuid', },
    { Header: t('Pages.Users.Columns.Username'), accessor: 'Username', Title: true },
    { Header: t('Pages.Users.Columns.Email'), accessor: 'Email', Subheader: true, Subtitle: true },
    { Header: t('Pages.Users.Columns.Name'), accessor: 'Name', },
    { Header: t('Pages.Users.Columns.Surname'), accessor: 'Surname', },
    { Header: t('Pages.Users.Columns.Workstarttime'), accessor: row => dateCellhandler(row?.Workstarttime), Subtitle: true },
    { Header: t('Pages.Users.Columns.Workendtime'), accessor: row => dateCellhandler(row?.Workendtime), Subtitle: true },
    { Header: t('Pages.Users.Columns.Profession'), accessor: row => professionCellhandler(row?.ProfessionID), Subtitle: true },
    { Header: t('Pages.Users.Columns.Leftinfo'), accessor: 'Leftinfo', },
    { Header: t('Common.Column.Createduser'), accessor: 'Createduser', },
    { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser', },
    { Header: t('Common.Column.Createtime'), accessor: 'Createtime', },
    { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime', },
  ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

  return (
    <>
      <Headerwrapper>
        <Grid columns='2' >
          <GridColumn width={8} />
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
      {list.length > 0 ?
        <div className='w-full mx-auto '>
          {Profile.Ismobile ?
            <MobileTable Columns={Columns} Data={list} Config={initialConfig} Profile={Profile} /> :
            <DataTable Columns={Columns} Data={list} Config={initialConfig} />}
        </div> : <NoDataScreen style={{ height: 'auto' }} message={t('Common.NoDataFound')} />
      }
    </>
  )
}

function UsersAppList({ Profile, list }) {

  const colProps = {
    sortable: true,
    canGroupBy: true,
    canFilter: true
  }

  const metaKey = "user"
  let initialConfig = GetInitialconfig(Profile, metaKey)
  const t = Profile?.i18n?.t || null

  const Columns = [
    { Header: t('Common.Column.Id'), accessor: 'Id', },
    { Header: t('Common.Column.Uuid'), accessor: 'Uuid', },
    { Header: t('Pages.Users.Columns.Username'), accessor: 'Username', Title: true },
    { Header: t('Pages.Users.Columns.Email'), accessor: 'Email', Subheader: true, Subtitle: true },
    { Header: t('Pages.Users.Columns.Name'), accessor: 'Name', },
    { Header: t('Pages.Users.Columns.Surname'), accessor: 'Surname', },
    { Header: t('Common.Column.Createduser'), accessor: 'Createduser', },
    { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser', },
    { Header: t('Common.Column.Createtime'), accessor: 'Createtime', },
    { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime', },
    { Header: t('Common.Column.detail'), accessor: 'detail', disableProps: true },
    { Header: t('Common.Column.edit'), accessor: 'edit', disableProps: true },
    { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true }
  ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

  return (
    <>
      <Headerwrapper>
        <Grid columns='2' >
          <GridColumn width={8} />
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
      {list.length > 0 ?
        <div className='w-full mx-auto '>
          {Profile.Ismobile ?
            <MobileTable Columns={Columns} Data={list} Config={initialConfig} Profile={Profile} /> :
            <DataTable Columns={Columns} Data={list} Config={initialConfig} />}
        </div> : <NoDataScreen style={{ height: 'auto' }} message={t('Common.NoDataFound')} />
      }
    </>
  )
}
