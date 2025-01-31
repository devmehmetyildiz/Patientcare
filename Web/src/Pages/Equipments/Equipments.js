import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Grid, GridColumn, Icon, Loader } from 'semantic-ui-react'
import EquipmentsDelete from "../../Containers/Equipments/EquipmentsDelete"
import GetInitialconfig from '../../Utils/GetInitialconfig'
import {
  DataTable, Headerwrapper,
  MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings
} from '../../Components'
import { COL_PROPS } from '../../Utils/Constants'
import privileges from '../../Constants/Privileges'

export default function Equipments(props) {
  const { GetEquipments, GetEquipmentgroups, GetRooms, GetFloors, GetUsers, GetBeds } = props
  const { Users, Beds, Floors, Equipmentgroups, Equipments, Rooms, Profile } = props

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [record, setRecord] = useState(null)

  const t = Profile?.i18n?.t

  const { isLoading } = Equipments

  const equipmentgroupCellhandler = (value) => {
    if (Equipmentgroups.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return (Equipmentgroups.list || []).find(u => u.Uuid === value)?.Name
    }
  }

  const floorCellhandler = (value) => {
    if (Floors.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
  } else {
      return (Floors.list || []).find(u => u.Uuid === value)?.Name
    }
  }

  const roomCellhandler = (value) => {
    if (Rooms.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return (Rooms.list || []).find(u => u.Uuid === value)?.Name
    }
  }

  const bedCellhandler = (value) => {
    if (Beds.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return (Beds.list || []).find(u => u.Uuid === value)?.Name
    }
  }

  const userCellhandler = (value) => {
    if (Users.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return (Users.list || []).find(u => u.Uuid === value)?.Username
    }
  }

  const Columns = [
    { Header: t('Common.Column.Id'), accessor: 'Id' },
    { Header: t('Common.Column.Uuid'), accessor: 'Uuid' },
    { Header: t('Pages.Equipments.Column.Name'), accessor: 'Name', Title: true },
    { Header: t('Pages.Equipments.Column.Equipmentgroup'), accessor: row => equipmentgroupCellhandler(row?.EquipmentgroupID), Subtitle: true, Withtext: true },
    { Header: t('Pages.Equipments.Column.Floor'), accessor: row => floorCellhandler(row?.FloorID) },
    { Header: t('Pages.Equipments.Column.Room'), accessor: row => roomCellhandler(row?.RoomID) },
    { Header: t('Pages.Equipments.Column.Bed'), accessor: row => bedCellhandler(row?.BedID) },
    { Header: t('Pages.Equipments.Column.User'), accessor: row => userCellhandler(row?.UserID) },
    { Header: t('Common.Column.Createduser'), accessor: 'Createduser' },
    { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser' },
    { Header: t('Common.Column.Createtime'), accessor: 'Createtime' },
    { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime' },
    { Header: t('Common.Column.edit'), accessor: 'edit', disableProps: true, role: privileges.equipmentupdate },
    { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true, role: privileges.equipmentdelete }
  ].map(u => { return u.disableProps ? u : { ...u, ...COL_PROPS } })

  const metaKey = "equipment"
  let initialConfig = GetInitialconfig(Profile, metaKey)

  const list = (Equipments.list || []).filter(u => u.Isactive).map(item => {
    return {
      ...item,
      edit: <Link to={`/Equipments/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
      delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
        setRecord(item)
        setDeleteOpen(true)
      }} />,
    }
  })

  useEffect(() => {
    GetEquipments()
    GetEquipmentgroups()
    GetRooms()
    GetFloors()
    GetBeds()
    GetUsers()
  }, [])

  return (
    <React.Fragment>
      <Pagewrapper dimmer isLoading={isLoading}>
        <Headerwrapper>
          <Grid columns='2' >
            <GridColumn width={8}>
              <Breadcrumb size='big'>
                <Link to={"/Equipments"}>
                  <Breadcrumb.Section>{t('Pages.Equipments.Page.Header')}</Breadcrumb.Section>
                </Link>
              </Breadcrumb>
            </GridColumn>
            <Settings
              Profile={Profile}
              Pagecreateheader={t('Pages.Equipments.Page.CreateHeader')}
              Pagecreatelink={"/Equipments/Create"}
              Columns={Columns}
              list={list}
              initialConfig={initialConfig}
              metaKey={metaKey}
              Showcreatebutton
              Showcolumnchooser
              Showexcelexport
              CreateRole={privileges.equipmentadd}
              ReportRole={privileges.equipmentgetreport}
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
      <EquipmentsDelete
        open={deleteOpen}
        setOpen={setDeleteOpen}
        record={record}
        setRecord={setRecord}
      />
    </React.Fragment>
  )
}