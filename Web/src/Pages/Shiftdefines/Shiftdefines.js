import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Breadcrumb, Grid, GridColumn } from 'semantic-ui-react'
import { Headerwrapper, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings, DataTable } from '../../Components'
import ShiftdefinesDelete from '../../Containers/Shiftdefines/ShiftdefinesDelete'
import GetInitialconfig from '../../Utils/GetInitialconfig'
import { COL_PROPS } from '../../Utils/Constants'
import privileges from '../../Constants/Privileges'

export default function Shiftdefines(props) {
  const { GetShiftdefines, Shiftdefines, Profile } = props

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [record, setRecord] = useState(null)

  const t = Profile?.i18n?.t

  const { isLoading } = Shiftdefines

  const boolCellhandler = (value) => {
    return value !== null && (value ? t('Common.Yes') : t('Common.No'))
  }

  const Columns = [
    { Header: t('Common.Column.Id'), accessor: 'Id' },
    { Header: t('Common.Column.Uuid'), accessor: 'Uuid' },
    { Header: t('Pages.Shiftdefines.Column.Name'), accessor: 'Name', Title: true },
    { Header: t('Pages.Shiftdefines.Column.Starttime'), accessor: 'Starttime', Lowtitle: true, Withtext: true },
    { Header: t('Pages.Shiftdefines.Column.Endtime'), accessor: 'Endtime', Lowtitle: true, Withtext: true },
    { Header: t('Pages.Shiftdefines.Column.Priority'), accessor: 'Priority', Subtitle: true, Withtext: true },
    { Header: t('Pages.Shiftdefines.Column.Isjoker'), accessor: row => boolCellhandler(row?.Isjoker) },
    { Header: t('Common.Column.Createduser'), accessor: 'Createduser' },
    { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser' },
    { Header: t('Common.Column.Createtime'), accessor: 'Createtime' },
    { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime' },
    { Header: t('Common.Column.edit'), accessor: 'edit', disableProps: true, role: privileges.shiftdefineupdate },
    { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true, role: privileges.shiftdefinedelete }
  ].map(u => { return u.disableProps ? u : { ...u, ...COL_PROPS } })

  const metaKey = "shiftdefine"
  let initialConfig = GetInitialconfig(Profile, metaKey)

  const list = (Shiftdefines.list || []).filter(u => u.Isactive).map(item => {
    return {
      ...item,
      edit: <Link to={`/Shiftdefines/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
      delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
        setRecord(item)
        setDeleteOpen(true)
      }} />
    }
  })

  useEffect(() => {
    GetShiftdefines()
  }, [])

  return (
    <React.Fragment>
      <Pagewrapper dimmer isLoading={isLoading}>
        <Headerwrapper>
          <Grid columns='2' >
            <GridColumn width={8}>
              <Breadcrumb size='big'>
                <Link to={"/Shiftdefines"}>
                  <Breadcrumb.Section>{t('Pages.Shiftdefines.Page.Header')}</Breadcrumb.Section>
                </Link>
              </Breadcrumb>
            </GridColumn>
            <Settings
              Profile={Profile}
              Pagecreateheader={t('Pages.Shiftdefines.Page.CreateHeader')}
              Pagecreatelink={"/Shiftdefines/Create"}
              Columns={Columns}
              list={list}
              initialConfig={initialConfig}
              metaKey={metaKey}
              Showcreatebutton
              Showcolumnchooser
              Showexcelexport
              CreateRole={privileges.shiftdefineadd}
              ReportRole={privileges.shiftdefinegetreport}
              ViewRole={privileges.shiftdefinemanageview}
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
      <ShiftdefinesDelete
        open={deleteOpen}
        setOpen={setDeleteOpen}
        record={record}
        setRecord={setRecord}
      />
    </React.Fragment>
  )
}