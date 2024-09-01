import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Checkbox, Grid, GridColumn, Icon, Loader, Tab } from 'semantic-ui-react'
import { Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings, DataTable, Contentwrapper } from '../../Components'
import { CASE_PATIENT_STATUS_DEATH, CASE_PATIENT_STATUS_LEFT, GENDER_OPTION_MEN, ROUTES, getInitialconfig } from '../../Utils/Constants'
import config from '../../Config'
import Formatdate from '../../Utils/Formatdate'
import PatientsLeftModal from '../../Containers/Patients/PatientsLeftModal'
import PatientsDeadModal from '../../Containers/Patients/PatientsDeadModal'


export default function Patients(props) {

  const { Patients, Profile, Cases, Patientdefines, Files, Usagetypes, Floors, Rooms, Beds, handleSelectedPatient, handleDetailmodal } = props
  const t = Profile?.i18n?.t || null

  const { isLoading } = Patients

  const Columns = [
    { Header: t('Common.Column.Id'), accessor: 'Id' },
    { Header: t('Common.Column.Uuid'), accessor: 'Uuid' },
    { Header: t('Pages.Patients.Column.Name'), accessor: row => nameCellhandler(row), Cell: (col, row) => imageCellhandler(col, row), Title: true },
    { Header: t('Pages.Patients.Column.Gender'), accessor: row => genderCellhandler(row) },
    { Header: t('Pages.Patients.Column.Registerdate'), accessor: row => dateCellhandler(row?.Registerdate) },
    { Header: t('Pages.Patients.Column.Approvaldate'), accessor: row => dateCellhandler(row?.Approvaldate) },
    { Header: t('Pages.Patients.Column.Leavedate'), accessor: row => dateCellhandler(row?.Leavedate), key: 'left' },
    { Header: t('Pages.Patients.Column.Leftinfo'), accessor: 'Leftinfo', key: 'left' },
    { Header: t('Pages.Patients.Column.Deathdate'), accessor: row => dateCellhandler(row?.Deathdate), key: 'dead' },
    { Header: t('Pages.Patients.Column.Deadinfo'), accessor: 'Deadinfo', key: 'dead' },
    { Header: t('Pages.Patients.Column.Floor'), accessor: row => floorCellhandler(row?.FloorID), Lowtitle: true, Withtext: true, key: 'pass' },
    { Header: t('Pages.Patients.Column.Room'), accessor: row => roomCellhandler(row?.RoomID), Lowtitle: true, Withtext: true, key: 'pass' },
    { Header: t('Pages.Patients.Column.Bed'), accessor: row => bedCellhandler(row?.BedID), Lowtitle: true, Withtext: true, key: 'pass' },
    { Header: t('Pages.Patients.Column.Case'), accessor: row => caseCellhandler(row?.CaseID), Subtitle: true },
    { Header: t('Common.Column.Createduser'), accessor: 'Createduser' },
    { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser' },
    { Header: t('Common.Column.Createtime'), accessor: 'Createtime' },
    { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime' },
    { Header: t('Common.Column.define'), accessor: 'define', disableProps: true },
  ]

  let passCaselist = (Cases.list || []).filter(u => u.Patientstatus !== CASE_PATIENT_STATUS_DEATH && u.Patientstatus !== CASE_PATIENT_STATUS_LEFT).map(u => u.Uuid)
  let deadCaselist = (Cases.list || []).filter(u => u.Patientstatus === CASE_PATIENT_STATUS_DEATH).map(u => u.Uuid)
  let leftCaselist = (Cases.list || []).filter(u => u.Patientstatus === CASE_PATIENT_STATUS_LEFT).map(u => u.Uuid)

  const list = (Patients.list || []).filter(u => u.Isactive && !u.Ispreregistration).map(item => {
    const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === item?.PatientdefineID)
    return {
      ...item,
      define: <Link key={item?.Uuid} to={`/Patientdefines/${patientdefine?.Uuid}/edit`} ><Icon size='large' color='red' className='row-edit' name='address book' /> </Link>,
    }
  })

  const passList = list.filter(u => (passCaselist || []).includes(u?.CaseID))
  const deadList = list.filter(u => (deadCaselist || []).includes(u?.CaseID))
  const leftList = list.filter(u => (leftCaselist || []).includes(u?.CaseID))

  useEffect(() => {
    const {
      GetPatients,
      GetPatientdefines,
      GetRooms,
      GetBeds,
      GetFloors,
      GetCases,
      GetStockdefines,
      GetUsagetypes,
      GetFiles
    } = props
    GetPatients()
    GetPatientdefines()
    GetRooms()
    GetBeds()
    GetFloors()
    GetCases()
    GetUsagetypes()
    GetStockdefines()
    GetFiles()
  }, [])

  const nameCellhandler = (row) => {
    const patient = row
    const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)
    return `${patientdefine?.Firstname} ${patientdefine?.Lastname} - ${patientdefine?.CountryID}`
  }

  const genderCellhandler = (row) => {
    const patient = row
    const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)
    const gender = patientdefine?.Gender
    return gender ? gender === GENDER_OPTION_MEN ? t('Pages.Patients.Column.GenderMen') : t('Pages.Patients.Column.GenderWomen') : t('Common.NoDataFound')
  }

  const imageCellhandler = (col, row) => {
    if (!col?.cell?.isGrouped && !Profile.Ismobile) {
      const patient = col?.row?.original || row
      if (!patient?.Uuid) {
        return col?.value
      }
      const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)
      let usagetypePP = (Usagetypes.list || []).find(u => u.Value === 'PP')?.Uuid || null
      let file = (Files.list || []).filter(u => u.ParentID === patient?.Uuid).find(u => (((u.Usagetype || '').split(',')) || []).includes(usagetypePP))
      return <div className='flex justify-start items-center flex-row flex-wrap whitespace-nowrap'>
        {file
          ? <img alt='pp' src={`${config.services.File}${ROUTES.FILE}/Downloadfile/${file?.Uuid}`} className="rounded-full" style={{ width: '30px', height: '30px' }} />
          : null}
        {patientdefine?.Firstname ? `${patientdefine?.Firstname} ${patientdefine?.Lastname}` : `${patientdefine?.CountryID}`}
      </div>
    } else {
      const patient = col?.row?.original || row
      if (patient?.Uuid) {
        const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)
        return patientdefine?.Firstname ? `${patientdefine?.Firstname} ${patientdefine?.Lastname}` : `${patientdefine?.CountryID}`
      }
      return col?.value
    }
  }

  const floorCellhandler = (value) => {
    if (Floors.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return `${(Floors.list || []).find(u => u.Uuid === value)?.Name || ''}`
    }
  }

  const roomCellhandler = (value) => {
    if (Rooms.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return `${(Rooms.list || []).find(u => u.Uuid === value)?.Name || ''}`
    }
  }

  const bedCellhandler = (value) => {
    if (Beds.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return `${(Beds.list || []).find(u => u.Uuid === value)?.Name || ''}`
    }
  }

  const caseCellhandler = (value) => {
    if (Cases.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return `${(Cases.list || []).find(u => u.Uuid === value)?.Name || ''}`
    }
  }

  const dateCellhandler = (value) => {
    if (value) {
      return Formatdate(value, true)
    }
    return null
  }


  return (
    isLoading ? <LoadingPage /> :
      <React.Fragment>
        <Pagewrapper>
          <Headerwrapper>
            <Grid columns='2' >
              <GridColumn width={8}>
                <Breadcrumb size='big'>
                  <Link to={"/Patients"}>
                    <Breadcrumb.Section>{t('Pages.Patients.Page.Header')}</Breadcrumb.Section>
                  </Link>
                </Breadcrumb>
              </GridColumn>
              <Settings
                Profile={Profile}
                Pagecreateheader={t('Pages.Patients.Page.CreateHeader')}
                Pagecreatelink={"/Patients/Create"}
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
                  menuItem: `${t('Pages.Patients.Page.Tab.PassHeader')} (${(passList || []).length})`,
                  pane: {
                    key: 'pass',
                    content: <PassPatientList
                      Profile={Profile}
                      list={passList}
                      Columns={Columns}
                    />
                  }
                },
                {
                  menuItem: `${t('Pages.Patients.Page.Tab.DeadHeader')} (${(deadList || []).length})`,
                  pane: {
                    key: 'dead',
                    content: <DeadPatientList
                      Profile={Profile}
                      list={deadList}
                      Columns={Columns}
                      handleSelectedPatient={handleSelectedPatient}
                      handleDetailmodal={handleDetailmodal}
                    />
                  }
                },
                {
                  menuItem: `${t('Pages.Patients.Page.Tab.LeftHeader')} (${(leftList || []).length})`,
                  pane: {
                    key: 'left',
                    content: <LeftPatientList
                      Profile={Profile}
                      list={leftList}
                      Columns={Columns}
                      handleSelectedPatient={handleSelectedPatient}
                      handleDetailmodal={handleDetailmodal}
                    />
                  }
                },
              ]}
              renderActiveOnly={false}
            />
          </Contentwrapper>
        </Pagewrapper>
      </React.Fragment >
  )
}


function PassPatientList({ Profile, Columns, list }) {

  const [selectedRecords, setSelectedRecords] = useState([])
  const [openMulti, setOpenMulti] = useState(false)
  const [openplace, setOpenplace] = useState(false)
  const [opendead, setOpendead] = useState(false)
  const [openleft, setOpenleft] = useState(false)
  const [record, setRecord] = useState(null)

  const colProps = {
    sortable: true,
    canGroupBy: true,
    canFilter: true
  }

  const metaKey = "patients"
  let initialConfig = getInitialconfig(Profile, metaKey)
  const t = Profile?.i18n?.t || null

  const filteredColumns = openMulti ? (Columns || []).filter(u => u.accessor !== 'define') : Columns
  const columns = [
    { Header: t('Common.Column.Empty'), accessor: 'select', disableProps: true, hidden: !openMulti },
    ...filteredColumns.filter(u => u.key ? u.key === 'pass' : true),
    { Header: t('Pages.Patients.Column.changeplace'), accessor: 'changeplace', disableProps: true, hidden: openMulti },
    { Header: t('Pages.Patients.Column.deadpatient'), accessor: 'deadpatient', disableProps: true, hidden: openMulti },
    { Header: t('Pages.Patients.Column.leftpatient'), accessor: 'leftpatient', disableProps: true, hidden: openMulti },
    { Header: t('Common.Column.detail'), accessor: 'actions', disableProps: true, hidden: openMulti }
  ].filter(u => !u.hidden).map(u => { return u.disableProps ? u : { ...u, ...colProps } })

  const decoratedList = list.map(item => {

    return {
      ...item,
      select: <div
        onClick={() => {
          (selectedRecords || []).includes(item?.Uuid)
            ? setSelectedRecords((selectedRecords || []).filter(u => u !== item?.Uuid))
            : setSelectedRecords([item?.Uuid, ...(selectedRecords || [])])
        }}
        className='flex justify-center items-center'>
        <Checkbox checked={selectedRecords.includes(item?.Uuid)} />
      </div>,
      deadpatient: <div
        className='cursor-pointer'
        onClick={() => {
          setRecord(item)
          setOpendead(true)
        }}
      >
        <Icon size='large' color='black' className='row-edit' name='tag' />
      </div>,
      leftpatient: <div
        className='cursor-pointer'
        onClick={() => {
          setRecord(item)
          setOpenleft(true)
        }}
      >
        <Icon size='large' color='blue' className='row-edit' name='external share' />
      </div>,
      changeplace: <div
        className='cursor-pointer'
        onClick={() => {
          setRecord(item)
          setOpenplace(true)
        }}
      >
        <Icon size='large' color='green' className='row-edit' name='exchange' />
      </div>,
      actions: <Link key={item?.Uuid} to={`/Patients/${item.Uuid}`} ><Icon size='large' color='blue' className='row-edit' name='magnify' /> </Link>
    }
  })

  return (
    <>
      <Headerwrapper>
        <Grid columns='2' >
          <GridColumn width={8} />
          <Settings
            Profile={Profile}
            Columns={columns}
            list={decoratedList}
            initialConfig={initialConfig}
            metaKey={metaKey}
            Showcolumnchooser
            Showexcelexport
            Additionalfunctiontxt={openMulti ? t('Common.Button.Singleselect') : t('Common.Button.Multiselect')}
            Additionalfunction={() => { setOpenMulti(!openMulti) }}
          />
        </Grid>
      </Headerwrapper>
      {list.length > 0 ?
        <div className='w-full mx-auto '>
          {Profile.Ismobile ?
            <MobileTable Columns={columns} Data={decoratedList} Config={initialConfig} Profile={Profile} /> :
            <DataTable Columns={columns} Data={decoratedList} Config={initialConfig} />}
        </div> : <NoDataScreen style={{ height: 'auto' }} message={t('Common.NoDataFound')} />
      }
      <PatientsLeftModal
        open={openleft}
        setOpen={setOpenleft}
        record={record}
        setRecord={setRecord}
      />
      <PatientsDeadModal
        open={opendead}
        setOpen={setOpendead}
        record={record}
        setRecord={setRecord}
      />
    </>
  )
}

function LeftPatientList({ Profile, Columns, list, handleSelectedPatient, handleDetailmodal }) {

  const colProps = {
    sortable: true,
    canGroupBy: true,
    canFilter: true
  }

  const metaKey = "patients"
  let initialConfig = getInitialconfig(Profile, metaKey)
  const t = Profile?.i18n?.t || null

  const columns = [
    ...Columns.filter(u => u.key ? u.key === 'left' : true),
    { Header: t('Common.Column.detail'), accessor: 'actions', disableProps: true }
  ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

  const decoratedList = list.map(item => {
    return {
      ...item,
      actions: <Icon link size='large' color='grey' name='history' onClick={() => {
        handleSelectedPatient(item)
        handleDetailmodal(true)
      }} />,
    }
  })

  return (
    <>
      <Headerwrapper>
        <Grid columns='2' >
          <GridColumn width={8} />
          <Settings
            Profile={Profile}
            Columns={columns}
            list={decoratedList}
            initialConfig={initialConfig}
            metaKey={metaKey}
            Showcolumnchooser
            Showexcelexport
          />
        </Grid>
      </Headerwrapper>
      {decoratedList.length > 0 ?
        <div className='w-full mx-auto '>
          {Profile.Ismobile ?
            <MobileTable Columns={columns} Data={decoratedList} Config={initialConfig} Profile={Profile} /> :
            <DataTable Columns={columns} Data={decoratedList} Config={initialConfig} />}
        </div> : <NoDataScreen style={{ height: 'auto' }} message={t('Common.NoDataFound')} />
      }
    </>
  )
}

function DeadPatientList({ Profile, Columns, list, handleSelectedPatient, handleDetailmodal }) {

  const colProps = {
    sortable: true,
    canGroupBy: true,
    canFilter: true
  }

  const metaKey = "patients"
  let initialConfig = getInitialconfig(Profile, metaKey)
  const t = Profile?.i18n?.t || null

  const columns = [
    ...Columns.filter(u => u.key ? u.key === 'dead' : true),
    { Header: t('Common.Column.detail'), accessor: 'actions', disableProps: true }
  ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

  const decoratedList = list.map(item => {
    return {
      ...item,
      actions: <Icon link size='large' color='grey' name='history' onClick={() => {
        handleSelectedPatient(item)
        handleDetailmodal(true)
      }} />,
    }
  })

  return (
    <>
      <Headerwrapper>
        <Grid columns='2' >
          <GridColumn width={8} />
          <Settings
            Profile={Profile}
            Columns={columns}
            list={decoratedList}
            initialConfig={initialConfig}
            metaKey={metaKey}
            Showcolumnchooser
            Showexcelexport
          />
        </Grid>
      </Headerwrapper>
      {decoratedList.length > 0 ?
        <div className='w-full mx-auto '>
          {Profile.Ismobile ?
            <MobileTable Columns={columns} Data={decoratedList} Config={initialConfig} Profile={Profile} /> :
            <DataTable Columns={columns} Data={decoratedList} Config={initialConfig} />}
        </div> : <NoDataScreen style={{ height: 'auto' }} message={t('Common.NoDataFound')} />
      }
    </>
  )
}