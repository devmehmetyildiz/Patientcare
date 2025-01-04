import React, { Component, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Grid, GridColumn, Icon, Loader, Tab } from 'semantic-ui-react'
import { Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings, DataTable, Contentwrapper, Profilephoto } from '../../Components'
import PreregistrationsDelete from '../../Containers/Preregistrations/PreregistrationsDelete'
import PreregistrationsCheck from '../../Containers/Preregistrations/PreregistrationsCheck'
import PreregistrationsApprove from '../../Containers/Preregistrations/PreregistrationsApprove'
import PreregistrationsComplete from '../../Containers/Preregistrations/PreregistrationsComplete'
import PreregistrationsDetail from '../../Containers/Preregistrations/PreregistrationsDetail'
import PreregistrationsCancelCheck from '../../Containers/Preregistrations/PreregistrationsCancelCheck'
import PreregistrationsCancelApprove from '../../Containers/Preregistrations/PreregistrationsCancelApprove'
import GetInitialconfig from '../../Utils/GetInitialconfig'
import Formatdate from '../../Utils/Formatdate'
import useTabNavigation from '../../Hooks/useTabNavigation'
import { COL_PROPS } from '../../Utils/Constants'

export default function Preregistrations(props) {

  const { GetPatients, GetPatientdefines, GetCases, GetUsers, GetUsagetypes, GetFiles, fillPatientnotification, history } = props
  const { Patients, Cases, Users, Patientdefines, Files, Usagetypes, Profile, } = props

  const { isLoading } = Patients
  const t = Profile?.i18n?.t || null

  const [detailOpen, setDetailOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [checkOpen, setCheckOpen] = useState(false)
  const [approveOpen, setApproveOpen] = useState(false)
  const [completeOpen, setCompleteOpen] = useState(false)
  const [cancelCheckOpen, setCancelCheckOpen] = useState(false)
  const [cancelApproveOpen, setCancelApproveOpen] = useState(false)
  const [record, setRecord] = useState(null)

  const nameCellhandler = (row) => {
    const patient = row
    const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)
    return `${patientdefine?.Firstname} ${patientdefine?.Lastname} - ${patientdefine?.CountryID}`
  }

  const imageCellhandler = (col, row) => {
    if (!col?.cell?.isGrouped && !Profile.Ismobile) {
      const patient = col?.row?.original || row
      if (!patient?.Uuid) {
        return col?.value
      }
      const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)
      let usagetypePP = (Usagetypes.list || []).find(u => u.Value === 'PP')?.Uuid || null
      let file = (Files.list || []).filter(u => u.Isactive && u.ParentID === patient?.Uuid).find(u => (((u.Usagetype || '').split(',')) || []).includes(usagetypePP))
      return <div className='flex justify-start items-center flex-row flex-wrap whitespace-nowrap'>
        {file
          ? <Profilephoto
            fileID={file?.Uuid}
            fillnotification={fillPatientnotification}
            Profile={Profile}
            Imgheigth="30px"
          />
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

  const userCellhandler = (value) => {
    if (Users.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const user = (Users.list || []).find(u => u.Uuid === value)
      return user ? `${user?.Name} ${user?.Surname} (${user?.Username})` : ''
    }
  }

  const dateCellhandler = (value) => {
    if (value) {
      return Formatdate(value, true)
    }
    return null
  }

  const patientdefineCellhandler = (value) => {
    if (Patientdefines.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return (Patientdefines.list || []).find(u => u.Uuid === value)?.CountryID
    }
  }

  const caseCellhandler = (value) => {
    if (Cases.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return (Cases.list || []).find(u => u.Uuid === value)?.Name
    }
  }

  const renderView = ({ list, Columns, keys, initialConfig }) => {

    const searchbykey = (data, searchkeys) => {
      let ok = false
      searchkeys.forEach(key => {

        if (!ok) {
          if (data.includes(key)) {
            ok = true
          }
        }
      });

      return ok
    }

    const columns = Columns.filter(u => searchbykey((u?.keys || []), keys) || !(u?.keys))

    return list.length > 0 ?
      <div className='w-full mx-auto '>
        {Profile.Ismobile ?
          <MobileTable Columns={columns} Data={list} Config={initialConfig} Profile={Profile} /> :
          <DataTable Columns={columns} Data={list} Config={initialConfig} />}
      </div> : <NoDataScreen style={{ height: 'auto' }} message={t('Common.NoDataFound')} />
  }

  const Columns = [
    { Header: t('Common.Column.Id'), accessor: 'Id' },
    { Header: t('Common.Column.Uuid'), accessor: 'Uuid' },
    { Header: t('Pages.Preregistrations.Column.Name'), accessor: (row, disableImg) => nameCellhandler(row, disableImg), Title: true },
    { Header: t('Pages.Preregistrations.Column.CountryID'), accessor: row => patientdefineCellhandler(row?.PatientdefineID), Subtitle: true },
    { Header: t('Pages.Preregistrations.Column.Happensdate'), accessor: row => dateCellhandler(row?.Happensdate), Lowtitle: true, Withtext: true },
    { Header: t('Pages.Preregistrations.Column.Approvaldate'), accessor: row => dateCellhandler(row?.Approvaldate), Lowtitle: true, Withtext: true },
    { Header: t('Pages.Preregistrations.Column.Case'), accessor: row => caseCellhandler(row?.CaseID), Lowtitle: true, Withtext: true },
    { Header: t('Pages.Preregistrations.Column.Info'), accessor: 'Info' },
    { Header: t('Pages.Preregistrations.Column.Guardiannote'), accessor: 'Guardiannote' },
    { Header: t('Pages.Preregistrations.Column.Patientcreatetime'), accessor: row => dateCellhandler(row?.Patientcreatetime), keys: ['created'] },
    { Header: t('Pages.Preregistrations.Column.Createduser'), accessor: row => userCellhandler(row?.CreateduserID), keys: ['created'] },
    { Header: t('Pages.Preregistrations.Column.Patientchecktime'), accessor: row => dateCellhandler(row?.Patientchecktime), keys: ['checked'] },
    { Header: t('Pages.Preregistrations.Column.Checkeduser'), accessor: row => userCellhandler(row?.CheckeduserID), keys: ['checked'] },
    { Header: t('Pages.Preregistrations.Column.Patientapprovetime'), accessor: row => dateCellhandler(row?.Patientapprovetime), keys: ['approved'] },
    { Header: t('Pages.Preregistrations.Column.Approveduser'), accessor: row => userCellhandler(row?.ApproveduserID), keys: ['approved'] },
    { Header: t('Pages.Preregistrations.Column.Patientcompletetime'), accessor: row => dateCellhandler(row?.Patientcompletetime), keys: ['completed'] },
    { Header: t('Pages.Preregistrations.Column.Completeduser'), accessor: row => userCellhandler(row?.CompleteduserID), keys: ['completed'] },
    { Header: t('Common.Column.Createduser'), accessor: 'Createduser' },
    { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser' },
    { Header: t('Common.Column.Createtime'), accessor: 'Createtime' },
    { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime' },
    { Header: t('Common.Column.detail'), accessor: 'detail', disableProps: true },
    { Header: t('Common.Column.define'), accessor: 'define', disableProps: true },
    { Header: t('Common.Column.check'), accessor: 'check', disableProps: true, keys: ['created'] },
    { Header: t('Common.Column.cancelcheck'), accessor: 'cancelcheck', disableProps: true, keys: ['checked'] },
    { Header: t('Common.Column.approve'), accessor: 'approve', disableProps: true, keys: ['checked'] },
    { Header: t('Common.Column.cancelapprove'), accessor: 'cancelapprove', disableProps: true, keys: ['approved'] },
    { Header: t('Common.Column.complete'), accessor: 'complete', disableProps: true, keys: ['approved'] },
    { Header: t('Common.Column.edit'), accessor: 'edit', disableProps: true, keys: ['created'] },
    { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true, keys: ['created', 'checked', 'approved'] }
  ].map(u => { return u.disableProps ? u : { ...u, ...COL_PROPS } })

  const metaKey = "preregistration"
  let initialConfig = GetInitialconfig(Profile, metaKey)


  const list = (Patients.list || []).filter(u => u.Isactive).map(item => {
    const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === item?.PatientdefineID)
    return {
      ...item,
      edit: <Link to={`/Preregistrations/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
      define: <Link key={item?.Uuid} to={`/Patientdefines/${patientdefine?.Uuid}/edit`} ><Icon size='large' color='red' className='row-edit' name='address book' /> </Link>,
      delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
        setRecord(item)
        setDeleteOpen(true)
      }} />,
      cancelcheck: <Icon link size='large' color='red' name='level down alternate' onClick={() => {
        setRecord(item)
        setCancelCheckOpen(true)
      }} />,
      check: <Icon link size='large' color='blue' name='level up alternate' onClick={() => {
        setRecord(item)
        setCheckOpen(true)
      }} />,
      cancelapprove: <Icon link size='large' color='red' name='hand point left' onClick={() => {
        setRecord(item)
        setCancelApproveOpen(true)
      }} />,
      approve: <Icon link size='large' color='blue' name='hand point up' onClick={() => {
        setRecord(item)
        setApproveOpen(true)
      }} />,
      complete: <Icon link size='large' color='blue' name='share' onClick={() => {
        setRecord(item)
        setCompleteOpen(true)
      }} />,
      detail: <Icon link size='large' color='grey' name='history' onClick={() => {
        setRecord(item)
        setDetailOpen(true)
      }} />,
    }
  })

  const createList = list.filter(u => !u.Ischecked && !u.Isapproved && u.Ispreregistration)
  const checkList = list.filter(u => u.Ischecked && !u.Isapproved && u.Ispreregistration)
  const approveList = list.filter(u => u.Ischecked && u.Isapproved && u.Ispreregistration)
  const completeList = list.filter(u => u.Ischecked && u.Isapproved && !u.Ispreregistration)

  const tabOrder = [
    'created',
    'checked',
    'approved',
    'completed',
  ]

  const { activeTab, setActiveTab } = useTabNavigation({
    history,
    tabOrder,
    mainRoute: 'Preregistrations'
  })

  useEffect(() => {
    GetPatients()
    GetPatientdefines()
    GetCases()
    GetUsers()
    GetUsagetypes()
    GetFiles()
  }, [])

  return (
    <React.Fragment>
      <Pagewrapper dimmer isLoading={isLoading}>
        <Headerwrapper>
          <Grid columns='2' >
            <GridColumn width={8}>
              <Breadcrumb size='big'>
                <Link to={"/Preregistrations"}>
                  <Breadcrumb.Section>{t('Pages.Preregistrations.Page.Header')}</Breadcrumb.Section>
                </Link>
              </Breadcrumb>
            </GridColumn>
            <Settings
              Profile={Profile}
              Pagecreateheader={t('Pages.Preregistrations.Page.CreateHeader')}
              Pagecreatelink={"/Preregistrations/Create"}
              Showcreatebutton
            />
          </Grid>
        </Headerwrapper>
        <Pagedivider />
        <Contentwrapper>
          <Tab
            onTabChange={(_, { activeIndex }) => {
              setActiveTab(activeIndex)
            }}
            activeIndex={activeTab}
            className="w-full !bg-transparent"
            panes={[
              {
                menuItem: `${t('Pages.Preregistrations.Page.Tab.CreateHeader')} (${(createList || []).length})`,
                pane: {
                  key: 'created',
                  content: renderView({ list: createList, Columns, keys: ['created'], initialConfig })
                }
              },
              {
                menuItem: `${t('Pages.Preregistrations.Page.Tab.CheckHeader')} (${(checkList || []).length})`,
                pane: {
                  key: 'checked',
                  content: renderView({ list: checkList, Columns, keys: ['checked'], initialConfig })
                }
              },
              {
                menuItem: `${t('Pages.Preregistrations.Page.Tab.ApproveHeader')} (${(approveList || []).length})`,
                pane: {
                  key: 'approved',
                  content: renderView({ list: approveList, Columns, keys: ['approved'], initialConfig })
                }
              },
              {
                menuItem: `${t('Pages.Preregistrations.Page.Tab.CompleteHeader')} (${(completeList || []).length})`,
                pane: {
                  key: 'completed',
                  content: renderView({ list: completeList, Columns, keys: ['completed'], initialConfig })
                }
              },
            ]}
            renderActiveOnly={false}
          />
        </Contentwrapper>
      </Pagewrapper>
      <PreregistrationsDetail
        open={detailOpen}
        setOpen={setDetailOpen}
        record={record}
        setRecord={setRecord}
      />
      <PreregistrationsDelete
        open={deleteOpen}
        setOpen={setDeleteOpen}
        record={record}
        setRecord={setRecord}
      />
      <PreregistrationsCheck
        open={checkOpen}
        setOpen={setCheckOpen}
        record={record}
        setRecord={setRecord}
      />
      <PreregistrationsCancelCheck
        open={cancelCheckOpen}
        setOpen={setCancelCheckOpen}
        record={record}
        setRecord={setRecord}
      />
      <PreregistrationsCancelApprove
        open={cancelApproveOpen}
        setOpen={setCancelApproveOpen}
        record={record}
        setRecord={setRecord}
      />
      <PreregistrationsApprove
        open={approveOpen}
        setOpen={setApproveOpen}
        record={record}
        setRecord={setRecord}
      />
      <PreregistrationsComplete
        open={completeOpen}
        setOpen={setCompleteOpen}
        record={record}
        setRecord={setRecord}
      />
    </React.Fragment>
  )
}