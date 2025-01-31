import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Confirm, Icon, Loader, } from 'semantic-ui-react'
import { Breadcrumb, Grid, GridColumn } from 'semantic-ui-react'
import { DataTable, Headerwrapper, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings } from '../../Components'
import BedsDelete from '../../Containers/Beds/BedsDelete'
import GetInitialconfig from '../../Utils/GetInitialconfig'
import { COL_PROPS } from '../../Utils/Constants'
import validator from '../../Utils/Validator'
import privileges from '../../Constants/Privileges'

export default function Beds(props) {
  const [bedID, setBedID] = useState(null)
  const [openConfirm, setOpenConfirm] = useState(false)

  const { GetBeds, GetRooms, GetFloors, GetPatients, GetPatientdefines } = props
  const { Beds, Profile, handleDeletemodal, handleSelectedBed, ChangeBedOccupied, Rooms, Floors } = props

  const t = Profile?.i18n?.t
  const userRoles = Profile?.roles

  const { isLoading } = Beds

  const roomCellhandler = ({ value, props }) => {
    const { Rooms, Floors } = props
    if (Rooms.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const room = (Rooms.list || []).find(u => u.Uuid === value)
      const floor = (Floors.list || []).find(u => u.Uuid === room?.FloorID)
      return `${room?.Name} (${floor?.Name})`
    }
  }

  const bedPatientCellhandler = ({ value, bedID, props }) => {
    const { Patients, Patientdefines, Beds } = props
    if (Patients.isLoading || Patientdefines.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const bed = (Beds.list || []).find(u => u.Uuid === bedID)
      const patient = (Patients.list || []).find(u => u.Uuid === value)
      const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)
      return patientdefine
        ? <div
          className='group cursor-pointer flex flex-row flex-nowrap'
        >
          {`${patientdefine?.Firstname} ${patientdefine?.Lastname} (${patientdefine?.CountryID})`}
          {validator.isHavePermission(privileges.bedupdate, userRoles) ?
            <div
              onClick={() => {
                setBedID(bedID)
                setOpenConfirm(true)
              }}
              className='opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-500'>
              <Icon color='red' name='delete' />
            </div>
            : null}
        </div>
        : bed
          ? bed?.Isoccupied && validator.isHavePermission(privileges.bedupdate, userRoles) ? <div
            onClick={() => {
              setBedID(bedID)
              setOpenConfirm(true)
            }}
            className='cursor-pointer'
          >
            <Icon color='red' name='delete' />
          </div>
            : null
          : null
    }
  }

  const boolCellhandler = ({ value, props }) => {
    const { Profile } = props
    const t = Profile?.i18n?.t
    return value !== null && (value ? t('Pages.Beds.Label.Filled') : t('Pages.Beds.Label.Empty'))
  }

  const Columns = [
    { Header: t('Common.Column.Id'), accessor: 'Id' },
    { Header: t('Common.Column.Uuid'), accessor: 'Uuid' },
    { Header: t('Pages.Beds.Column.Name'), accessor: 'Name', Title: true },
    { Header: t('Pages.Beds.Column.Room'), accessor: row => roomCellhandler({ value: row?.RoomID, props }), Subtitle: true, Withtext: true },
    { Header: t('Pages.Beds.Column.Isoccupied'), accessor: row => boolCellhandler({ value: row?.Isoccupied, props }), Lowtitle: true, Withtext: true },
    { Header: t('Pages.Beds.Column.Patient'), accessor: row => bedPatientCellhandler({ value: row?.PatientID, bedID: row?.Uuid, props }), Withtext: true },
    { Header: t('Common.Column.Createduser'), accessor: 'Createduser' },
    { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser' },
    { Header: t('Common.Column.Createtime'), accessor: 'Createtime' },
    { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime' },
    { Header: t('Common.Column.edit'), accessor: 'edit', disableProps: true, role: privileges.bedupdate },
    { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true, role: privileges.beddelete },
  ].map(u => { return u.disableProps ? u : { ...u, ...COL_PROPS } })

  const metaKey = "bed"
  let initialConfig = GetInitialconfig(Profile, metaKey)

  const list = (Beds.list || []).filter(u => u.Isactive).map(item => {
    return {
      ...item,
      edit: <Link to={`/Beds/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
      delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
        handleSelectedBed(item)
        handleDeletemodal(true)
      }} />
    }
  })

  const bed = (Beds.list || []).find(u => u.Uuid === bedID)
  const room = (Rooms.list || []).find(u => u.Uuid === bed?.RoomID)
  const floor = (Floors.list || []).find(u => u.Uuid === room?.FloorID)
  const bedName = `${bed?.Name} (${room?.Name}-${floor?.Name})`

  useEffect(() => {
    GetBeds()
    GetRooms()
    GetFloors()
    GetPatients()
    GetPatientdefines()
  }, [])

  return (
    <React.Fragment>
      <Confirm
        cancelButton={t('Common.Button.Giveup')}
        confirmButton={t('Common.Button.Update')}
        content={`${bedName} ${t('Pages.Beds.Messages.EmptyCheck')}`}
        open={openConfirm}
        onCancel={() => {
          setBedID(null)
          setOpenConfirm(false)
        }}
        onConfirm={() => {
          ChangeBedOccupied({
            data: {
              BedID: bedID,
              Isoccupied: false
            }
          })
          setBedID(null)
          setOpenConfirm(false)
        }}
      />
      <Pagewrapper dimmer isLoading={isLoading}>
        <Headerwrapper>
          <Grid columns='2' >
            <GridColumn width={8}>
              <Breadcrumb size='big'>
                <Link to={"/Beds"}>
                  <Breadcrumb.Section>{t('Pages.Beds.Page.Header')}</Breadcrumb.Section>
                </Link>
              </Breadcrumb>
            </GridColumn>
            <Settings
              Profile={Profile}
              Pagecreateheader={t('Pages.Beds.Page.CreateHeader')}
              Pagecreatelink={"/Beds/Create"}
              Columns={Columns}
              list={list}
              initialConfig={initialConfig}
              metaKey={metaKey}
              Showcreatebutton
              Showcolumnchooser
              Showexcelexport
              CreateRole={privileges.bedadd}
              ReportRole={privileges.bedgetreport}
              ViewRole={privileges.bedmanageview}
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
      <BedsDelete />
    </React.Fragment>
  )
}
