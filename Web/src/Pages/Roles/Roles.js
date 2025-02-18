import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Breadcrumb, Grid, GridColumn } from 'semantic-ui-react'
import { Headerwrapper, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings, DataTable } from '../../Components'
import RolesDelete from '../../Containers/Roles/RolesDelete'
import GetInitialconfig from '../../Utils/GetInitialconfig'
import { COL_PROPS } from '../../Utils/Constants'
import privileges from '../../Constants/Privileges'

export default function Roles(props) {
  const { GetRoles, Roles, Profile, handleDeletemodal, handleSelectedRole } = props

  const [privilegesStatus, setPrivilegesStatus] = useState([])

  const t = Profile?.i18n?.t

  const { isLoading } = Roles

  const expandAuthory = (rowid) => {
    const prevData = privilegesStatus
    prevData.push(rowid)
    setPrivilegesStatus([...prevData])
  }

  const shrinkAuthory = (rowid) => {
    const index = privilegesStatus.indexOf(rowid)
    const prevData = privilegesStatus
    if (index > -1) {
      prevData.splice(index, 1)
      setPrivilegesStatus([...prevData])
    }
  }

  const authoryCellhandler = (row, freeze) => {
    const itemId = row?.Id
    const itemPrivileges = (row?.Privileges || []).map(u => u?.text[Profile.Language])
    const itemPrivilegestxt = itemPrivileges.join(',')
    if (freeze === true) {
      return itemPrivilegestxt
    }
    return itemPrivilegestxt.length - 35 > 20 ?
      (
        !privilegesStatus.includes(itemId) ?
          [itemPrivilegestxt.slice(0, 35) + ' ...(' + (itemPrivileges || []).length + ')', <Link key={itemId} to='#' className='showMoreOrLess' onClick={() => expandAuthory(itemId)}> ...Daha Fazla Göster</Link>] :
          [itemPrivilegestxt, <Link key={itemId} to='#' className='showMoreOrLess' onClick={() => shrinkAuthory(itemId)}> ...Daha Az Göster</Link>]
      ) : itemPrivilegestxt
  }

  const Columns = [
    { Header: t('Common.Column.Id'), accessor: 'Id' },
    { Header: t('Common.Column.Uuid'), accessor: 'Uuid' },
    { Header: t('Pages.Roles.Column.Name'), accessor: 'Name', Title: true },
    { Header: t('Pages.Roles.Column.Privileges'), accessor: (row, freeze) => authoryCellhandler(row, freeze) },
    { Header: t('Common.Column.Createduser'), accessor: 'Createduser' },
    { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser' },
    { Header: t('Common.Column.Createtime'), accessor: 'Createtime' },
    { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime' },
    { Header: t('Common.Column.edit'), accessor: 'edit', disableProps: true, role: privileges.roleupdate },
    { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true, role: privileges.roledelete }
  ].map(u => { return u.disableProps ? u : { ...u, ...COL_PROPS } })

  const metaKey = "role"
  let initialConfig = GetInitialconfig(Profile, metaKey)

  const list = (Roles.list || []).filter(u => u.Isactive).map(item => {
    return {
      ...item,
      edit: <Link to={`/Roles/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
      delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
        handleSelectedRole(item)
        handleDeletemodal(true)
      }} />
    }
  })

  useEffect(() => {
    GetRoles()
  }, [])

  return (
    <React.Fragment>
      <Pagewrapper dimmer isLoading={isLoading}>
        <Headerwrapper>
          <Grid columns='2' >
            <GridColumn width={8}>
              <Breadcrumb size='big'>
                <Link to={"/Roles"}>
                  <Breadcrumb.Section>{t('Pages.Roles.Page.Header')}</Breadcrumb.Section>
                </Link>
              </Breadcrumb>
            </GridColumn>
            <Settings
              Profile={Profile}
              Pagecreateheader={t('Pages.Roles.Page.CreateHeader')}
              Pagecreatelink={"/Roles/Create"}
              Columns={Columns}
              list={list}
              initialConfig={initialConfig}
              metaKey={metaKey}
              Showcreatebutton
              Showcolumnchooser
              Showexcelexport
              CreateRole={privileges.roleadd}
              ReportRole={privileges.rolegetreport}
              ViewRole={privileges.rolemanageview}
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
      <RolesDelete />
    </React.Fragment>
  )
}