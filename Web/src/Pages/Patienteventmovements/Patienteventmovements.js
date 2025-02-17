import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Loader } from 'semantic-ui-react'
import { Breadcrumb, Grid, GridColumn } from 'semantic-ui-react'
import { DataTable, Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings } from '../../Components'
import PatienteventmovementsDelete from '../../Containers/Patienteventmovements/PatienteventmovementsDelete'
import GetInitialconfig from '../../Utils/GetInitialconfig'

import { Formatfulldate } from '../../Utils/Formatdate'
import { COL_PROPS, PATIENTEVENT_MOVEMENT_TYPE_INDOOR, PATIENTEVENT_MOVEMENT_TYPE_OUTDOOR } from '../../Utils/Constants'
import privileges from '../../Constants/Privileges'

export default function Patienteventmovements(props) {

  const { Profile, Patienteventmovements, Patienteventdefines, Patients, Patientdefines, Users, Floors } = props
  const { GetPatienteventmovements, GetPatienteventdefines, GetPatients, GetPatientdefines, GetUsers, GetFloors } = props

  const [openDelete, setOpenDelete] = useState(false)
  const [record, setRecord] = useState(null)

  const t = Profile?.i18n?.t

  const typeCellhandler = (value) => {
    const Patientevenetmovementtypes = [
      { text: t('Option.Patienteventmovement.TypeIndoor'), value: PATIENTEVENT_MOVEMENT_TYPE_INDOOR },
      { text: t('Option.Patienteventmovement.TypeOutdoor'), value: PATIENTEVENT_MOVEMENT_TYPE_OUTDOOR },
    ]

    return Patientevenetmovementtypes.find(u => u.value === value)?.text || t('Common.NoDataFound')
  }

  const userCellhandler = (value) => {
    if (Users.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const user = (Users?.list || []).find(u => u.Uuid === value)
      return `${user?.Name} ${user?.Surname}`
    }
  }

  const eventdefineCellhandler = (value) => {
    if (Patienteventdefines.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const eventdefine = (Patienteventdefines?.list || []).find(u => u.Uuid === value)
      return `${eventdefine?.Eventname}`
    }
  }

  const patientCellhandler = (value) => {
    if (Patients.isLoading || Patientdefines.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const patient = (Patients?.list || []).find(u => u.Uuid === value)
      const patientdefine = (Patientdefines?.list || []).find(u => u.Uuid === patient?.PatientdefineID)
      return `${patientdefine?.Firstname} ${patientdefine?.Lastname}`
    }
  }

  const floorCellhandler = (value) => {
    if (Floors.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return (Floors.list || []).find(u => u.Uuid === value)?.Name
    }
  }

  const dateCellhandler = (value) => {
    if (value) {
      return Formatfulldate(value, true)
    }
    return value
  }

  const Columns = [
    { Header: t('Common.Column.Id'), accessor: 'Id' },
    { Header: t('Common.Column.Uuid'), accessor: 'Uuid' },
    { Header: t('Pages.Patienteventmovements.Column.Type'), accessor: row => typeCellhandler(row?.Type), Title: true },
    { Header: t('Pages.Patienteventmovements.Column.Patient'), accessor: row => patientCellhandler(row?.PatientID) },
    { Header: t('Pages.Patienteventmovements.Column.Event'), accessor: row => eventdefineCellhandler(row?.EventID) },
    { Header: t('Pages.Patienteventmovements.Column.User'), accessor: row => userCellhandler(row?.UserID) },
    { Header: t('Pages.Patienteventmovements.Column.Occureddate'), accessor: row => dateCellhandler(row?.Occureddate) },
    { Header: t('Pages.Patienteventmovements.Column.Relatedpersons'), accessor: 'Relatedpersons', },
    { Header: t('Pages.Patienteventmovements.Column.Solutionsecond'), accessor: 'Solutionsecond', },
    { Header: t('Pages.Patienteventmovements.Column.Eventdetail'), accessor: 'Eventdetail', },
    { Header: t('Pages.Patienteventmovements.Column.OccuredFloor'), accessor: row => floorCellhandler(row?.OccuredFloorID) },
    { Header: t('Pages.Patienteventmovements.Column.OccuredPlace'), accessor: 'Occuredplace', },
    { Header: t('Pages.Patienteventmovements.Column.Witnesses'), accessor: 'Witnesses', },
    { Header: t('Pages.Patienteventmovements.Column.Info'), accessor: 'Info', },
    { Header: t('Common.Column.Createduser'), accessor: 'Createduser' },
    { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser' },
    { Header: t('Common.Column.Createtime'), accessor: 'Createtime' },
    { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime' },
    { Header: t('Common.Column.edit'), accessor: 'edit', disableProps: true, role: privileges.patienteventmovementupdate },
    { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true, role: privileges.patienteventmovementdelete }
  ].map(u => { return u.disableProps ? u : { ...u, ...COL_PROPS } })

  const metaKey = "patienteventmovement"
  let initialConfig = GetInitialconfig(Profile, metaKey)

  const list = (Patienteventmovements.list || []).filter(u => u.Isactive).map(item => {
    return {
      ...item,
      edit: <Link to={`/Patienteventmovements/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
      delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
        setRecord(item)
        setOpenDelete(true)
      }} />
    }
  })

  useEffect(() => {
    GetPatienteventmovements()
    GetPatienteventdefines()
    GetPatients()
    GetPatientdefines()
    GetUsers()
    GetFloors()
  }, [])

  return (
    Patienteventmovements.isLoading ? <LoadingPage /> :
      <React.Fragment>
        <Pagewrapper>
          <Headerwrapper>
            <Grid columns='2' >
              <GridColumn width={8}>
                <Breadcrumb size='big'>
                  <Link to={"/Patienteventmovements"}>
                    <Breadcrumb.Section>{t('Pages.Patienteventmovements.Page.Header')}</Breadcrumb.Section>
                  </Link>
                </Breadcrumb>
              </GridColumn>
              <Settings
                Profile={Profile}
                Pagecreateheader={t('Pages.Patienteventmovements.Page.CreateHeader')}
                Pagecreatelink={"/Patienteventmovements/Create"}
                Columns={Columns}
                list={list}
                initialConfig={initialConfig}
                metaKey={metaKey}
                Showcreatebutton
                Showcolumnchooser
                Showexcelexport
                CreateRole={privileges.patienteventmovementadd}
                ReportRole={privileges.patienteventmovementgetreport}
                ViewRole={privileges.patienteventmovementmanageview}
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
        <PatienteventmovementsDelete
          open={openDelete}
          setOpen={setOpenDelete}
          record={record}
          setRecord={setRecord}
        />
      </React.Fragment>
  )
}