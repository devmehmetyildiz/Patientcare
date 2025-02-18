import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Grid, GridColumn, Icon, Loader } from 'semantic-ui-react'
import EquipmentgroupsDelete from "../../Containers/Equipmentgroups/EquipmentgroupsDelete"
import GetInitialconfig from '../../Utils/GetInitialconfig'
import {
  DataTable, Headerwrapper, MobileTable,
  NoDataScreen, Pagedivider, Pagewrapper, Settings
} from '../../Components'
import { COL_PROPS } from '../../Utils/Constants'
import privileges from '../../Constants/Privileges'

export default function Equipmentgroups(props) {
  const { GetDepartments, GetEquipmentgroups, Departments, Equipmentgroups, Profile } = props

  const t = Profile?.i18n?.t

  const { isLoading } = Equipmentgroups

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [record, setRecord] = useState(null)

  const departmentCellhandler = (value) => {
    if (Departments.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return (Departments.list || []).find(u => u.Uuid === value)?.Name
    }
  }

  const Columns = [
    { Header: t('Common.Column.Id'), accessor: 'Id' },
    { Header: t('Common.Column.Uuid'), accessor: 'Uuid' },
    { Header: t('Pages.Equipmentgroups.Column.Name'), accessor: 'Name', Title: true },
    { Header: t('Pages.Equipmentgroups.Column.Department'), accessor: row => departmentCellhandler(row?.DepartmentID) },
    { Header: t('Common.Column.Createduser'), accessor: 'Createduser' },
    { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser' },
    { Header: t('Common.Column.Createtime'), accessor: 'Createtime' },
    { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime' },
    { Header: t('Common.Column.edit'), accessor: 'edit', disableProps: true, role: privileges.equipmentgroupupdate },
    { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true, role: privileges.equipmentgroupdelete }
  ].map(u => { return u.disableProps ? u : { ...u, ...COL_PROPS } })


  const metaKey = "equipmentgroup"
  let initialConfig = GetInitialconfig(Profile, metaKey)

  const list = (Equipmentgroups.list || []).filter(u => u.Isactive).map(item => {
    return {
      ...item,
      edit: <Link to={`/Equipmentgroups/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
      delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
        setRecord(item)
        setDeleteOpen(true)
      }} />,
    }
  })

  useEffect(() => {
    GetDepartments()
    GetEquipmentgroups()
  }, [])

  return (
    <React.Fragment>
      <Pagewrapper dimmer isLoading={isLoading}>
        <Headerwrapper>
          <Grid columns='2' >
            <GridColumn width={8}>
              <Breadcrumb size='big'>
                <Link to={"/Equipmentgroups"}>
                  <Breadcrumb.Section>{t('Pages.Equipmentgroups.Page.Header')}</Breadcrumb.Section>
                </Link>
              </Breadcrumb>
            </GridColumn>
            <Settings
              Profile={Profile}
              Pagecreateheader={t('Pages.Equipmentgroups.Page.CreateHeader')}
              Pagecreatelink={"/Equipmentgroups/Create"}
              Columns={Columns}
              list={list}
              initialConfig={initialConfig}
              metaKey={metaKey}
              Showcreatebutton
              Showcolumnchooser
              Showexcelexport
              CreateRole={privileges.equipmentgroupadd}
              ReportRole={privileges.equipmentgroupgetreport}
              ViewRole={privileges.equipmentgroupmanageview}
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
      <EquipmentgroupsDelete
        open={deleteOpen}
        setOpen={setDeleteOpen}
        record={record}
        setRecord={setRecord}
      />
    </React.Fragment>
  )
}