import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Grid, GridColumn, Icon, Loader, Tab } from 'semantic-ui-react'
import { ROUTES } from '../../Utils/Constants'
import config from '../../Config'
import { Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings, DataTable, Contentwrapper } from '../../Components'
import PreregistrationsDelete from '../../Containers/Preregistrations/PreregistrationsDelete'
import PreregistrationsCheck from '../../Containers/Preregistrations/PreregistrationsCheck'
import PreregistrationsApprove from '../../Containers/Preregistrations/PreregistrationsApprove'
import PreregistrationsComplete from '../../Containers/Preregistrations/PreregistrationsComplete'
import PreregistrationsDetail from '../../Containers/Preregistrations/PreregistrationsDetail'
import GetInitialconfig from '../../Utils/GetInitialconfig'

export default class Preregistrations extends Component {


  componentDidMount() {
    const { GetPatients, GetPatientdefines, GetCases, GetUsers, GetUsagetypes, GetFiles } = this.props
    GetPatients()
    GetPatientdefines()
    GetCases()
    GetUsers()
    GetUsagetypes()
    GetFiles()
  }

  render() {

    const { Profile, Patients, Patientdefines, handleDeletemodal, handleSelectedPatient, handleCompletemodal, handleApprovemodal, handleCheckmodal, handleDetailmodal } = this.props
    const { isLoading } = Patients
    const t = Profile?.i18n?.t || null

    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    const Columns = [
      { Header: t('Common.Column.Id'), accessor: 'Id' },
      { Header: t('Common.Column.Uuid'), accessor: 'Uuid' },
      { Header: t('Pages.Preregistrations.Column.Name'), accessor: (row, disableImg) => this.nameCellhandler(row, disableImg), Title: true, Cell: (col, row) => this.imageCellhandler(col, row) },
      { Header: t('Pages.Preregistrations.Column.CountryID'), accessor: row => this.patientdefineCellhandler(row?.PatientdefineID), Subtitle: true },
      { Header: t('Pages.Preregistrations.Column.Happensdate'), accessor: row => this.dateCellhandler(row?.Happensdate), Lowtitle: true, Withtext: true },
      { Header: t('Pages.Preregistrations.Column.Approvaldate'), accessor: row => this.dateCellhandler(row?.Approvaldate), Lowtitle: true, Withtext: true },
      { Header: t('Pages.Preregistrations.Column.Case'), accessor: row => this.caseCellhandler(row?.CaseID), Lowtitle: true, Withtext: true },
      { Header: t('Pages.Preregistrations.Column.Info'), accessor: 'Info' },
      { Header: t('Pages.Preregistrations.Column.Guardiannote'), accessor: 'Guardiannote' },
      { Header: t('Pages.Preregistrations.Column.Patientcreatetime'), accessor: row => this.dateCellhandler(row?.Patientcreatetime), key: 'created' },
      { Header: t('Pages.Preregistrations.Column.Createduser'), accessor: row => this.userCellhandler(row?.CreateduserID), key: 'created' },
      { Header: t('Pages.Preregistrations.Column.Patientchecktime'), accessor: row => this.dateCellhandler(row?.Patientchecktime), key: 'checked' },
      { Header: t('Pages.Preregistrations.Column.Checkeduser'), accessor: row => this.userCellhandler(row?.CheckeduserID), key: 'checked' },
      { Header: t('Pages.Preregistrations.Column.Patientapprovetime'), accessor: row => this.dateCellhandler(row?.Patientapprovetime), key: 'approved' },
      { Header: t('Pages.Preregistrations.Column.Approveduser'), accessor: row => this.userCellhandler(row?.ApproveduserID), key: 'approved' },
      { Header: t('Pages.Preregistrations.Column.Patientcompletetime'), accessor: row => this.dateCellhandler(row?.Patientcompletetime), key: 'completed' },
      { Header: t('Pages.Preregistrations.Column.Completeduser'), accessor: row => this.userCellhandler(row?.CompleteduserID), key: 'completed' },
      { Header: t('Common.Column.Createduser'), accessor: 'Createduser' },
      { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser' },
      { Header: t('Common.Column.Createtime'), accessor: 'Createtime' },
      { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime' },
      { Header: t('Common.Column.detail'), accessor: 'detail', disableProps: true },
      { Header: t('Common.Column.define'), accessor: 'define', disableProps: true },
      { Header: t('Common.Column.check'), accessor: 'check', disableProps: true, key: 'created' },
      { Header: t('Common.Column.cancelcheck'), accessor: 'cancelcheck', disableProps: true, key: 'checked' },
      { Header: t('Common.Column.approve'), accessor: 'approve', disableProps: true, key: 'checked' },
      { Header: t('Common.Column.cancelapprove'), accessor: 'cancelapprove', disableProps: true, key: 'approved' },
      { Header: t('Common.Column.complete'), accessor: 'complete', disableProps: true, key: 'approved' },
      { Header: t('Common.Column.edit'), accessor: 'edit', disableProps: true, key: 'created' },
      { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true, disableOncomplete: true }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })


    const list = (Patients.list || []).filter(u => u.Isactive).map(item => {
      const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === item?.PatientdefineID)
      return {
        ...item,
        edit: <Link to={`/Preregistrations/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
        define: <Link key={item?.Uuid} to={`/Patientdefines/${patientdefine?.Uuid}/edit`} ><Icon size='large' color='red' className='row-edit' name='address book' /> </Link>,
        delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
          handleSelectedPatient(item)
          handleDeletemodal(true)
        }} />,
        cancelcheck: <Icon link size='large' color='red' name='level down alternate' onClick={() => {
          handleSelectedPatient(item)
          handleCheckmodal({ modal: true, deactive: true })
        }} />,
        check: <Icon link size='large' color='blue' name='level up alternate' onClick={() => {
          handleSelectedPatient(item)
          handleCheckmodal(true)
        }} />,
        cancelapprove: <Icon link size='large' color='red' name='hand point left' onClick={() => {
          handleSelectedPatient(item)
          handleApprovemodal({ modal: true, deactive: true })
        }} />,
        approve: <Icon link size='large' color='blue' name='hand point up' onClick={() => {
          handleSelectedPatient(item)
          handleApprovemodal(true)
        }} />,
        complete: <Icon link size='large' color='blue' name='share' onClick={() => {
          handleSelectedPatient(item)
          handleCompletemodal(true)
        }} />,
        detail: <Icon link size='large' color='grey' name='history' onClick={() => {
          handleSelectedPatient(item)
          handleDetailmodal(true)
        }} />,
      }
    })

    const createList = list.filter(u => !u.Ischecked && !u.Isapproved && u.Ispreregistration)
    const checkList = list.filter(u => u.Ischecked && !u.Isapproved && u.Ispreregistration)
    const approveList = list.filter(u => u.Ischecked && u.Isapproved && u.Ispreregistration)
    const completeList = list.filter(u => u.Ischecked && u.Isapproved && !u.Ispreregistration)

    return (
      isLoading ? <LoadingPage /> :
        <React.Fragment>
          <Pagewrapper>
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
                className="w-full !bg-transparent"
                panes={[
                  {
                    menuItem: `${t('Pages.Preregistrations.Page.Tab.CreateHeader')} (${(createList || []).length})`,
                    pane: {
                      key: 'created',
                      content: <Preregistrationscreated
                        Profile={Profile}
                        list={createList}
                        Columns={Columns.filter(u => u.key === 'created' || !u.key)}
                      />
                    }
                  },
                  {
                    menuItem: `${t('Pages.Preregistrations.Page.Tab.CheckHeader')} (${(checkList || []).length})`,
                    pane: {
                      key: 'checked',
                      content: <Preregistrationschecked
                        Profile={Profile}
                        list={checkList}
                        Columns={Columns.filter(u => u.key === 'checked' || !u.key)}
                      />
                    }
                  },
                  {
                    menuItem: `${t('Pages.Preregistrations.Page.Tab.ApproveHeader')} (${(approveList || []).length})`,
                    pane: {
                      key: 'approved',
                      content: <Preregistrationsapproved
                        Profile={Profile}
                        list={approveList}
                        Columns={Columns.filter(u => u.key === 'approved' || !u.key)}
                      />
                    }
                  },
                  {
                    menuItem: `${t('Pages.Preregistrations.Page.Tab.CompleteHeader')} (${(completeList || []).length})`,
                    pane: {
                      key: 'completed',
                      content: <Preregistrationscompleted
                        Profile={Profile}
                        list={completeList}
                        Columns={Columns.filter(u => (u.key === 'completed' || !u.key) && !u.disableOncomplete)}
                      />
                    }
                  },
                ]}
                renderActiveOnly={false}
              />
            </Contentwrapper>
          </Pagewrapper>
          <PreregistrationsDetail />
          <PreregistrationsDelete />
          <PreregistrationsCheck />
          <PreregistrationsApprove />
          <PreregistrationsComplete />
        </React.Fragment>
    )
  }

  nameCellhandler = (row) => {
    const { Patientdefines } = this.props
    const patient = row
    const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)
    return `${patientdefine?.Firstname} ${patientdefine?.Lastname} - ${patientdefine?.CountryID}`
  }

  imageCellhandler = (col, row) => {
    const { Files, Patientdefines, Usagetypes, Profile } = this.props
    if (!col?.cell?.isGrouped && !Profile.Ismobile) {
      const patient = col?.row?.original || row
      if (!patient?.Uuid) {
        return col?.value
      }
      const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)
      let usagetypePP = (Usagetypes.list || []).find(u => u.Value === 'PP')?.Uuid || null
      let file = (Files.list || []).filter(u => u.ParentID === patient?.Uuid).find(u => (((u.Usagetype || '').split(',')) || []).includes(usagetypePP))
      return <div className='flex justify-start items-center flex-row flex-nowrap whitespace-nowrap'>
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

  userCellhandler = (value) => {
    const { Users } = this.props
    if (Users.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const user = (Users.list || []).find(u => u.Uuid === value)
      return user ? `${user?.Name} ${user?.Surname} (${user?.Username})` : ''
    }
  }

  dateCellhandler = (value) => {
    if (value) {
      return value.split('T')[0]
    }
    return null
  }

  patientdefineCellhandler = (value) => {
    const { Patientdefines } = this.props
    if (Patientdefines.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return (Patientdefines.list || []).find(u => u.Uuid === value)?.CountryID
    }
  }

  caseCellhandler = (value) => {
    const { Cases } = this.props
    if (Cases.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return (Cases.list || []).find(u => u.Uuid === value)?.Name
    }
  }
}

function Preregistrationscreated({ Profile, Columns, list }) {
  const metaKey = "preregisrations"
  let initialConfig = GetInitialconfig(Profile, metaKey)
  const t = Profile?.i18n?.t || null
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

function Preregistrationschecked({ Profile, Columns, list }) {
  const metaKey = "preregisrations"
  let initialConfig = GetInitialconfig(Profile, metaKey)
  const t = Profile?.i18n?.t || null
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

function Preregistrationsapproved({ Profile, Columns, list }) {
  const metaKey = "preregisrations"
  let initialConfig = GetInitialconfig(Profile, metaKey)
  const t = Profile?.i18n?.t || null
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

function Preregistrationscompleted({ Profile, Columns, list }) {
  const metaKey = "preregisrations"
  let initialConfig = GetInitialconfig(Profile, metaKey)
  const t = Profile?.i18n?.t || null
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

